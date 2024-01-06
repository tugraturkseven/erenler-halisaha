import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Dnd from "../components/Dnd";
import DatePicker from "../components/DatePicker";
import {
    getReservations,
    setAllReservations,
    checkDateExist,
    addPitchToDate,
    getPitchList,
    getTomorrowNightVisibility,
} from "../firebase";
import DateIndicator from "../components/DateIndicator";
import { UserContext } from "../contexts/UserContext";
import { ReservationSchemaContext } from "../contexts/ReservationSchemaContext";
import { useNavigate, useLocation } from "react-router-dom";

import { format } from "date-fns";
import { tr } from "date-fns/locale";

function Reservation() {
    const user = useContext(UserContext);
    const schema = useContext(ReservationSchemaContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedDay, setSelectedDay] = useState(location.state?.date || format(new Date(), "dd.MM.yyyy", { locale: tr }));
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

        if (!isNightLoaded) {
            getTomorrowNightVisibility().then((data) =>
                setReservationInfos((prevInfos) => ({
                    ...prevInfos,
                    tomorrowNightVisibility: data?.visibility,
                }))
            );
        }

        if (!isTemplateLoaded) {
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
        }

        return () => {
            // This code runs when the component unmounts
            // e.g., when the user navigates away from the page
            setIsTemplateLoaded(false);
            setReservationInfos({
                reservationTemplate: {},
                reservations: {},
                tomorrowNightVisibility: false,
            });
            setSelectedDay(new Date().toLocaleDateString("tr"));
        };
    }, [schema]);

    const createNewDate = async (date, pitch) => {
        if (!date || reservationInfos.reservationTemplate == {}) return;
        const dateExists = await checkDateExist(date);
        if (!dateExists) {
            setAllReservations(date, reservationInfos.reservationTemplate);
        } else {
            addPitchToDate(date, pitch, reservationInfos.reservationTemplate[pitch]);
        }
    };

    const fetchReservationData = async (dateStr, date) => {
        let results = [];

        try {
            const reservationPromises = Object.keys(
                reservationInfos.reservationTemplate
            ).map(async (pitchName) => {
                const pitchReservations = await getReservations(dateStr, pitchName);
                if (pitchReservations) {
                    const updatedPitch = reservationInfos.reservationTemplate[pitchName].map((schemaItem) => {
                        const reservation = pitchReservations.find(
                            (r) => r.hour === schemaItem.hour
                        );
                        return { ...schemaItem, ...reservation, ...{ date: date } };
                    });
                    return { [pitchName]: updatedPitch };
                } else {
                    createNewDate(dateStr, pitchName);
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

                let tomorrowResults = await fetchReservationData(
                    tomorrowString,
                    tomorrowDate
                );

                actualResults = Object.assign({}, ...actualResults);
                tomorrowResults = Object.assign({}, ...tomorrowResults);

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
            <div className="flex flex-col items-center mt-52 gap-10">
                <p>Lütfen giriş yapınız.</p>
                <button onClick={() => navigate("/")} className="btn btn-square w-52">
                    Giriş Yap
                </button>
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
            <Dnd
                reservations={reservationInfos.reservations}
                date={selectedDay}
                tomorrowNight={
                    reservationInfos.tomorrowNightVisibility
                        ? reservationInfos.tomorrowNightReservations
                        : null
                }
            />
        </div>
    );
}

export default Reservation;