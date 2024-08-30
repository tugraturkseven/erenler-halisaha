import React, { useState } from "react";

const ScoreCard = (props) => {
  const { teamName, teamIndex, score, setScore } = props;
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-accent h-96 w-[25vw]  text-accent-content pt-10">
      <h2 className="text-4xl font-mono">{teamName}</h2>
      <span className="flex flex-col items-center justify-center font-mono font-bold text-[250px] leading-none flex-1">
        {score}
      </span>
      <div className="w-full flex flex-row justify-between">
        <button
          className="size-12 bg-secondary text-secondary-content font-semibold text-2xl text-center rounded-bl-lg rounded-tr-lg"
          onClick={() => setScore(teamIndex, -1)}
        >
          -1
        </button>
        <button
          className="size-12 bg-secondary text-secondary-content font-semibold text-2xl text-center rounded-br-lg rounded-tl-lg"
          onClick={() => setScore(teamIndex, 1)}
        >
          +1
        </button>
      </div>
    </div>
  );
};

export default ScoreCard;
