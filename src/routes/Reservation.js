import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Dnd from '../components/Dnd';
import DatePicker from '../components/DatePicker';
import { getReservations, setAllReservations, getReservationSchema } from '../firebase';
import DateIndicator from '../components/DateIndicator';

function Reservation() {
    const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('tr'));
    const [showPicker, setShowPicker] = useState(false);
    const [reservationSchema, setReservationSchema] = useState({ firstPitch: [], secondPitch: [] });
    const selectedDayString = selectedDay.replaceAll('.', '-');
    const [reservations, setReservations] = useState({ firstPitch: [], secondPitch: [] });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        getReservationSchema((data) => {
            setReservationSchema(data);
            setIsLoaded(true);
        });
    }, []);

    useEffect(() => {
        const updatedSchema = { firstPitch: [...reservationSchema.firstPitch], secondPitch: [...reservationSchema.secondPitch] };

        getReservations(selectedDayString)
            .then((data) => {
                if (data) {
                    // Data fetched successfully, update the 'firstPitch' in the new object
                    data.firstPitch.map((item) => {
                        const index = updatedSchema.firstPitch.findIndex((innerItem) => innerItem.hour === item.hour);
                        if (index !== -1) {
                            updatedSchema.firstPitch[index] = item;
                        }
                    })
                    data.secondPitch.map((item) => {
                        const hour = item.hour;
                        const index = updatedSchema.secondPitch.findIndex((item) => item.hour === hour);
                        if (index !== -1) {
                            updatedSchema.secondPitch[index] = item;
                        }
                    })
                    setReservations(updatedSchema);
                } else {
                    // Handle the case when no data is found
                    setReservations(reservationSchema);
                    setAllReservations(selectedDayString, { firstPitch: reservationSchema.firstPitch, secondPitch: reservationSchema.secondPitch });

                }
            })
            .catch((error) => {
                // Handle any errors that occurred during data retrieval
                console.log('Error fetching data:', error);
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

    return (
        <div className='flex flex-col items-center'>
            <Navbar endButton={pickDateComponent} />
            <DateIndicator selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
            <DatePicker showPicker={showPicker} handleDatePick={handleDatePick} />
            <div className='flex flex-row justify-around w-96 mt-5'>
                <p>🏟️ Saha 1</p>
                <p>🏟️ Saha 2</p>
            </div>
            {isLoaded ? <Dnd reservations={reservations} date={selectedDay} /> : <p>Yükleniyor...</p>}
        </div>
    );
}

export default Reservation;
