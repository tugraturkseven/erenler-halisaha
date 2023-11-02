import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Dnd from '../components/Dnd'
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faCalendarCheck } from '@fortawesome/free-regular-svg-icons';
import { getReservations, createNewDay } from '../firebase';



function Reservation() {
    const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('tr'));
    const [showPicker, setShowPicker] = useState(false);
    const selectedDayString = selectedDay.replaceAll('.', '-');

    /*

       reservedUser: userId,
        reservedUserName: getCostumerData(userId).name,
        note: note,
        request: request

    */
    const reservations = {
        firstPitch: {
            16: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            17: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            18: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            19: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            20: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            21: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            22: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            23: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            24: { reservedUser: '', reservedUserName: '', note: '', request: '' }

        },
        secondPitch: {
            16: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            17: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            18: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            19: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            20: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            21: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            22: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            23: { reservedUser: '', reservedUserName: '', note: '', request: '' },
            24: { reservedUser: '', reservedUserName: '', note: '', request: '' }
        }
    };


    useEffect(() => {


        // Call getReservations to fetch the data
        getReservations(selectedDayString, 'firstPitch')
            .then((data) => {
                if (data) {
                    // Data fetched successfully
                    console.log(data)
                } else {
                    // Handle the case when no data is found
                    createNewDay(selectedDayString, reservations)
                }
            })
            .catch((error) => {
                // Handle any errors that occurred during data retrieval
                console.error('Error:', error);
            });

    }, [selectedDay])

    const pickDateComponent = (
        <button onClick={() => setShowPicker(!showPicker)} className='btn btn-ghost normal-case text-xl'>
            <FontAwesomeIcon icon={faCalendarDays} className='text-2xl' />
        </button>
    );

    const handleDatePick = (date) => {
        setShowPicker(false);
        setSelectedDay(date.toLocaleDateString('tr'));
    }


    return (
        <div className='flex flex-col items-center '>
            <Navbar endButton={pickDateComponent} />
            <p className='text-xl font-semibold underline'>{selectedDay}</p>
            <DayPicker className={`${showPicker ? '' : 'hidden'} text-lg`} onSelect={date => handleDatePick(date)} mode='single' />
            <div className='flex flex-row justify-around w-96 mt-5'>
                <p>Saha 1</p>
                <p>Saha 2</p>
            </div>

            <Dnd reservations={reservations} date={selectedDayString} />
        </div>
    )
}

export default Reservation