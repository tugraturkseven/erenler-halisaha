import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import RadioGroup from '../components/RadioGroup'
import { useLocation, useNavigate } from 'react-router-dom'
import { updateCostumer } from '../firebase'



function CostumerDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;



    const [name, setName] = useState(user.name)
    const [phone, setPhone] = useState(user.phone)
    const [type, setType] = useState(user.type)

    const handleSave = () => {
        updateCostumer(user.id, name, user.email, phone, type).then(() => {
            alert('Müşteri bilgileri güncellendi');
            navigate('/costumers');
        }).catch((error) => {
            alert('Müşteri bilgileri güncellenemedi', error);
        }
        );
    }

    return (
        <div>
            <Navbar />
            <div className='flex flex-col gap-5 items-center'>
                <p className='titleMedium font-bold text-center'>Müşteri Bilgileri</p>
                <input className='input input-bordered' type="text" placeholder='İsim Soyisim' value={name} onChange={(e) => setName(e.target.value)} />
                <input className='input input-bordered' type="number" placeholder='Telefon' value={phone} onChange={(e) => setPhone(e.target.value)} />
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