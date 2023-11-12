import React from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar(props) {
    const navigate = useNavigate();
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className='navbar-start'>
                <button onClick={() => navigate('/reservation')} className='btn btn-ghost normal-case text-xl xl:text-3xl'>⚽</button>
            </div>
            <div className='navbar-center'>

                <button onClick={() => navigate('/message')} className='btn btn-ghost normal-case text-xl xl:text-3xl'>✉️</button>
                <button onClick={() => navigate('/customers')} className='btn btn-ghost normal-case text-xl xl:text-3xl'>👱</button>
                <button onClick={() => navigate('/settings')} className='btn btn-ghost normal-case text-xl xl:text-3xl'>⚙️</button>
            </div>
            <div className='navbar-end'>
                {props.endButton ? props.endButton : null}
            </div>
        </div >
    )
}

export default Navbar