import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import PhoneNumberInput from '../components/PhoneNumberInput'
import { useNavigate, useLocation } from 'react-router-dom'
import { createCostumer } from '../firebase'
import { isValidPhoneNumber } from 'react-phone-number-input'

function CreateCustomer() {
    const [phone, setPhone] = useState("")
    const [name, setName] = useState("")

    const navigate = useNavigate()
    const location = useLocation()

    const handleSave = () => {
        if (!isValidPhoneNumber(phone)) {
            alert('Lütfen geçerli bir telefon numarası giriniz.')
            return;
        }
        if (name === "") {
            alert('Lütfen bir isim giriniz.')
            return;
        }

        fetch('https://efelerparkhalisaha.cyclic.app/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone })
        }).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                return res.json().then(data => Promise.reject(data));
            }
        })
            .then(data => {
                createCostumer(data.userId, name, phone, 'customer');
                const user = {
                    id: data.userId,
                    name: name,
                    phone: phone,
                    type: 'customer'
                }
                alert("Müşteri başarıyla oluşturuldu.");
                navigate("/reservationDetails", { state: { ...location.state, user } });
            })
            .catch(err => {
                if (err.error === 'Email already exists')
                    alert(`Müşteri oluşturulamadı, ${phone} numarası zaten kayıtlı.`);
            });
    };

    return (
        <div className="flex flex-col items-center">
            <Navbar />
            <div className="flex flex-col w-52 gap-5 items-center mt-5">
                <h1 className="text-2xl">👤 Yeni Müşteri</h1>
                <PhoneNumberInput phoneNumber={phone} setPhoneNumber={setPhone} />
                <input
                    className="input w-full max-w-sm input-bordered"
                    type="text"
                    placeholder="🏷️ İsim Soyisim"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="flex flex-col gap-5 w-52">
                    <button className="btn btn-info" onClick={() => handleSave(true)}>
                        💾 Kaydet
                    </button>
                    <button
                        className="btn btn-accent"
                        onClick={() => navigate("/reservation")}
                    >
                        🚪 Geri Dön
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateCustomer