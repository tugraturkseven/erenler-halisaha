import React from 'react'
import Navbar from '../components/Navbar'

function GeneralSettings() {
    return (
        <div>
            <Navbar />
            <div className='flex flex-col justify-between items-center md:flex-row lg:justify-around'>
                <h1>General Settings</h1>
            </div>
        </div>
    )
}

export default GeneralSettings