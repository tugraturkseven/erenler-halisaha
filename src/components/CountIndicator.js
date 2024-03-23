import React, { useEffect, useMemo, useState } from 'react'
import { countReservations, getReservationUpdateFlag } from '../firebase'

function CountIndicator() {
    const [reservationsOfMonth, setReservationsOfMonth] = useState({});
    const [updateFlag, setUpdateFlag] = useState(false);
    const [counts, setCounts] = useState({
        activeReservation: 0,
        preReservation: 0,
    });

    const fetchReservationsOfMonth = useMemo(() => async () => {
        const res = await countReservations();
        if (res) {
            setReservationsOfMonth(res);
            countReservationsOfMonth();
            return res;
        }
    }, [updateFlag])

    const reservationLastUpdate = async () => {
        const res = await getReservationUpdateFlag();
        setUpdateFlag(res);
    }

    const countReservationsOfMonth = useMemo(() => () => {
        let activeReservation = 0;
        let preReservation = 0;
        Object.keys(reservationsOfMonth).forEach((day) => {
            Object.keys(reservationsOfMonth[day]).forEach((pitch) => {
                reservationsOfMonth[day][pitch].forEach((reservation) => {
                    if (reservation.reservationType === "Ön Rez.") {
                        preReservation += 1;
                    } else if (reservation.reservationType === "Kesin Rez.") {
                        activeReservation += 1;
                    }
                })
            })
        })
        setCounts({ activeReservation: activeReservation, preReservation: preReservation });
    }, [reservationsOfMonth])

    useEffect(() => {
        const fetchData = async () => {
            await fetchReservationsOfMonth();
            await reservationLastUpdate();
        };
        fetchData();

    }, [updateFlag]);

    return (
        <>
            <div className='hidden invisible flex-row gap-5 lg:flex lg:visible'>
                <span className="text-2xl">⚪: {counts.activeReservation + counts.preReservation}</span>
                <span className="text-2xl">🟢: {counts.activeReservation}</span>
                <span className="text-2xl">🟠: {counts.preReservation}</span>
            </div>
            <div className='flex flex-col gap-5 lg:hidden'>
                <span className="text-lg font-semibold">⚪ Toplam Rez.: {counts.activeReservation + counts.preReservation}</span>
                <span className="text-lg font-semibold" >🟢 Aktif Rez.: {counts.activeReservation}</span>
                <span className="text-lg font-semibold">🟠 Ön Rez.: {counts.preReservation}</span>
            </div>
        </>
    )
}

export default CountIndicator