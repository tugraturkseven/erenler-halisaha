import React from 'react'
import { useNavigate } from 'react-router-dom'

function Card(props) {

    const navigate = useNavigate();

    const iconList = {
        Calendar: '📅',
        User: '👱',
        Sms: '✉️'
    }
    const routes = {
        Calendar: '/reservation',
        User: '/costumers',
        Sms: '/message'
    }
    return (
        <a onClick={() => navigate(routes[props.icon])} className='hover:cursor-pointer'>
            <div className='shadow-md text-center py-8 my-8 rounded-lg w-52 bg-slate-700 '>
                <h1 className='text-4xl'>{iconList[props.icon]}</h1>
                <h2 className='text-2xl font-bold pt-8'>{props.title}</h2>
            </div>
        </a>

    )
}

export default Card