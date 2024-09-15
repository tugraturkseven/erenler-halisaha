import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import { getAllNotices, getNoticeAutoflow } from "../firebase";
import AnnouncementDisplay from "../components/AnnouncementDisplay";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ColorSelectBox from "../components/ColorSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faCog,
  faTable,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useSpeech } from "react-text-to-speech";

const Notices = () => {
  const [time, setTime] = useState({
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoFlow, setAutoFlow] = useState(false);
  const [color, setColor] = useState("bg-white");
  const [noticeText, setNoticeText] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [speechSettings, setSpeechSettings] = useState({
    pitch: 0.6,
    rate: 1,
    volume: 1,
    lang: "tr-TR",
    voiceURI: "",
  });
  const sliderRef = useRef(null);
  const { start, speechStatus } = useSpeech({
    text: noticeText,
    ...speechSettings,
    highlightText: false,
  });

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
    afterChange: (index) => setCurrentSlide(index),
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
      const templatesArray = Object.keys(notices).map((key) => ({
        ...notices[key],
      }));
      setNotices(templatesArray);
    }
  };

  const getPlainText = (html) => {
    var divContainer = document.createElement("div");
    divContainer.innerHTML = html;
    return divContainer.textContent || divContainer.innerText || "";
  };

  useEffect(() => {
    start();
  }, [noticeText]);

  useEffect(() => {
    if (loading || notices.length === 0) return;
    const currentMessage = notices[currentSlide].message;
    const plainText = getPlainText(currentMessage).replace(/[.,;:!?]/g, "");
    setNoticeText(plainText);
  }, [currentSlide, loading, notices]);

  useEffect(() => {
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

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  const handleSpeechSettingChange = (setting, value) => {
    setSpeechSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const renderSettingsPage = () => (
    <div className="settings-page text-black flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-6">Konuşma Ayarları</h2>
      <div className="w-64 mb-4">
        <label className="block mb-2">Perde: </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={speechSettings.pitch}
          onChange={(e) =>
            handleSpeechSettingChange("pitch", parseFloat(e.target.value))
          }
          className="w-full"
        />
      </div>
      <div className="w-64 mb-4">
        <label className="block mb-2">Hız: </label>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={speechSettings.rate}
          onChange={(e) =>
            handleSpeechSettingChange("rate", parseFloat(e.target.value))
          }
          className="w-full"
        />
      </div>
      <div className="w-64 mb-4">
        <label className="block mb-2">Ses: </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={speechSettings.volume}
          onChange={(e) =>
            handleSpeechSettingChange("volume", parseFloat(e.target.value))
          }
          className="w-full"
        />
      </div>
      <div className="w-64 mb-6">
        <label className="block mb-2">Dil: </label>
        <select
          value={speechSettings.lang}
          onChange={(e) => handleSpeechSettingChange("lang", e.target.value)}
          className="select select-bordered select-sm w-full bg-white text-black border-black border-2"
        >
          <option value="tr-TR">Türkçe</option>
          <option value="en-US">İngilizce</option>
        </select>
      </div>
      <div className="w-64 mb-6">
        <label className="block mb-2">Konuşma Sesi: </label>
        <select
          value={speechSettings.voiceURI}
          onChange={(e) =>
            handleSpeechSettingChange("voiceURI", e.target.value)
          }
          className="select select-bordered select-sm w-full bg-white text-black border-black border-2"
        >
          {window.speechSynthesis.getVoices().map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-sm" onClick={handleSettingsToggle}>
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Geri Dön
      </button>
    </div>
  );

  return (
    <div className={`flex flex-col px-5 py-20 h-screen ${color}`}>
      {!showSettings ? (
        <>
          <div className="block slider-container mx-2 md:mx-5 h-full text-center">
            {notices.length > 0 && !loading && (
              <Slider {...settings} ref={sliderRef}>
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
          <div className="absolute bottom-5 right-5 flex">
            <button className="btn btn-md mr-2" onClick={handleSettingsToggle}>
              <FontAwesomeIcon
                icon={showSettings ? faTable : faCog}
                color="white"
                size="lg"
              />
            </button>
            <button
              className="btn btn-md"
              onClick={handleFullScreenButtonClick}
            >
              <FontAwesomeIcon icon={faExpand} color="white" size="lg" />
            </button>
          </div>
        </>
      ) : (
        renderSettingsPage()
      )}
    </div>
  );
};

export default Notices;
