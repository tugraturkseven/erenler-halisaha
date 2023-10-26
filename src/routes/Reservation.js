import React from 'react'
import Navbar from '../components/Navbar'
import Dnd from '../components/Dnd'

function Reservation() {

    const firstPitchReservations = [
        { name: 'John', surname: 'Doe', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { name: 'Jane', surname: 'Smith', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { name: 'John', surname: 'Doe', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { name: 'Jane', surname: 'Smith', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { name: 'John', surname: 'Doe', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { name: 'Jane', surname: 'Smith', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { name: 'John', surname: 'Doe', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { name: 'Jane', surname: 'Smith', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },

    ];

    const secondPitchReservations = [
        { name: 'Ali', surname: 'Doe', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { name: 'Veli', surname: 'Smith', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { name: 'Hasan', surname: 'Doe', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { name: 'Kaan', surname: 'Smith', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { name: 'Akin', surname: 'Doe', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { name: 'Cart', surname: 'Smith', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { name: 'Curt', surname: 'Doe', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { name: 'Jane', surname: 'Smith', reservationNote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },

    ];

    const reservationData = {
        'firstPitch': firstPitchReservations,
        'secondPitch': secondPitchReservations
    }



    return (
        <div>
            <Navbar addReservation={true} />
            <Dnd reservation={reservationData} />

        </div>
    )
}

export default Reservation