import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import RadioGroup from '../components/RadioGroup'
import { useLocation, useNavigate } from 'react-router-dom'
import { updateCostumer } from '../firebase'
import PhoneNumberInput from '../components/PhoneNumberInput'


function CostumerDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const costumer = location.state.costumer;

    const [name, setName] = useState(costumer.name)
    const [phone, setPhone] = useState(costumer.phone)
    const [type, setType] = useState(costumer.type)

    const handleSave = () => {
        updateCostumer(costumer.id, name, phone, type).then(() => {
            alert('Müşteri bilgileri güncellendi');
            navigate('/customers');
        }).catch((error) => {
            alert('Müşteri bilgileri güncellenemedi', error);
        }
        );

    }

    return (
        <div className='flex flex-col items-center'>
            <Navbar />
            <div className='flex flex-col gap-5 w-52 justify-center items-center'>
                <p className='titleMedium font-bold text-center'>Müşteri Bilgileri</p>
                <input className='input input-bordered' type="text" placeholder='İsim Soyisim' value={name} onChange={(e) => setName(e.target.value)} />
                <PhoneNumberInput phoneNumber={phone} setPhoneNumber={setPhone} />
                <RadioGroup type={type} setType={setType} />
                <div className='flex flex-row gap-5'>
                    <button className='btn btn-primary' onClick={handleSave}>Kaydet</button>
                    <button className='btn btn-secondary' onClick={() => navigate('/costumers')}>
                        İptal</button>
                </div>
            </div>
        </div>
    )
}

export default CostumerDetails