import React from 'react'
import Navbar from '../components/Navbar'
import List from '../components/List'
function Reservation() {
    return (
        <div>
            <Navbar addReservation={true} />
            <div className='flex flex-col justify-between items-center md:flex-row lg:justify-around'>
                <List />
                <div className="tabs mt-10">
                    <a className="tab">Tab 1</a>
                    <a className="tab tab-active">Tab 2</a>
                    <a className="tab">Tab 3</a>
                </div>
            </div>
        </div>
    )
}

export default Reservation