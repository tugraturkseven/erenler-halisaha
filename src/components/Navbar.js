import React from 'react'


function Navbar(props) {



    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className='navbar-start'>
                {props.startButton ? props.startButton : null}
            </div>
            <div className='navbar-center'>
                <a href='/home' className="btn btn-ghost normal-case text-xl">⚽ Erenler Halısaha</a>
            </div>
            <div className='navbar-end'>
                {props.endButton ? props.endButton : null}
            </div>
        </div >
    )
}

export default Navbar