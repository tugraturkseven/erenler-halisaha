// DateContext.js
import React, { createContext, useState } from "react";
import { formatDateFourHoursEarlier } from "../utils/FormattedEarlierDateHook";

// Create a context object
export const DateContext = createContext();

// Create a context provider component
export const DateProvider = ({ children }) => {
  // State to store the selected day, initialized with current date minus 4 hours
  const [selectedDay, setSelectedDay] = useState(formatDateFourHoursEarlier());

  return (
    // Provide the context value to the components within the provider
    <DateContext.Provider value={{ selectedDay, setSelectedDay }}>
      {children}
    </DateContext.Provider>
  );
};
