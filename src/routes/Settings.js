import React from 'react'
import Card from '../components/Card'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

function Settings() {
    const navigate = useNavigate();

    const logOutHandler = async () => {
        await signOut(auth).then(() => {
            navigate("/")
        }).catch((error) => {
            console.log(error);
        });
    }
    const logOffButton = <button onClick={logOutHandler} className='btn btn-ghost normal-case text-xl xl:text-3xl'>🚪</button>

    return (
        <div>
            <Navbar endButton={logOffButton} />
            <div className='flex flex-col justify-between items-center md:flex-row lg:justify-around'>
                <Card icon='⚙️' title='Genel' route='generalSettings' />
                <Card icon='⛓️' title='Şema' route='schemaSettings' />
                <Card icon='🏟️' title='Saha' route='pitchSettings' />
            </div>
        </div>
    )
}

export default Settings