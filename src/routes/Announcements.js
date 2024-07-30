import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getAnnouncementMessages } from "../firebase";
import { useNavigate } from "react-router-dom";

const Announcements = () => {
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const handleEdit = (template) => {
    // Handle edit here
    navigate("/announcementDetails", { state: { template } });
  };
  const [announcements, setAnnouncements] = useState([
    { id: 1, description: "Baslangic", message: "Mesaj 1" },
    { id: 2, description: "Bitis", message: "Mesaj 2" },
    { id: 3, description: "Uzatma", message: "Mesaj 3" },
  ]);

  useEffect(() => {
    getAnnouncementMessages().then((data) => {
      setAnnouncements(data);
      setLoading(false);
    });
  }, []);
  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center gap-7">
        <h1 className="text-lg font-semibold">📣 Duyurular</h1>
        <div className="overflow-x-auto max-w-2xl w-full">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Rol</th>{" "}
                {/* Name - set to take half of the remaining space */}
                <th>Mesaj</th>{" "}
                {/* Role - set to take half of the remaining space */}
                <th>Aksiyonlar</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                announcements.map((template, index) => {
                  return (
                    <tr key={template.id}>
                      <th className="text-center">{index + 1}</th>
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

export default Announcements;
