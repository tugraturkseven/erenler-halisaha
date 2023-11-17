import React from 'react'
import Card from '../components/Card'
import Navbar from '../components/Navbar'

function Settings() {

    return (
        <div>
            <Navbar />
            <div className='flex flex-col justify-between items-center md:flex-row lg:justify-around'>
                <Card icon='⚙️' title='Genel' route='generalSettings' />
                <Card icon='⛓️' title='Şema' route='schemaSettings' />
                <Card icon='🏟️' title='Saha' route='pitchSettings' />
            </div>
        </div>
    )
}

export default Settings