import React from 'react'

function DateIndicator({ selectedDay, setSelectedDay }) {

    const handleDateChange = (date, target) => {

        // Split the date string into day, month, and year components
        const dateComponents = date.split('.');
        const day = parseInt(dateComponents[0], 10);
        const month = parseInt(dateComponents[1], 10);
        const year = parseInt(dateComponents[2], 10);

        // Create a JavaScript Date object
        const dateObject = new Date(year, month - 1, day); // Month is 0-based in JavaScript Date, so subtract 1

        if (target === 'prevDay') {
            dateObject.setDate(dateObject.getDate() - 1);
        } else if (target === 'nextDay') {
            dateObject.setDate(dateObject.getDate() + 1);
        } else if (target === 'prevWeek') {
            dateObject.setDate(dateObject.getDate() - 7);
        } else if (target === 'nextWeek') {
            dateObject.setDate(dateObject.getDate() + 7);
        }

        // Update the selectedDay state variable
        setSelectedDay(dateObject.toLocaleDateString('tr'));

    }

    const prevDayButton = (
        <button onClick={() => handleDateChange(selectedDay, 'prevDay')} className='btn btn-ghost normal-case text-xl'>
            {'<'}
        </button>
    );

    const nextDayButton = (
        <button onClick={() => handleDateChange(selectedDay, 'nextDay')} className='btn btn-ghost normal-case text-xl'>
            {'>'}
        </button>

    );

    const prevWeekButton = (
        <button onClick={() => handleDateChange(selectedDay, 'prevWeek')} className='btn btn-ghost normal-case text-xl'>
            {'<<'}
        </button>
    );

    const nextWeekButton = (
        <button onClick={() => handleDateChange(selectedDay, 'nextWeek')} className='btn btn-ghost normal-case text-xl'>
            {'>>'}
        </button>
    );



    return (
        <div className='flex flex-row items-center h-8 m-1'>
            {prevWeekButton}
            {prevDayButton}
            <p className='text-xl font-semibold underline' onClick={() => setSelectedDay(new Date().toLocaleDateString('tr'))} >{selectedDay}</p>
            {nextDayButton}
            {nextWeekButton}
        </div>
    )
}

export default DateIndicator