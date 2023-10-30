import React from 'react'
import Navbar from '../components/Navbar'
import RadioGroup from '../components/RadioGroup'
function CostumerDetails() {
    return (
        <div>
            <Navbar />
            <div className='flex flex-col gap-5 items-center'>
                <p className='titleMedium font-bold text-center'>Müşteri Bilgileri</p>
                <input className='input input-bordered' type="text" placeholder='İsim Soyisim' />
                <input className='input input-bordered' type="text" placeholder='Telefon' />
                <input className='input input-bordered' type="text" placeholder='Not' />
                <RadioGroup />
                <div className='flex flex-row gap-5'>
                    <button className='btn btn-primary'>Kaydet</button>
                    <button className='btn btn-secondary'>
                        <a href="/costumers">İptal</a></button>
                </div>
            </div>
        </div>
    )
}

export default CostumerDetails