import React, { useState, useEffect, useContext } from "react";
import { PitchListContext } from "../contexts/PitchListContext";
import ScoreCard from "../components/ScoreCard";
import {
  getReservationDetails,
  getAnnouncementMessages,
  getReservations,
} from "../firebase";
import { useSpeech } from "react-text-to-speech";

const Score = () => {
  const pitchList = useContext(PitchListContext);
  const [reservations, setReservations] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [pitch, setPitch] = useState({
    name: "",
    minute: "",
  });
  const [scores, setScores] = useState({
    teamA: 0,
    teamB: 0,
  });

  const [time, setTime] = useState({
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  const [text, setText] = useState("");
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

  function formatMinutes(minutes) {
    return String(minutes).padStart(2, "0");
  }

  const checkReservation = async () => {
    const finish =
      announcements.find((item) => item?.description === "Bitis")?.message ||
      "Son düdük! Maç bitti!";
    const date = new Date().toLocaleDateString("tr").replace(/\./g, "-");
    const start =
      announcements.find((item) => item?.description === "Baslangic")
        ?.message || "İlk düdük! Maç başladı!";

    const index = reservations.findIndex(
      (item) => item.hour === new Date().getHours().toString() // mac saati ile anlik saati karsilastirma item.hour === new Date().getHours().toString()
    );

    const reservationDetails = await getReservationDetails(
      date,
      pitch.name,
      index
    );
    const { reservationType, reservedUserName } = reservationDetails;
    if (reservationType === "Kesin Rez." && reservedUserName) {
      if (isPlaying) {
        // Make an announcement for end of the current game.
        setText(finish);
        // wait for 60 seconds
        setTimeout(() => {
          setText(start);
        }, 60000);
      } else {
        // Make an announcement for start of the current game.
        setText(start);
        setIsPlaying(true);
      }
    } else {
      if (isPlaying) {
        // Make an announcement for end of the current game.
        const extraTime =
          announcements.find((item) => item?.description === "Uzatma")
            ?.message || "Maç bitmek üzere, son dakfikalar!";
        setText(extraTime);
      }
    }
  };

  const handleTestSpeak = () => {
    setText("test anonsu yapılıyor!");
  };

  const fetchReservations = async () => {
    const date = new Date().toLocaleDateString("tr").replace(/\./g, "-");
    const items = await getReservations(date, pitch.name);
    setReservations(items);
  };

  const fetchAnnouncements = async () => {
    const messages = await getAnnouncementMessages();
    setAnnouncements(messages);
  };

  useEffect(() => {
    if (!pitch.name || !pitch.minute) return;
    const minute = pitch.minute;
    fetchReservations();
    fetchAnnouncements();

    window.addEventListener("keydown", handleKeyPress);

    const interval = setInterval(() => {
      setTime({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      if (
        minute === formatMinutes(new Date().getMinutes()) && // sahaya ait dakika ile anlik dakikayi karsilastirma
        `00` === formatMinutes(new Date().getSeconds())
      ) {
        checkReservation();
      }
    }, 1000);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearInterval(interval);
    };
  }, [pitch]);

  const handleScoreChange = (teamIndex, value) => {
    const teamName = teamIndex === 0 ? "teamA" : "teamB";
    setScores((prevScores) => {
      const newScore = prevScores[teamName] + value;
      if (newScore < 0) return prevScores; // Prevent negative scores
      return { ...prevScores, [teamName]: newScore };
    });
  };

  const handleNavigateBackWithPassword = () => {
    const password = "44153";
    const userInput = prompt("Sifrenizi giriniz");
    if (userInput === password) {
      window.location.href = "/settings";
    } else {
      alert("Hatalı sifre");
    }
  };

  const handleKeyPress = (e) => {
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
        <span className="text-5xl font-semibold">{time.date}</span>
        <span className="text-5xl font-semibold">{time.time}</span>
        <div className="flex flex-row justify-between p-2 bg-white rounded gap-5">
          <button className="text-3xl" onClick={handleNavigateBackWithPassword}>
            ⚙️
          </button>
          <button
            className="text-3xl"
            onClick={() => setScores({ teamA: 0, teamB: 0 })}
          >
            ↩️
          </button>
          <button className="text-3xl" onClick={handleTestSpeak}>
            🔊
          </button>
        </div>
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
