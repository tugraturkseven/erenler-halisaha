import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Dnd from '../components/Dnd'
import DatePicker from '../components/DatePicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { getReservations, setAllReservations } from '../firebase';
import DateIndicator from '../components/DateIndicator'


function Reservation() {

    const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('tr'));
    const [showPicker, setShowPicker] = useState(false);
    const selectedDayString = selectedDay.replaceAll('.', '-');


    const reservationsSchema = {
        firstPitch: {
            16: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            17: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            18: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            19: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            20: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            21: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            22: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            23: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            24: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' }

        },
        secondPitch: {
            16: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            17: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            18: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            19: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            20: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            21: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            22: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            23: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' },
            24: { reservedUserName: '', reservedUserPhone: '', note: '', request: '' }
        }
    };

    const [reservations, setReservations] = useState(reservationsSchema);

    useEffect(() => {


        // Create copies of the existing reservations object
        const updatedReservations = { ...reservations };

        // Call getReservations to fetch the data for 'firstPitch'
        getReservations(selectedDayString, 'firstPitch')
            .then((data) => {
                if (data) {
                    // Data fetched successfully, update the 'firstPitch' in the new object
                    updatedReservations.firstPitch = data;
                } else {
                    // Handle the case when no data is found
                    setAllReservations(selectedDayString, updatedReservations);
                    updatedReservations.firstPitch = reservationsSchema.firstPitch;
                }
                // Update the state with the new reservations object
                setReservations(updatedReservations);
            })
            .catch((error) => {
                // Handle any errors that occurred during data retrieval
                console.error('Error:', error);
            });

        // Similar logic for 'secondPitch'
        getReservations(selectedDayString, 'secondPitch')
            .then((data) => {
                if (data) {
                    // Data fetched successfully, update the 'secondPitch' in the new object
                    updatedReservations.secondPitch = data;
                } else {
                    // Handle the case when no data is found
                    setAllReservations(selectedDayString, updatedReservations);
                    updatedReservations.secondPitch = reservationsSchema.secondPitch;
                }
                // Update the state with the new reservations object
                setReservations(updatedReservations);
            })
            .catch((error) => {
                // Handle any errors that occurred during data retrieval
                console.error('Error:', error);
            });

    }, [selectedDay])



    const handleDatePick = (date) => {
        setShowPicker(false);
        setSelectedDay(date.toLocaleDateString('tr'));
    }

    const pickDateComponent = (
        <button onClick={() => setShowPicker(!showPicker)} className='btn btn-ghost normal-case text-xl xl:text-3xl' >
            📅
        </button>
    );

    return (
        <div className='flex flex-col items-center '>
            <Navbar endButton={pickDateComponent} />
            <DateIndicator selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
            <DatePicker showPicker={showPicker} handleDatePick={handleDatePick} />
            <div className='flex flex-row justify-around w-96 mt-5'>
                <p>🏟️ Saha 1</p>
                <p>🏟️ Saha 2</p>
            </div>

            <Dnd reservations={reservations} date={selectedDayString} />
        </div>
    )
}

export default Reservation