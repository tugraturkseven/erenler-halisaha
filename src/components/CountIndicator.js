import React, { useEffect, useMemo, useState } from 'react'
import { getReservationCounts, setReservationCounts } from '../firebase'

function CountIndicator(props) {
    const dateObject = new Date();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    const [counts, setCounts] = useState({
        activeReservation: 0,
        preReservation: 0,
    });
    // we need to update the selected day as "." to "-" for the firebase key
    const fetchReservationCounts = useMemo(() => async () => {
        const res = await getReservationCounts(year, month);
        if (res) {
            setCounts(res);
        } else {
            setReservationCounts(year, month, counts);
        }
    }, [dateObject]);
    // TODO: Implement the setReservationCounts function
    const isFirstDayOfMonth = useMemo(() => {
        // Check if the selected day is the first day of the month
        return dateObject.getDate() === 1;
    }, []);

    useEffect(() => {
        fetchReservationCounts();
        if (isFirstDayOfMonth) {
            setReservationCounts(year, month, counts);
        }
        return () => { };
    }, [dateObject]);

    return (
        <div className='flex flex-row gap-5'>
            <span className="text-2xl">⚪: {counts.activeReservation + counts.preReservation}</span>
            <span className="text-2xl">🟢: {counts.activeReservation}</span>
            <span className="text-2xl">🟠: {counts.preReservation}</span>
        </div>
    )
}

export default CountIndicator