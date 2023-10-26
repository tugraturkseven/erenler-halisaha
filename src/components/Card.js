import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons'

function Card(props) {
    const iconList = {
        Calendar: '📅',
        User: '👱',
        Sms: '✉️'
    }
    const routes = {
        Calendar: '/reservation',
        User: '/costumer',
        Sms: '/message'
    }
    return (
        <a href={routes[props.icon]}>
            <div className='shadow-md text-center py-8 my-8 rounded-lg w-52 bg-slate-700 '>
                <h1 className='text-4xl'>{iconList[props.icon]}</h1>
                <h2 className='text-2xl font-bold pt-8'>{props.title}</h2>
            </div>
        </a>

    )
}

export default Card