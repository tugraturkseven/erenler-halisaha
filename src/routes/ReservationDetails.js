import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useLocation, useNavigate } from 'react-router-dom'
import { getReservationDetails, setReservation } from '../firebase';


function ReservationDetails() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const { pitch, hour, date } = location.state;


    useEffect(() => {
        getReservationDetails(date, pitch, hour).then((data) => {
            if (data) {
                setName(data.reservedUserName);
                setPhone(data.reservedUserPhone);
                setNote(data.note);
            }
        })
    }, [])


    const handleSave = () => {

        setReservation(date, pitch, hour, name, phone, 'approved', note).then(() => {
            alert('Rezervasyon kaydedildi');
            navigate('/reservation');
        }).catch((error) => {
            alert('Rezervasyon kaydedilemedi');
        }
        )
    }

    return (
        <div>
            <Navbar />
            <div className='flex flex-col gap-5 items-center'>
                <p className='titleMedium font-bold text-center'>Rezervasyon Bilgileri</p>
                <input className='input input-bordered' type="text" placeholder='İsim Soyisim' value={name} onChange={(e) => setName(e.target.value)} />
                <input className='input input-bordered' type="text" placeholder='Telefon' value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input className='input input-bordered' type="text" placeholder='Not' value={note} onChange={(e) => setNote(e.target.value)} />

                <div className='flex flex-row gap-5'>
                    <button className='btn btn-primary' onClick={() => handleSave()}>Kaydet</button>
                    <button className='btn btn-secondary' onClick={() => navigate('/reservation')}>Iptal</button>
                </div>
            </div>
        </div>
    )
}

export default ReservationDetails