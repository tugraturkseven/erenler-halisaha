import React, { useEffect, useState, useContext } from "react";
import { countReservations } from "../firebase";
import { DateContext } from "../contexts/DateContext";

function CountIndicator() {
  const [reservationsOfMonth, setReservationsOfMonth] = useState({});
  const [counts, setCounts] = useState({
    activeReservation: 0,
    preReservation: 0,
  });
  const { selectedDay } = useContext(DateContext);
  const [day, month, year] = selectedDay.split(".");
  useEffect(() => {
    const fetchData = async () => {
      // Fetch reservations and update reservationsOfMonth state
      const res = await countReservations(selectedDay);
      if (res) {
        setReservationsOfMonth(res);
      }
    };
    fetchData();
  }, [month, year]);

  useEffect(() => {
    // Count reservations whenever reservationsOfMonth changes
    countReservationsOfMonth();
  }, [reservationsOfMonth]);

  const countReservationsOfMonth = () => {
    let activeReservation = 0;
    let preReservation = 0;
    try {
      Object.keys(reservationsOfMonth)?.forEach((day) => {
        Object.keys(reservationsOfMonth[day])?.forEach((pitch) => {
          reservationsOfMonth[day][pitch]?.forEach((reservation) => {
            if (reservation.reservationType === "Ön Rez.") {
              preReservation += 1;
            } else if (reservation.reservationType === "Kesin Rez.") {
              activeReservation += 1;
            }
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
    setCounts({ activeReservation, preReservation });
  };

  return (
    <>
      <div className="hidden invisible flex-row gap-5 lg:flex lg:visible">
        <span className="text-2xl">
          ⚪: {counts.activeReservation + counts.preReservation}
        </span>
        <span className="text-2xl">🟢: {counts.activeReservation}</span>
        <span className="text-2xl">🟠: {counts.preReservation}</span>
      </div>
      <div className="flex flex-col gap-5 lg:hidden">
        <span className="text-lg font-semibold">
          ⚪ Toplam Rez.: {counts.activeReservation + counts.preReservation}
        </span>
        <span className="text-lg font-semibold">
          🟢 Aktif Rez.: {counts.activeReservation}
        </span>
        <span className="text-lg font-semibold">
          🟠 Ön Rez.: {counts.preReservation}
        </span>
      </div>
    </>
  );
}

export default CountIndicator;
