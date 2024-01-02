import React from 'react'
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { tr } from 'date-fns/locale'

function DatePicker({ showPicker, handleDatePick }) {
    return (
        <DayPicker className={`${showPicker ? '' : 'hidden'} text-lg`} onSelect={date => handleDatePick(date)} mode='single' locale={tr} />
    )
}

export default DatePicker