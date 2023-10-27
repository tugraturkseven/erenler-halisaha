import React from 'react'
import Navbar from '../components/Navbar'


function ReservationDetails() {
    return (
        <div>
            <Navbar />
            <div className='flex flex-col gap-5 items-center'>
                <p className='titleMedium font-bold text-center'>Rezervasyon Bilgileri</p>
                <input className='input input-bordered' type="text" placeholder='İsim Soyisim' />
                <input className='input input-bordered' type="text" placeholder='Telefon' />
                <input className='input input-bordered' type="text" placeholder='Not' />
                <input className='input input-bordered' type="text" placeholder='Saat' />
                <input className='input input-bordered' type="text" placeholder='Tarih' />
                <div className='flex flex-row gap-5'>
                    <button className='btn btn-primary'>Kaydet</button>
                    <button className='btn btn-secondary'>
                        <a href="/reservation">İptal</a></button>
                </div>
            </div>
        </div>
    )
}

export default ReservationDetails