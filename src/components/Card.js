import React from 'react'
import { useNavigate } from 'react-router-dom'

function Card(props) {

    const navigate = useNavigate();

    return (
        <a onClick={() => navigate(`/${props.route}`)} className='hover:cursor-pointer'>
            <div className='shadow-md text-center py-3 my-3 rounded-lg w-36 lg:w-56 xl:w-56 md:w-52 bg-slate-700 lg:py-6 lg:my-6 xl:py-8 xl:my-8 '>
                <h1 className='text-2xl lg:text-3xl xl:text-4xl'>{props.icon}</h1>
                <h2 className='text-xl lg:text-2xl xl:text-3xl font-bold pt-2'>{props.title}</h2>
            </div>
        </a>

    )
}

export default Card