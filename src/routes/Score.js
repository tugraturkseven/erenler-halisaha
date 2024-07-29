import React, { useState, useEffect, useContext } from "react";
import { PitchListContext } from "../contexts/PitchListContext";
import ScoreCard from "../components/ScoreCard";
import { getReservationDetails } from "../firebase";
import { ReservationSchemaContext } from "../contexts/ReservationSchemaContext";

const Score = () => {
  const pitchList = useContext(PitchListContext);
  const reservationSchema = useContext(ReservationSchemaContext);
  const [isPlaying, setIsPlaying] = useState(false);
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

  function formatMinutes(minutes) {
    return String(minutes).padStart(2, "0");
  }

  useEffect(() => {
    if (!pitch.name || !pitch.minute) return;
    const minute = pitch.minute;
    const interval = setInterval(() => {
      setTime({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      if (
        minute == formatMinutes(new Date().getMinutes()) &&
        `00` === formatMinutes(new Date().getSeconds())
      ) {
        // Get the day in the format of DD-MM-YYYY
        const date = new Date().toLocaleDateString("tr").replace(/\./g, "-");

        const index = reservationSchema.findIndex(
          (item) => item.hour === new Date().getHours().toString()
        );
        const reservationDetails = getReservationDetails(
          date,
          pitch.name,
          index
        ).then((reservationDetails) => {
          return reservationDetails;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pitch]);

  const handleScoreChange = (teamIndex, score) => {
    const teamName = teamIndex === 0 ? "teamA" : "teamB";
    if (score < 0) return;
    setScores({ ...scores, [teamName]: score });
  };

  const handleNavigateBackWithPassword = () => {
    const password = "44153";
    const userInput = prompt("Sifrenizi giriniz");
    if (userInput === password) {
      window.location.href = "/";
    } else {
      alert("Hatalı sifre");
    }
  };

  if (!pitch.name || !pitch.minute) {
    return (
      <div className="w-full h-screen flex flex-row items-center justify-evenly gap-16">
        {pitchList.map((pitch) => (
          <button
            className="size-52 p-10 rounded-lg bg-accent text-accent-content font-bold text-3xl"
            onClick={() => setPitch(pitch)}
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
        <span className="text-3xl">{time.date}</span>
        <span className="text-3xl">{time.time}</span>
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
