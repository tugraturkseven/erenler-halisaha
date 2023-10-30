import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Dnd from '../components/Dnd'
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faCalendarCheck } from '@fortawesome/free-regular-svg-icons';




function Reservation() {
    const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('tr'));
    const [showPicker, setShowPicker] = useState(false);


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

            <Dnd />
        </div>
    )
}

export default Reservation