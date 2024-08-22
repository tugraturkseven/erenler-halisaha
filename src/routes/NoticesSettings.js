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
  const [isAdding, setIsAdding] = useState(false);
  const [notices, setNotices] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    id: "",
    message: "",
    isActive: true,
  });
  const [autoFlow, setAutoFlow] = useState(false);

  const handleSave = async () => {
    const autoFlowRes = await setNoticeAutoflow(autoFlow);
    const saveRes = await updateAllNotices(notices);

    if (autoFlowRes && saveRes) {
      toast(`Ayarlar kayıt edildi.`);
    } else {
      toast("Ayarlar kayıt edilemedi.");
    }
  };

  const handleEditButtonClick = (item) => {
    setNewAnnouncement(item);
    setIsAdding(true);
  };

  const handleAddButtonClick = async () => {
    const isExist = notices.some((item) => item.id === newAnnouncement.id);
    if (isExist && !isAdding) {
      // Notice already exist and not adding. So editing the existing notice.
      setNewAnnouncement({
        ...newAnnouncement,
        id: notices.length + 1,
      });

      setIsAdding(true);

      return;
    }
    if (isAdding) {
      const isNotUpdated = notices.some(
        (item) => item.message === newAnnouncement.message
      );
      if (newAnnouncement.message === "" || isNotUpdated) {
        setIsAdding(false);
        return;
      }

      const lastID = notices[notices.length - 1]?.id || 0;
      const res = isExist
        ? await addNotice(newAnnouncement)
        : await addNotice({
            ...newAnnouncement,
            id: lastID + 1,
          });
      if (res) {
        toast("Duyuru Eklendi");
        if (!isExist)
          setNotices([
            ...notices,
            {
              ...newAnnouncement,
              id: lastID + 1,
            },
          ]);
      }
      setNewAnnouncement({
        id: "",
        message: "",
        isActive: true,
      });
      setIsAdding(false);
    } else {
      setIsAdding(true);
    }
  };

  const handleActiveChange = (id) => {
    const filteredNotices = notices.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isActive: !item.isActive,
        };
      }
      return item;
    });
    setNotices(filteredNotices);
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
              onChange={(value) =>
                setNewAnnouncement({ ...newAnnouncement, message: value })
              }
              content={newAnnouncement?.message}
            />
          </div>
          <div className="w-full h-full px-5 flex flex-col items-center justify-center">
            <h3>Önizleme</h3>
            <AnnouncementDisplay content={newAnnouncement?.message} />
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
                      <td className="flex flex-col md:flex-row gap-5">
                        <button
                          className="btn btn-info"
                          onClick={() => handleDelete(notice.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button
                          className="btn bg-orange-500 hover:bg-orange-600 text-black"
                          onClick={() => handleEditButtonClick(notice)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleActiveChange(notice.id)}
                        >
                          {notice.isActive ? (
                            <FontAwesomeIcon icon={faEye} />
                          ) : (
                            <FontAwesomeIcon icon={faEyeSlash} />
                          )}
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

export default NoticesSettings;
