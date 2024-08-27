import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faEyeSlash,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import AnnouncementDisplay from "../components/AnnouncementDisplay";
import AnnouncementEditor from "../components/AnnouncementEditor";
import {
  addNotice,
  deleteAllNotices,
  getAllNotices,
  deleteNotice,
  setNoticeAutoflow,
  getNoticeAutoflow,
  updateAllNotices,
} from "../firebase";
import { toast } from "react-toastify";

const NoticesSettings = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [notices, setNotices] = useState([]);
  const [currentNotice, setCurrentNotice] = useState({
    message: "",
    isActive: true,
  });
  const [autoFlow, setAutoFlow] = useState(false);
  const isArray = (item) => Array.isArray(item);

  useEffect(() => {
    const fetchData = async () => {
      const [noticesRes, autoFlowRes] = await Promise.all([
        getAllNotices(),
        getNoticeAutoflow(),
      ]);

      if (!noticesRes) return;
      if (isArray(noticesRes)) {
        const filteredNotices = noticesRes.filter(
          (notice) => notice.message.length > 0
        );
        setNotices(filteredNotices);
      } else {
        // Convert the object into an array if necessary
        const templatesArray = Object.keys(noticesRes).map((key) => ({
          ...noticesRes[key],
        }));
        setNotices(templatesArray);
      }
      setAutoFlow(autoFlowRes);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    const autoFlowRes = await setNoticeAutoflow(autoFlow);
    const saveRes = await updateAllNotices(notices);
    toast(
      autoFlowRes && saveRes
        ? "Ayarlar kayıt edildi."
        : "Ayarlar kayıt edilemedi."
    );
  };

  const handleEditClick = (notice) => {
    setCurrentNotice(notice);
    setIsEditing(true);
    setEditIndex(notices.indexOf(notice));
  };

  const handleAddClick = async () => {
    if (isEditing) {
      if (
        !currentNotice.message ||
        (notices &&
          notices.length > 0 &&
          notices.some((notice) => notice.message === currentNotice.message))
      ) {
        setIsEditing(false);
        return;
      }
      const dbIndex = editIndex === -1 ? notices.length : editIndex;
      const res = await addNotice(currentNotice, dbIndex);
      if (res) {
        toast("Duyuru Eklendi");
        if (editIndex !== -1) {
          setNotices((notices) =>
            notices.map((notice, i) =>
              i === editIndex
                ? { ...notice, message: currentNotice.message }
                : notice
            )
          );
        } else {
          setNotices((notices) => [...notices, currentNotice]);
        }
        setCurrentNotice({ message: "", isActive: true });
        setIsEditing(false);
        setEditIndex(-1);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleToggleActive = (index) => {
    setNotices((notices) =>
      notices.map((notice, i) =>
        i === index ? { ...notice, isActive: !notice.isActive } : notice
      )
    );
  };

  const handleDeleteClick = async (index) => {
    if (notices.length === 1) {
      const deleteAllRes = await deleteAllNotices();
      if (deleteAllRes) {
        setNotices([]);
        toast("Duyurular Silindi");
        return;
      }
    }
    const res = await deleteNotice(index);
    if (res) {
      setNotices((notices) => notices.filter((_, i) => i !== index));
      toast("Duyuru Silindi");
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-screen overflow-hidden">
        <div className="flex flex-col justify-center items-center gap-7">
          <button
            className="btn btn-success text-secondary-content mt-10 w-40"
            onClick={handleAddClick}
          >
            🚀 TAMAM
          </button>
          <div className="w-full px-5 h-full min-h-52">
            <AnnouncementEditor
              onChange={(value) =>
                setCurrentNotice({ ...currentNotice, message: value })
              }
              content={currentNotice.message}
            />
          </div>
          <div className="w-full h-full px-5 flex flex-col items-center justify-center">
            <h3>Önizleme</h3>
            <AnnouncementDisplay content={currentNotice.message} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar
        endButton={
          <button
            className="btn btn-ghost normal-case text-xl xl:text-3xl"
            onClick={handleSaveSettings}
          >
            💾
          </button>
        }
      />
      <div className="flex flex-col justify-center items-center gap-7">
        <button
          className="btn btn-secondary text-secondary-content mt-10 w-40"
          onClick={handleAddClick}
        >
          ➕ Duyuru Ekle
        </button>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">🔧 Duyuru Ayarları</h2>
          <div className="mt-5">
            <label className="label cursor-pointer flex gap-2">
              <input
                type="checkbox"
                className="checkbox"
                onChange={(e) => setAutoFlow(e.target.checked)}
                checked={autoFlow}
              />
              <span className="text-md font-semibold"> Otomatik Kaydır</span>
            </label>
          </div>
        </div>
        <h2 className="text-lg font-semibold">📣 Duyurular</h2>
        <div className="overflow-x-auto max-w-2xl w-full">
          <table className="table">
            <thead>
              <tr>
                <th>Mesaj</th>
                <th>Aksiyonlar</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                notices.length > 0 &&
                notices.map((notice, index) => (
                  <tr key={index}>
                    <td className="font-semibold">{notice.message}</td>
                    <td className="flex flex-col md:flex-row gap-5">
                      <button
                        className="btn btn-info"
                        onClick={() => handleDeleteClick(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        className="btn bg-orange-500 hover:bg-orange-600 text-black"
                        onClick={() => handleEditClick(notice)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleToggleActive(index)}
                      >
                        <FontAwesomeIcon
                          icon={notice.isActive ? faEye : faEyeSlash}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NoticesSettings;
