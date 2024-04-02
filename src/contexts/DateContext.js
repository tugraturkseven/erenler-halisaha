// DateContext.js
import React, { createContext, useState } from 'react';

// Create a context object
export const DateContext = createContext();

// Create a context provider component
export const DateProvider = ({ children }) => {
    // State to store the selected day
    const [selectedDay, setSelectedDay] = useState(null);

    return (
        // Provide the context value to the components within the provider
        <DateContext.Provider value={{ selectedDay, setSelectedDay }}>
            {children}
        </DateContext.Provider>
    );
};
