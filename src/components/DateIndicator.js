import React from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import CountIndicator from './CountIndicator'
function DateIndicator({ selectedDay, setSelectedDay }) {
    const getTurkishDayName = (dateString) => {
        // Split the dateString by '.'
        const parts = dateString.split('.');

        // Reformat the date to YYYY-MM-DD
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

        // Create a new date object
        const date = new Date(format(new Date(formattedDate), 'yyyy-MM-dd'));

        // Get the day name in Turkish
        return format(date, 'EEE', { locale: tr }) + ' ';
    }

    const turkishDayName = getTurkishDayName(selectedDay);

    const handleDateChange = (date, target) => {
        const dateComponents = date.split('.');
        const day = parseInt(dateComponents[0], 10);
        const month = parseInt(dateComponents[1], 10) - 1; // Adjust for zero-index month
        const year = parseInt(dateComponents[2], 10);

        // Create a JavaScript Date object in a Safari-compatible way
        const dateObject = new Date(year, month, day);

        if (target === 'prevDay') {
            dateObject.setDate(dateObject.getDate() - 1);
        } else if (target === 'nextDay') {
            dateObject.setDate(dateObject.getDate() + 1);
        } else if (target === 'prevWeek') {
            dateObject.setDate(dateObject.getDate() - 7);
        } else if (target === 'nextWeek') {
            dateObject.setDate(dateObject.getDate() + 7);
        }

        // Format the date for display
        const formattedDate = format(dateObject, 'dd.MM.yyyy');
        setSelectedDay(formattedDate);
    }


    const prevDayButton = (
        <button onClick={() => handleDateChange(selectedDay, 'prevDay')} className='btn btn-ghost normal-case text-md p-3'>
            {'<'}
        </button>
    );

    const nextDayButton = (
        <button onClick={() => handleDateChange(selectedDay, 'nextDay')} className='btn btn-ghost normal-case text-md p-3'>
            {'>'}
        </button>

    );

    const prevWeekButton = (
        <button onClick={() => handleDateChange(selectedDay, 'prevWeek')} className='btn btn-ghost normal-case text-md p-3'>
            {'<<'}
        </button>
    );

    const nextWeekButton = (
        <button onClick={() => handleDateChange(selectedDay, 'nextWeek')} className='btn btn-ghost normal-case text-md p-3'>
            {'>>'}
        </button>
    );



    return (
        <div className='flex flex-row justify-center items-center w-full m-1 gap-2'>
            <div className='absolute left-10'>
                <CountIndicator selectedDay={selectedDay} />
            </div>
            {prevWeekButton}
            {prevDayButton}
            <p className='text-base font-semibold underline' onClick={() => setSelectedDay(new Date().toLocaleDateString('tr'))} >{turkishDayName}{selectedDay}</p>
            {nextDayButton}
            {nextWeekButton}

        </div>
    )
}

export default DateIndicator