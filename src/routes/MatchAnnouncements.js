import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  getAnnouncementMessages,
  getAnnouncementLatency,
  setAnnouncementLatency,
} from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MatchAnnouncements = () => {
  const [loading, setLoading] = useState(true);
  const [latency, setLatency] = useState({
    minute: 0,
    hour: 0,
  });
  const navigate = useNavigate();
  const handleEdit = (template) => {
    // Handle edit here
    navigate("/announcementDetails", { state: { template } });
  };
  const [announcements, setAnnouncements] = useState([
    { id: 2, description: "Bitis", message: "Mesaj 2" },
    { id: 3, description: "Uzatma", message: "Mesaj 3" },
  ]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const messages = await getAnnouncementMessages();
      if (messages) {
        setAnnouncements(messages);
      }
    };
    const fetchLatency = async () => {
      const latency = await getAnnouncementLatency();
      if (latency) {
        setLatency(latency);
      }
    };

    Promise.all([fetchAnnouncements(), fetchLatency()]).then(() => {
      setLoading(false);
    });
  }, []);

  const handleSaveLatency = async () => {
    const res = await setAnnouncementLatency(latency);
    if (res) {
      toast("Gecikme Ayarı Kaydedildi");
    } else {
      toast("Gecikme Ayarı Kaydedilemedi");
    }
  };

  const saveButton = (
    <button
      className="btn btn-ghost normal-case text-xl xl:text-3xl"
      onClick={handleSaveLatency}
    >
      💾
    </button>
  );

  return (
    <div>
      <Navbar endButton={saveButton} />
      <div className="flex flex-col justify-center items-center gap-7">
        <div className="mt-7">
          <h2 className="text-lg font-bold">⏰ Gecikme Ayarı</h2>
          <label className="label">Saat </label>
          <input
            type="number"
            min={0}
            max={23}
            defaultValue={0}
            onChange={(e) => setLatency({ ...latency, hour: e.target.value })}
            className="input input-bordered w-full max-w-xs"
          />
          <label className="label">Dakika </label>
          <input
            type="number"
            min={0}
            max={59}
            defaultValue={0}
            onChange={(e) => setLatency({ ...latency, minute: e.target.value })}
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        <h2 className="text-lg font-semibold">📣 Anonslar</h2>
        <div className="overflow-x-auto max-w-2xl w-full">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Rol</th>{" "}
                {/* Name - set to take half of the remaining space */}
                <th>Mesaj</th>{" "}
                {/* Role - set to take half of the remaining space */}
                <th>Aksiyonlar</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                announcements.map((template, i) => {
                  return (
                    <tr key={template.id}>
                      <td className="text-center font-semibold">
                        {template.description}
                      </td>
                      <td className="text-center font-semibold">
                        {template.message}
                      </td>
                      <td>
                        <button
                          className="btn btn-info mr-5"
                          onClick={() => handleEdit(template)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
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

export default MatchAnnouncements;
