import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarPlus, faUserPlus } from '@fortawesome/free-solid-svg-icons'
function Navbar(props) {
    const addReservation = () => {
        return (
            <a className="btn btn-ghost normal-case text-xl">
                <FontAwesomeIcon icon={faCalendarPlus} size={'xl'} />
            </a>
        )
    }
    const addCostumer = () => {
        return (
            <a className="btn btn-ghost normal-case text-xl">
                <FontAwesomeIcon icon={faUserPlus} size={'xl'} />
            </a>
        )
    }


    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className='navbar-start'>
            </div>
            <div className='navbar-center'>
                <a href='/home' className="btn btn-ghost normal-case text-xl">⚽ Erenler Halısaha</a>
            </div>
            <div className='navbar-end'>
                {props.addReservation ? addReservation() : null}
                {props.addCostumer ? addCostumer() : null}
            </div>
        </div >
    )
}

export default Navbar