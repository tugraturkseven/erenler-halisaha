import React, { createContext, useState, useEffect } from "react";
import { getPitchList } from "../firebase";

export const PitchListContext = createContext(null);

export const PitchListProvider = ({ children }) => {
  const [pitchList, setPitchList] = useState([]);

  useEffect(() => {
    getPitchList()
      .then((data) => {
        setPitchList(data);
      })
      .catch((error) => {
        console.error("Error fetching pitch list:", error);
      });

    return () => {
      setPitchList([]);
    };
  }, []);

  return (
    <PitchListContext.Provider value={pitchList}>
      {children}
    </PitchListContext.Provider>
  );
};
