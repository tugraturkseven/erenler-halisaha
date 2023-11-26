import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Dnd from '../components/Dnd';
import DatePicker from '../components/DatePicker';
import { getReservations, setAllReservations, getReservationSchema, getPitchList } from '../firebase';
import DateIndicator from '../components/DateIndicator';
import { UserContext } from '../contexts/UserContext';

function Reservation() {

    const user = useContext(UserContext);
    const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('tr'));
    const [showPicker, setShowPicker] = useState(false);
    const [reservations, setReservations] = useState({}); // Object to store reservations for each pitch
    const [isLoaded, setIsLoaded] = useState(false);
    const [reservationSchema, setReservationSchema] = useState([]);

    const selectedDayString = selectedDay.replaceAll('.', '-');

    useEffect(() => {
        // Step 1: Fetch the pitches
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
                setReservations(initialReservations);
                setReservationSchema(initialReservations);
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
                                return reservation ? { ...schemaItem, ...reservation } : schemaItem;
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


    const handleDatePick = (date) => {
        setShowPicker(false);
        setSelectedDay(date.toLocaleDateString('tr'));
    };

    const pickDateComponent = (
        <button onClick={() => setShowPicker(!showPicker)} className='btn btn-ghost normal-case text-xl xl:text-3xl'>
            📅
        </button>
    );

    if (!user) return (
        <div className='flex flex-col items-center'>
            <p>Rezervasyon yapmak için giriş yapın</p>
        </div>
    );
    return (
        <div className='flex flex-col items-center'>
            <Navbar endButton={pickDateComponent} />
            <DateIndicator selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
            <DatePicker showPicker={showPicker} handleDatePick={handleDatePick} />

            {isLoaded ? <Dnd reservations={reservations} date={selectedDay} /> : <p>Yükleniyor...</p>}
        </div>
    );
}

export default Reservation;
