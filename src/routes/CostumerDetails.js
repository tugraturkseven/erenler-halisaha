import React, { useState, useContext } from 'react'
import Navbar from '../components/Navbar'
import RadioGroup from '../components/RadioGroup'
import { useLocation, useNavigate } from 'react-router-dom'
import { updateCostumer } from '../firebase'
import PhoneNumberInput from '../components/PhoneNumberInput'
import { deleteCostumer } from '../firebase'
import { CustomersContext } from '../contexts/CustomersContext'

function CostumerDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const costumer = location.state.costumer;
    const [name, setName] = useState(costumer.name)
    const [phone, setPhone] = useState(costumer.phone)
    const [type, setType] = useState(costumer.type)
    const { deleteCustomer, updateCustomer } = useContext(CustomersContext);

    // Costumer id consist of phone number and uid seperated by - . We need to split it to get uid.
    const uid = costumer.id.split('-')[1] || costumer.id;


    const handleSave = () => {
        updateCostumer(costumer.id, name, phone, type).then(() => {
            alert('Müşteri bilgileri güncellendi');
            updateCustomer({ id: costumer.id, name: name, phone: phone, type: type });
            navigate('/customers');
        }).catch((error) => {
            alert('Müşteri bilgileri güncellenemedi', error);
        }
        );

    }

    const handleDelete = () => {
        if (window.confirm('Müşteriyi silmek istediğinize emin misiniz?')) {
            fetch('https://efelerpark-halisaha-backend.cyclic.app/delete-user', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: uid })
            }).then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    return res.json().then(data => Promise.reject(data));
                }
            }).then(data => {
                deleteCostumer(phone, uid);
                alert("Müşteri başarıyla silindi.");
                deleteCustomer(costumer.id);
                navigate("/reservation");
            }).catch(err => {
                alert(`Müşteri silinemedi. ${err.message}`);
            });
        }
    }

    return (
        <div className='flex flex-col items-center'>
            <Navbar />
            <div className='flex flex-col gap-5 w-52 justify-center items-center'>
                <p className='titleMedium font-bold text-center'>Müşteri Bilgileri</p>
                <PhoneNumberInput phoneNumber={phone} setPhoneNumber={setPhone} />
                <input className='input w-full max-w-xs input-bordered' type="text" placeholder='İsim Soyisim' value={name} onChange={(e) => setName(e.target.value)} />
                <p className='titleMedium font-bold text-center'>Kullanıcı Tipi</p>
                <RadioGroup options={['customer', 'admin']} selected={type} setSelected={setType} />
                <p className='titleMedium font-bold text-center'>İşlemler</p>
                <div className='flex flex-col gap-5 w-full'>
                    <button className='btn btn-info' onClick={handleSave}>💾 Kaydet</button>
                    <button className='btn btn-warning' onClick={handleDelete}>🗑️ Sil</button>
                    <button className='btn btn-secondary' onClick={() => navigate('/customers')}>❌ İptal</button>

                </div>
            </div>
        </div>
    )
}

export default CostumerDetails