import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import DateIndicator from "../components/DateIndicator";
import { toast } from "react-toastify";
import {
  getFinancialData,
  addFinancialRecord,
  updateFinancialRecord,
  deleteFinancialRecord,
} from "../firebase";

const FinancialSettings = () => {
  const [financialData, setFinancialData] = useState({
    incomes: {},
    expenses: {},
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );
  const [records, setRecords] = useState([]);
  const [type, setType] = useState("income"); // 'income' or 'expense'
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editRecordId, setEditRecordId] = useState(null);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  useEffect(() => {
    loadRecords();
  }, [selectedYear, selectedMonth, type, financialData]);

  const fetchFinancialData = async () => {
    try {
      const data = await getFinancialData();
      setFinancialData(data);
    } catch (error) {
      console.error("Error fetching financial data:", error);
      toast.error("Finansal veriler yüklenemedi.");
    }
  };

  const loadRecords = () => {
    const monthData =
      financialData[type + "s"]?.[selectedYear]?.[selectedMonth] || {};
    setRecords(
      Object.entries(monthData).map(([id, record]) => ({ id, ...record }))
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddRecord = async () => {
    if (!form.description || !form.amount || !form.date) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      await addFinancialRecord(type, selectedYear, selectedMonth, form);
      toast.success("Kayıt eklendi.");
      fetchFinancialData();
      setForm({ description: "", amount: "", category: "", date: "" });
    } catch (error) {
      console.error("Error adding record:", error);
      toast.error("Kayıt eklenirken bir hata oluştu.");
    }
  };

  const handleUpdateRecord = async () => {
    if (!form.description || !form.amount || !form.date) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      await updateFinancialRecord(
        type,
        selectedYear,
        selectedMonth,
        editRecordId,
        form
      );
      toast.success("Kayıt güncellendi.");
      fetchFinancialData();
      setForm({
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
      setIsEditing(false);
      setEditRecordId(null);
    } catch (error) {
      console.error("Error updating record:", error);
      toast.error("Kayıt güncellenirken bir hata oluştu.");
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;

    try {
      await deleteFinancialRecord(type, selectedYear, selectedMonth, id);
      toast.success("Kayıt silindi.");
      fetchFinancialData();
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Kayıt silinirken bir hata oluştu.");
    }
  };

  const handleEditClick = (record) => {
    setIsEditing(true);
    setEditRecordId(record.id);
    setForm({
      description: record.description,
      amount: record.amount,
      category: record.category,
      date: record.date,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditRecordId(null);
    setForm({ description: "", amount: "", category: "", date: "" });
  };

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const totalAmount = records.reduce(
    (sum, record) => sum + Number(record.amount),
    0
  );
  const formattedTotal = totalAmount.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
  });

  return (
    <div>
      <Navbar />
      <div className="p-5 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Finans Takip</h1>

        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="form-control">
              <label className="label">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={type === "income"}
                  className="radio checked:bg-green-500"
                  onChange={() => setType("income")}
                />
                <span className="label-text ml-3">Gelir</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={type === "expense"}
                  onChange={() => setType("expense")}
                  className="radio checked:bg-red-500"
                />
                <span className="label-text ml-3">Tahakkuk</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4 w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-2">
            {isEditing
              ? "Kayıt Güncelle"
              : `Yeni ${type === "income" ? "Gelir" : "Tahakkuk"} Ekle`}
          </h2>
          <div className="flex flex-col gap-2">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="category"
              placeholder="Kategori"
              value={form.category}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
            <input
              type="number"
              name="amount"
              placeholder="Miktar"
              value={form.amount}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="description"
              placeholder="Açıklama"
              value={form.description}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateRecord}
                  className="btn btn-primary w-full"
                >
                  Güncelle
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="btn btn-secondary w-full"
                >
                  İptal
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddRecord}
                className="btn btn-primary w-full"
              >
                Ekle
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 w-full">
          <h2 className="text-xl font-semibold mb-2">
            {type === "income" ? "Gelirler" : "Tahakkuklar"}
          </h2>
          <div className="flex flex-row gap-5">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="select select-bordered"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="select select-bordered"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <span className="text-lg font-semibold">
            Toplam {type === "income" ? "Gelir" : "Tahakkuk"} : {formattedTotal}
          </span>
          {!isEditing && (
            <div className="w-full max-w-2xl">
              {records.length === 0 ? (
                <p className="text-center text-gray-500 my-4">
                  Bu döneme ait herhangi bir{" "}
                  {type === "income" ? "gelir" : "tahakkuk"} bulunmamaktadır.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className={`card bg-base-100 shadow-xl border-l-4 ${
                        type === "income"
                          ? "border-green-500"
                          : "border-red-500"
                      }`}
                    >
                      <div className="card-body p-4 min-w-52">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="card-title text-lg mb-2">
                              {record.description}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-semibold">Kategori:</span>{" "}
                              {record.category || "Belirtilmemiş"}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-semibold">Tarih:</span>{" "}
                              {record.date}
                            </p>
                            <p
                              className={`text-lg font-bold ${
                                type === "income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {record.amount} ₺
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleEditClick(record)}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-error btn-sm"
                              onClick={() => handleDeleteRecord(record.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialSettings;
