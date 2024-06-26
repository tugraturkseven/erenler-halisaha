import React, { createContext, useState, useEffect } from "react";
import { getSMSTemplates } from "../firebase";

export const SMSTemplatesContext = createContext(null);

export const SMSTemplatesProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    getSMSTemplates()
      .then((data) => {
        setTemplates(data);
      })
      .catch((error) => {
        console.error("Error fetching sms templates:", error);
      });

    return () => {
      setTemplates([]);
    };
  }, []);

  return (
    <SMSTemplatesContext.Provider value={templates}>
      {children}
    </SMSTemplatesContext.Provider>
  );
};
