import React, { useState, useEffect, useContext } from "react";
import { PitchListContext } from "../contexts/PitchListContext";
import ScoreCard from "../components/ScoreCard";

const Score = () => {
  const pitchList = useContext(PitchListContext);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setTime({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(pitchList);
  }, [pitchList]);

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
