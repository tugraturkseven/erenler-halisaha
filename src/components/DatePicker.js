import React from 'react'
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { tr } from 'date-fns/locale'

function DatePicker({ showPicker, handleDatePick }) {
    const css = `
  .my-today { 
    font-weight: bold;
    font-size: 125%; 
    color: red;
    border-radius: 50%;
    border: 1px solid red;
  }
`;
    return (
        <>
            <style>{css}</style>
            <DayPicker className={`${showPicker ? '' : 'hidden'} text-lg`} onSelect={date => handleDatePick(date)} mode='single' locale={tr} modifiersClassNames={{
                selected: 'my-selected',
                today: 'my-today'
            }} />
        </>

    )
}

export default DatePicker