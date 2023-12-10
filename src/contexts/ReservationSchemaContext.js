import React, { createContext, useState, useEffect } from "react";
import { getReservationSchema } from "../firebase";

export const ReservationSchemaContext = createContext(null);

export const ReservationSchemaProvider = ({ children }) => {
  const [schemaInfo, setSchemaInfo] = useState([]);

  useEffect(() => {
    getReservationSchema().then((data) => setSchemaInfo(data));

    return () => {
      setSchemaInfo([]);
    };
  }, []);

  return (
    <ReservationSchemaContext.Provider value={schemaInfo}>
      {children}
    </ReservationSchemaContext.Provider>
  );
};
