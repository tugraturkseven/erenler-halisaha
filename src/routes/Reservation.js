import React from 'react'
import Navbar from '../components/Navbar'
import Dnd from '../components/Dnd'

function Reservation() {
    return (
        <div>
            <Navbar addReservation={true} />
            <div className='flex flex-col justify-between items-center '>
                <div className="tabs mt-10">
                    <a className="tab">🥅 Saha 1</a>
                    <a className="tab tab-active">🥅 Saha 2</a>
                </div>
                <div className='w-96  my-10'>
                    <div className='flex flex-row text-center'>
                        <p className='text-md font-bold flex-1'>🕖 Saat</p>
                        <p className='text-md font-bold flex-1'>👱 Müşteri</p>
                        <p className='text-md font-bold flex-1'>⭐ Abone</p>
                    </div>
                </div>
                <Dnd></Dnd>

            </div>
        </div>
    )
}

export default Reservation