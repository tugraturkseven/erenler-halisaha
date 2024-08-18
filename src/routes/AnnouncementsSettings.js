import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import AnnouncementDisplay from "../components/AnnouncementDisplay";
import AnnouncementEditor from "../components/AnnouncementEditor";
import {
  addNotice,
  deleteAllNotices,
  getAllNotices,
  deleteNotice,
  setNoticeAutoflow,
  getNoticeAutoflow,
} from "../firebase";
import { toast } from "react-toastify";

const AnnouncementSettings = () => {
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [notices, setNotices] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [autoFlow, setAutoFlow] = useState(false);

  const handleSave = async () => {
    const res = await setNoticeAutoflow(autoFlow);
    if (res) {
      toast("Otomatik kaydırma ayarı kayıt edildi.");
    } else {
      toast("Otomatik kaydırma ayarı kayıt edilemedi.");
    }
  };

  const handleAddButtonClick = async () => {
    if (isAdding) {
      const res = await addNotice({
        id: notices.length + 1,
        message: newAnnouncement,
      });
      if (res) {
        toast("Duyuru Eklendi");
        setNotices([
          ...notices,
          {
            id: notices.length + 1,
            message: newAnnouncement,
          },
        ]);
      }
      setNewAnnouncement(``);
      setIsAdding(false);
    } else {
      setIsAdding(true);
    }
  };

  const handleDelete = async (id) => {
    if (id) {
      const res = await deleteNotice(id);
      const filteredNotices = notices.filter((item) => item.id !== id);
      setNotices(filteredNotices);
      toast("Duyuru Silindi");
    } else {
      const res = await deleteAllNotices(id);
      setNotices([]);
      toast("Tüm duyurular silindi!");
    }
  };

  const fetchAutoflow = async () => {
    const res = await getNoticeAutoflow();
    if (res) {
      console.log("res", res);
      setAutoFlow(res);
    }
  };

  const fetchNotices = async () => {
    const notices = await getAllNotices();
    if (!notices) return;
    const filteredNotices = notices?.filter((item) => item.id > 0);
    setNotices(filteredNotices);
    setLoading(false);
  };

  useEffect(() => {
    if (!notices.length <= 0) return;
    fetchNotices();
    fetchAutoflow();
  }, []);

  const saveButton = (
    <button
      className="btn btn-ghost normal-case text-xl xl:text-3xl"
      onClick={handleSave}
    >
      💾
    </button>
  );
  if (isAdding) {
    return (
      <div className="max-w-screen overflow-hidden">
        <Navbar />
        <div className="flex flex-col justify-center items-center gap-7">
          <button
            className="btn btn-success text-secondary-content mt-10 w-40"
            onClick={handleAddButtonClick}
          >
            🚀 TAMAM
          </button>
          <div className="w-full px-5 ">
            <AnnouncementEditor
              onChange={(value) => setNewAnnouncement(value)}
            />
          </div>
          <div className="w-full h-full px-5 flex flex-col items-center justify-center">
            <h3>Önizleme</h3>
            <AnnouncementDisplay content={newAnnouncement} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Navbar endButton={saveButton} />
      <div className="flex flex-col justify-center items-center gap-7">
        <button
          className="btn btn-secondary text-secondary-content mt-10 w-40"
          onClick={handleAddButtonClick}
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
                onChange={(e) => {
                  setAutoFlow(e.target.checked);
                }}
                checked={autoFlow}
              />
              <span className="text-md font-semibold"> Otomatik Kaydır</span>
            </label>
          </div>
        </div>

        <h2 className="text-lg font-semibold">📣 Duyurular</h2>
        <div className="overflow-x-auto max-w-2xl w-full">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                {/* Name - set to take half of the remaining space */}
                <th>Mesaj</th>{" "}
                {/* Role - set to take half of the remaining space */}
                <th>Aksiyonlar</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                notices.map((notice, index) => {
                  return (
                    <tr key={notice.id}>
                      <th className="">{index}</th>
                      <td className="font-semibold">{notice.message}</td>
                      <td>
                        <button
                          className="btn btn-info mr-5"
                          onClick={() => handleDelete(notice.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSettings;
