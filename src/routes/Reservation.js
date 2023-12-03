import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Dnd from '../components/Dnd';
import DatePicker from '../components/DatePicker';
import { getReservations, setAllReservations, getReservationSchema, getPitchList, getTomorrowNightVisibility } from '../firebase';
import DateIndicator from '../components/DateIndicator';
import { UserContext } from '../contexts/UserContext';


function Reservation() {

    const user = useContext(UserContext);


    const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('tr'));
    const [showPicker, setShowPicker] = useState(false);
    const [reservations, setReservations] = useState({}); // Object to store reservations for each pitch
    const [isLoaded, setIsLoaded] = useState(false);
    const [reservationSchema, setReservationSchema] = useState([]);
    const [tomorrowNightVisibility, setTomorrowNightVisibility] = useState();
    const [tomorrowNightReservations, setTomorrowNightReservations] = useState([]);
    const selectedDayString = selectedDay.replaceAll('.', '-');

    useEffect(() => {
        getTomorrowNightVisibility().then(data => setTomorrowNightVisibility(data?.visibility));

        getPitchList().then(fetchedPitches => {
            // Step 2: Fetch the schema
            getReservationSchema().then(schema => {
                // Step 3 & 4: Apply the schema to each pitch and initialize reservations
                let initialReservations = {};
                fetchedPitches.forEach(pitch => {
                    // Add the minute attribute from the pitch to each schema item
                    initialReservations[pitch.name] = schema.map(schemaItem => ({
                        ...schemaItem,
                        minute: pitch.minute
                    }));
                });
                setReservations({ ...initialReservations });
                setTomorrowNightReservations({ ...initialReservations });
                setReservationSchema({ ...initialReservations });
                setIsLoaded(true);
            });
        });

    }, []);

    useEffect(() => {
        // Step 5: Fetch and populate reservations for each pitch
        Object.keys(reservations).forEach(pitchName => {
            getReservations(selectedDayString, pitchName)
                .then(pitchReservations => {
                    if (pitchReservations) {
                        setReservations(prevReservations => ({
                            ...prevReservations,
                            [pitchName]: prevReservations[pitchName].map(schemaItem => {
                                let reservation = pitchReservations.find(r => r.hour === schemaItem.hour);
                                return reservation ? { ...schemaItem, ...reservation, ...{ date: selectedDay } } : { ...schemaItem, ...{ date: selectedDay } };
                            })
                        }));

                    } else {
                        setAllReservations(selectedDayString, reservationSchema);
                        setReservations(reservationSchema)
                    }

                })
                .catch(error => {
                    console.log('Hata', error)
                });

        });

    }, [selectedDay, isLoaded]);

    useEffect(() => {
        if (tomorrowNightVisibility) {
            fetchTomorrowNightReservations();
        }
    }, [tomorrowNightVisibility, selectedDay]);

    const getTomorrowDate = () => {
        // Get tomorrow's date from selected day. Selected date is in dd.mm.yyyy format

        const parts = selectedDay.split('.');
        const dateString = `${parts[1]}/${parts[0]}/${parts[2]}`;
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return date.toLocaleDateString('tr');
    }


    const fetchTomorrowNightReservations = () => {
        const tomorrowDate = getTomorrowDate();
        const tomorrowString = tomorrowDate.replaceAll('.', '-');


        Object.keys(reservationSchema).forEach(pitchName => {
            getReservations(tomorrowString, pitchName)
                .then(pitchReservations => {
                    if (pitchReservations) {
                        setTomorrowNightReservations(prevReservations => ({
                            ...prevReservations,
                            [pitchName]: prevReservations[pitchName].map(schemaItem => {
                                let reservation = pitchReservations.find(r => r.hour === schemaItem.hour);
                                if (schemaItem.hour >= 1 && schemaItem.hour <= 4) {
                                    schemaItem.visible = true;
                                } else {
                                    schemaItem.visible = false;
                                }

                                return reservation ? { ...schemaItem, ...reservation, ...{ date: selectedDay } } : { ...schemaItem, ...{ date: selectedDay } };
                            })
                        }));

                    } else {
                        setAllReservations(selectedDayString, reservationSchema);

                    }

                })
                .catch(error => {
                    console.log('Hata', error)
                });

        });
    };

    console.log(tomorrowNightReservations)

    const handleDatePick = (date) => {
        setShowPicker(false);
        setSelectedDay(date.toLocaleDateString('tr'));
    };

    const pickDateComponent = (
        <button onClick={() => setShowPicker(!showPicker)} className='btn btn-ghost normal-case text-xl xl:text-3xl'>
            📅
        </button>
    );


    console.log('before render', tomorrowNightReservations);

    if (!user) return (
        <div className='flex flex-col items-center'>
            <p>Kullanici bilgileri yukleniyor..</p>
        </div>
    );
    return (
        <div className='flex flex-col items-center'>
            <Navbar endButton={pickDateComponent} />
            <DateIndicator selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
            <DatePicker showPicker={showPicker} handleDatePick={handleDatePick} />

            {isLoaded ? <Dnd reservations={reservations} date={selectedDay} tomorrowNight={tomorrowNightVisibility ? tomorrowNightReservations : null} /> : <p>Yükleniyor...</p>}


        </div>
    );
}

export default Reservation;
