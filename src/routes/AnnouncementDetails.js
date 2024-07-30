import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { saveAnnouncementMessage } from "../firebase";

const AnnouncementDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { template } = location.state || {};
  const [announcement, setAnnouncement] = useState(template);

  useEffect(() => {}, []);

  const handleSave = async () => {
    await saveAnnouncementMessage(announcement);
    navigate("/announcements");
  };

  const handleGoBack = () => {
    navigate("/announcements");
  };

  const handleTemplateChange = (e) => {
    setAnnouncement({ ...announcement, message: e.target.value });
  };

  return (
    <div className="text-center items-center justify-start flex flex-col gap-5">
      <Navbar />
      <div className="w-full max-w-xl px-10 md:px-5 lg:px-0">
        <div>
          <div className="w-full flex items-center flex-col">
            <div className="form-control w-full max-w-xl">
              <label className="label">
                <span className="label-text"></span>
                <span className="label-text">📝 Duyuru Adı</span>
                <span className="label-text"></span>
              </label>
              <p className="text-xl font-semibold underline underline-offset-4 text-green-600">
                {announcement.description}
              </p>
            </div>
            <div className="form-control w-full max-w-xl mt-5 h-fit">
              <label className="label">
                <span className="label-text"></span>
                <span className="label-text">📄 Duyuru Metni</span>
                <span className="label-text"></span>
              </label>
              <textarea
                placeholder="Sablon Metni"
                value={announcement.message}
                className="textarea textarea-bordered textarea-lg w-full text-center "
                onChange={(e) => handleTemplateChange(e)}
                style={{ minHeight: "40vh" }}
              />
              <div className="flex flex-row justify-center items-center gap-5 mt-5">
                <button
                  className="btn btn-outline btn-square text-xl"
                  onClick={() => handleGoBack()}
                >
                  🚪
                </button>
                <button
                  className="btn btn-outline btn-square text-xl"
                  onClick={() => handleSave()}
                >
                  💾
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetails;
