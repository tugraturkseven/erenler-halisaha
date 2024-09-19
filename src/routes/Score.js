import React, { useState, useEffect, useContext } from "react";
import { PitchListContext } from "../contexts/PitchListContext";
import ScoreCard from "../components/ScoreCard";
import {
  getReservationDetails,
  getAnnouncementMessages,
  getReservations,
  getAnnouncementLatency,
} from "../firebase";
import { useSpeech } from "react-text-to-speech";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

const Score = () => {
  const pitchList = useContext(PitchListContext);
  const [reservations, setReservations] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [exitRequest, setExitRequest] = useState({
    password: "",
    exit: false,
  });
  const [pitch, setPitch] = useState({
    name: "",
    minute: "",
  });
  const [scores, setScores] = useState({
    teamA: 0,
    teamB: 0,
  });
  const [announcementLatency, setAnnouncementLatency] = useState({
    minute: 0,
    hour: 0,
  });
  const [time, setTime] = useState({
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const { start } = useSpeech({
    text: text,
    pitch: 0.6,
    rate: 1,
    volume: 1,
    lang: "tr-TR",
    voiceURI: "",
    highlightText: false,
  });

  useEffect(() => {
    if (text.length == 0) return;
    start();
  }, [text]);

  const handleTestSpeak = () => {
    if (text === "test anonsu yapılıyor!") {
      setText("test anonsu yapılıyor.");
    } else {
      setText("test anonsu yapılıyor!");
    }
  };

  function formatTime(minutes) {
    return String(minutes).padStart(2, "0");
  }

  const getPreviousReservationHour = (pitchMinute) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // If the current time is before the pitch minute in this hour
    if (currentMinute < pitchMinute) {
      return currentHour - 1 >= 0 ? formatTime(currentHour - 1) : 23; // Return the previous hour, handle midnight case
    } else {
      return formatTime(currentHour); // If it's past the pitch minute in the current hour, return this hour
    }
  };

  const fetchReservations = async () => {
    const date = new Date().toLocaleDateString("tr").replace(/\./g, "-");
    const items = await getReservations(date, pitch.name);
    setReservations(items);

    const previousReservationHour = getPreviousReservationHour(pitch.minute);
    // Check isPlaying at the moment of reservations fetched
    const currentReservation = items.find(
      (item) => item.hour == formatTime(previousReservationHour)
    );

    const { reservationType, reservedUserName } = currentReservation;

    if (reservationType == "Kesin Rez." && reservedUserName) setIsPlaying(true);
  };

  const fetchAnnouncements = async () => {
    const messages = await getAnnouncementMessages();
    if (messages) {
      // Filter messages from empty items.
      const filteredMessages = messages.filter((item) => item?.message);
      // Check the local storage for announcements is the same as the database
      const localAnnouncements = JSON.parse(
        localStorage.getItem("announcements")
      );
      if (localAnnouncements) {
        if (
          JSON.stringify(localAnnouncements) !==
          JSON.stringify(filteredMessages)
        ) {
          localStorage.setItem(
            "announcements",
            JSON.stringify(filteredMessages)
          );
        }
      } else {
        localStorage.setItem("announcements", JSON.stringify(filteredMessages));
      }
      setAnnouncements(filteredMessages);
    } else {
      const localAnnouncements = JSON.parse(
        localStorage.getItem("announcements")
      );
      if (localAnnouncements) {
        setAnnouncements(localAnnouncements);
      } else {
        const defaultAnnouncements = [
          {
            description: "Bitis",
            id: 2,
            message:
              "Maçınız sona ermiştir. Lütfen formalarınızı saha içerisinde bırakmayınız.",
          },
          {
            description: "Uzatma",
            id: 3,
            message: "Oynamak isterseniz on dakika uzatma.",
          },
        ];
        localStorage.setItem(
          "announcements",
          JSON.stringify(defaultAnnouncements)
        );
        setAnnouncements(defaultAnnouncements);
      }
    }
  };

  const fetchAnnouncementLatency = async () => {
    const latency = await getAnnouncementLatency();
    if (latency) {
      setAnnouncementLatency(latency);
    }
  };

  useEffect(() => {
    if (loading) return;
    window.addEventListener("keydown", handleKeyPress);
    const minute = pitch.minute;

    const interval = setInterval(() => {
      setTime({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      if (
        minute == formatTime(new Date().getMinutes()) && // sahaya ait dakika ile anlik dakikayi karsilastirma
        `00` == formatTime(new Date().getSeconds())
      ) {
        checkReservation();
      }
    }, 1000);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearInterval(interval);
    };
  }, [loading]);

  useEffect(() => {
    if (!pitch.name || !pitch.minute) return;
    Promise.all([
      fetchReservations(),
      fetchAnnouncements(),
      fetchAnnouncementLatency(),
    ]).then(() => {
      setLoading(false);
    });
    document.documentElement.requestFullscreen();
  }, [pitch]);

  const playRing = () => {
    return new Promise((resolve) => {
      const audio = new Audio("/assets/ring.mp4");
      audio.play();
      audio.onended = resolve;
    });
  };

  const checkReservation = async () => {
    const finish = announcements.find(
      (item) => item.description == "Bitis"
    ).message;
    const date = new Date().toLocaleDateString("tr").replace(/\./g, "-");

    const index = reservations.findIndex(
      (item) => item.hour == formatTime(new Date().getHours().toString()) // mac saati ile anlik saati karsilastirma item.hour === new Date().getHours().toString()
    );
    const reservationDetails = await getReservationDetails(
      date,
      pitch.name,
      index
    );

    if (!reservationDetails) return;

    const { reservationType, reservedUserName } = reservationDetails;

    if (reservationType == "Kesin Rez." && reservedUserName) {
      if (isPlaying) {
        // Make an announcement for end of the current game.
        await playRing();
        setText(finish);
      } else {
        setIsPlaying(true);
      }
    } else {
      // No reservation at the moment
      if (isPlaying) {
        // Check for end of the current game.
        // Make an announcement for end of the current game.
        const extraTime = announcements.find(
          (item) => item.description == "Uzatma"
        ).message;
        setText(extraTime);
        // wait for 10 minutes and announce end of the game
        setTimeout(async () => {
          // Play the ring mp4 file
          await playRing();
          setText(finish);
          setIsPlaying(false);
        }, 10 * 60 * 1000);
      }
    }
  };

  const handleScoreChange = (teamIndex, value) => {
    const teamName = teamIndex === 0 ? "teamA" : "teamB";
    setScores((prevScores) => {
      const newScore = prevScores[teamName] + value;
      if (newScore < 0) return prevScores; // Prevent negative scores
      return { ...prevScores, [teamName]: newScore };
    });
  };

  const handleNavigateBackWithPassword = () => {
    const password = "11111";
    const userInput = prompt("Sifrenizi giriniz");
    if (userInput === password) {
      window.location.href = "/settings";
    } else {
      alert("Hatalı sifre");
    }
  };

  const handleFullScreenButtonClick = () => {
    if (document.fullscreenElement) {
      // Add a delay to wait for the exit from fullscreen to complete
      if (exitRequest.exit) {
        if (exitRequest.password === "11111") {
          document.exitFullscreen();
          setExitRequest({ exit: false, password: "" });
        } else {
          setExitRequest({ exit: false, password: "" });
        }
      } else {
        setExitRequest({ exit: true, password: "" });
      }
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const handleKeyPress = (e) => {
    // If target is an input element, do nothing
    if (e.target.tagName === "INPUT") return;
    switch (e.key) {
      case `1`:
        handleScoreChange(0, -1);
        break;
      case `2`:
        handleScoreChange(0, 1);
        break;
      case `3`:
        handleScoreChange(1, -1);
        break;
      case `4`:
        handleScoreChange(1, 1);
        break;
      case `5`:
        setScores({ teamA: 0, teamB: 0 });
        break;
      // If ESC is pressed and the document is in fullscreen, prevent the default behavior
      case `Escape`:
        if (document.fullscreenElement) {
          e.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  if (!pitch.name || !pitch.minute) {
    return (
      <div className="w-full h-screen flex flex-row items-center justify-evenly gap-16">
        {pitchList.map((pitch) => (
          <button
            className="size-52 p-10 rounded-lg bg-accent text-accent-content font-bold text-3xl"
            onClick={() => setPitch(pitch)}
            key={pitch.name}
          >
            {pitch.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-row items-center justify-evenly">
      <ScoreCard
        teamName={"TAKIM 1"}
        teamIndex={0}
        score={scores.teamA}
        setScore={handleScoreChange}
      />

      <div className="flex flex-col items-center justify-evenly h-96">
        <h1 className="text-5xl font-semibold tracking-widest">EFELERPARK</h1>
        <span className="text-5xl font-semibold">
          {String(pitch.name).toUpperCase()}
        </span>
        <span className="text-5xl font-semibold">{time.date}</span>
        <span className="text-5xl font-semibold">{time.time}</span>
        {exitRequest.exit ? (
          <div className="flex flex-row justify-between p-2 bg-white rounded gap-5">
            <input
              type="password"
              placeholder="Sifrenizi giriniz"
              className="input input-bordered w-full max-w-xs"
              autoComplete="off"
              autoSave="off"
              onChange={(e) =>
                setExitRequest({ ...exitRequest, password: e.target.value })
              }
            />
            <button
              className="btn btn-md text-xl "
              onClick={handleFullScreenButtonClick}
            >
              Tamam
            </button>
          </div>
        ) : (
          <div className="flex flex-row justify-between p-2 bg-white rounded gap-5">
            <button
              className="text-3xl"
              onClick={handleNavigateBackWithPassword}
            >
              ⚙️
            </button>
            <button
              className="text-3xl"
              onClick={() => setScores({ teamA: 0, teamB: 0 })}
            >
              ↩️
            </button>
            <button className="text-3xl" onClick={playRing}>
              🔊
            </button>
            <button className="text-3xl" onClick={handleFullScreenButtonClick}>
              <FontAwesomeIcon icon={faExpand} color="black" />
            </button>
          </div>
        )}
      </div>
      <ScoreCard
        teamName={"TAKIM 2"}
        teamIndex={1}
        score={scores.teamB}
        setScore={handleScoreChange}
      />
    </div>
  );
};

export default Score;
