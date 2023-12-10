import React, { useState, useEffect, useContext, useCallback } from "react";
import Navbar from "../components/Navbar";
import Dnd from "../components/Dnd";
import DatePicker from "../components/DatePicker";
import {
  getReservations,
  setAllReservations,
  getPitchList,
  getTomorrowNightVisibility,
} from "../firebase";
import DateIndicator from "../components/DateIndicator";
import { UserContext } from "../contexts/UserContext";
import { ReservationSchemaContext } from "../contexts/ReservationSchemaContext";

function Reservation() {
  const user = useContext(UserContext);
  const schema = useContext(ReservationSchemaContext);

  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleDateString("tr")
  );
  const [showPicker, setShowPicker] = useState(false);

  const [reservationInfos, setReservationInfos] = useState({
    reservationTemplate: {},
    reservations: {},
    tomorrowNightVisibility: false,
  });

  const [isActualLoaded, setIsActualLoaded] = useState(false);
  const [isNightLoaded, setIsNightLoaded] = useState(false);
  const [isTemplateLoaded, setIsTemplateLoaded] = useState(false);
  const selectedDayString = selectedDay.replaceAll(".", "-");

  useEffect(() => {
    // This code runs after the component mounts
    getTomorrowNightVisibility().then((data) =>
      setReservationInfos((prevInfos) => ({
        ...prevInfos,
        tomorrowNightVisibility: data?.visibility,
      }))
    );

    getPitchList().then((fetchedPitches) => {
      let initialReservations = {};

      fetchedPitches.forEach((pitch) => {
        initialReservations[pitch.name] = schema.map((schemaItem) => ({
          ...schemaItem,
          minute: pitch.minute,
        }));
      });

      setReservationInfos((prevInfos) => ({
        ...prevInfos,
        reservationTemplate: initialReservations,
      }));
      setIsTemplateLoaded(true);
    });
  }, [schema]);

  const fetchReservationData = async (dateStr, date) => {
    let results = [];

    try {
      const reservationPromises = Object.keys(
        reservationInfos.reservationTemplate
      ).map(async (pitchName) => {
        const pitchReservations = await getReservations(dateStr, pitchName);
        if (pitchReservations) {
          const updatedPitch = reservationInfos.reservationTemplate[
            pitchName
          ].map((schemaItem) => {
            const reservation = pitchReservations.find(
              (r) => r.hour === schemaItem.hour
            );
            return { ...schemaItem, ...reservation, ...{ date: date } };
          });
          return { [pitchName]: updatedPitch };
        } else {
          // This part depends on how you want to handle the absence of reservations
          // add date to schema item and return it
          setAllReservations(dateStr, reservationInfos.reservationTemplate);
          const updatedPitch = reservationInfos.reservationTemplate[
            pitchName
          ].map((schemaItem) => ({
            ...schemaItem,
            ...{ date: date },
          }));
          return { [pitchName]: updatedPitch };
        }
      });
      results = await Promise.all(reservationPromises);
    } catch (error) {
      console.error("Error updating reservations:", error);
      // Consider throwing the error or handling it as per your application's needs
    }
    return results;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let actualResults = await fetchReservationData(
          selectedDayString,
          selectedDay
        );
        const tomorrowDate = getTomorrowDate();
        const tomorrowString = tomorrowDate.replaceAll(".", "-");
        console.log("date", tomorrowDate, "string", tomorrowString);
        let tomorrowResults = await fetchReservationData(
          tomorrowString,
          tomorrowDate
        );

        tomorrowResults = { ...tomorrowResults[0], ...tomorrowResults[1] };
        actualResults = { ...actualResults[0], ...actualResults[1] };

        Object.values(tomorrowResults).forEach((pitch) => {
          pitch.forEach((reservation) => {
            if (reservation.hour >= 1 && reservation.hour <= 4) {
              reservation.visible = true;
            } else {
              reservation.visible = false;
            }
          });
        });

        setReservationInfos((prevInfos) => ({
          ...prevInfos,
          reservations: actualResults,
          tomorrowNightReservations: tomorrowResults,
        }));

        setIsActualLoaded(true);
        setIsNightLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error as needed, e.g., show an error message to the user
      }
    };

    fetchData();
  }, [selectedDay, user, isTemplateLoaded]);

  const getTomorrowDate = () => {
    // Get tomorrow's date from selected day. Selected date is in dd.mm.yyyy format

    const parts = selectedDay.split(".");
    const dateString = `${parts[1]}/${parts[0]}/${parts[2]}`;
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("tr");
  };

  const handleDatePick = (date) => {
    setShowPicker(false);
    setSelectedDay(date.toLocaleDateString("tr"));
  };

  const pickDateComponent = (
    <button
      onClick={() => setShowPicker(!showPicker)}
      className="btn btn-ghost normal-case text-xl xl:text-3xl"
    >
      📅
    </button>
  );

  if (!user || !isActualLoaded || !isNightLoaded) {
    return (
      <div className="flex flex-col items-center">
        <p>Lütfen giriş yapınız.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center">
      <Navbar endButton={pickDateComponent} />
      <DateIndicator
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
      <DatePicker showPicker={showPicker} handleDatePick={handleDatePick} />

      {isActualLoaded && isNightLoaded ? (
        <Dnd
          reservations={reservationInfos.reservations}
          date={selectedDay}
          tomorrowNight={reservationInfos.tomorrowNightReservations}
        />
      ) : (
        <p>Yükleniyor...</p>
      )}
    </div>
  );
}

export default Reservation;
