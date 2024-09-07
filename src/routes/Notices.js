import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { getAllNotices, getNoticeAutoflow } from "../firebase";
import AnnouncementDisplay from "../components/AnnouncementDisplay";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ColorSelectBox from "../components/ColorSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

const Notices = () => {
  const [time, setTime] = useState({
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoFlow, setAutoFlow] = useState(false);
  const [color, setColor] = useState("bg-white");

  const settings = {
    dots: true,
    infinite: notices.length > 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: autoFlow,
    speed: 2000,
    autoplaySpeed: 10000,
    cssEase: "linear",
  };

  const fetchAutoFlow = async () => {
    const res = await getNoticeAutoflow();

    if (res) {
      setAutoFlow(res);
    }
  };

  const isArray = (obj) => Array.isArray(obj);

  const fetchNotices = async () => {
    const notices = await getAllNotices();
    setLoading(false);
    if (!notices) return;
    if (isArray(notices)) {
      const filteredNotices = notices.filter(
        (item) => item.message.length > 0 && item.isActive
      );
      setNotices(filteredNotices);
    } else {
      // Convert the object into an array if necessary
      const templatesArray = Object.keys(notices).map((key) => ({
        ...notices[key],
      }));
      setNotices(templatesArray);
    }
  };

  useEffect(() => {
    if (!notices.length <= 0) return;
    fetchNotices();
    fetchAutoFlow();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime({
        date: new Date().toLocaleDateString("tr-TR"),
        time: new Date().toLocaleTimeString("tr-TR"),
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleFullScreenButtonClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div className={`flex flex-col px-5 py-20 h-screen ${color}`}>
      {/* <div className="flex flex-col md:flex-row w-full justify-between items-center md:items-start">
        <div
          className="flex flex-col items-center justify-center relative cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          <img src="assets/logo.png" className="relative w-32 md:w-auto" />
          <span className="absolute bottom-10 tracking-widest font-bold text-lg text-center md:text-left">
            EFELERPARK
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-10 mt-4 md:mt-0">
          <span className="text-xl md:text-3xl font-semibold">{time.date}</span>
          <span className="text-xl md:text-3xl font-semibold w-32">
            {time.time}
          </span>
        </div>
      </div> */}
      <div className="block slider-container mx-2 md:mx-5 h-full text-center">
        {notices.length > 0 && !loading && (
          <Slider {...settings}>
            {notices.map((notice, index) => {
              return (
                <AnnouncementDisplay key={index} content={notice.message} />
              );
            })}
          </Slider>
        )}
        {notices.length === 0 && !loading && (
          <span className="text-xl md:text-3xl font-semibold tracking-widest">
            Güncel duyuru bulunmamaktadır!
          </span>
        )}
      </div>
      <ColorSelectBox onColorChange={setColor} className="mt-5 md:mt-0" />
      <button
        className="btn btn-md absolute bottom-5 right-5"
        onClick={handleFullScreenButtonClick}
      >
        <FontAwesomeIcon icon={faExpand} color="white" size="lg" />
      </button>
    </div>
  );
};

export default Notices;
