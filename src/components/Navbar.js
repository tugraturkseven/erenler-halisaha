import React from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar(props) {
    const navigate = useNavigate();
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className='navbar-start'>
                {props.startButton ? props.startButton : null}
            </div>
            <div className='navbar-center'>
                <a onClick={() => navigate('/home')} className="btn btn-ghost normal-case text-xl">⚽ Erenler Halısaha ⚽</a>
            </div>
            <div className='navbar-end'>
                {props.endButton ? props.endButton : null}
            </div>
        </div >
    )
}

export default Navbar