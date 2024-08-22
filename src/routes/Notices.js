import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { getAllNotices, getNoticeAutoflow } from "../firebase";
import AnnouncementDisplay from "../components/AnnouncementDisplay";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Notices = () => {
  const [time, setTime] = useState({
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoFlow, setAutoFlow] = useState(false);

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

  const fetchNotices = async () => {
    const notices = await getAllNotices();
    setLoading(false);
    if (!notices) return;
    const filteredNotices = notices.filter(
      (item) => item.id > 0 && item.isActive
    );
    setNotices(filteredNotices);
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

  return (
    <div className="flex flex-col m-5 h-screen">
      <div className="flex flex-row w-full justify-between">
        <div
          className="flex flex-col items-center justify-center relative cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          <img src="assets/logo.png" className="relative" />
          <span className="absolute bottom-10 tracking-widest font-bold text-lg">
            EFELERPARK
          </span>
        </div>
        <div className="flex flex-row gap-10">
          <span className="text-3xl font-semibold">{time.date}</span>
          <span className="text-3xl font-semibold w-32">{time.time}</span>
        </div>
      </div>
      <div className="block slider-container mx-5 h-full text-center">
        {notices.length > 0 && !loading && (
          <Slider {...settings}>
            {notices.map((notice) => {
              return <AnnouncementDisplay content={notice.message} />;
            })}
          </Slider>
        )}
        {notices.length === 0 && !loading && (
          <span className="text-3xl font-semibold tracking-widest">
            Güncel duyuru bulunmamaktadır!
          </span>
        )}
      </div>
    </div>
  );
};

export default Notices;