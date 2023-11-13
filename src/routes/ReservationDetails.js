import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useLocation, useNavigate } from 'react-router-dom'
import { getReservationDetails, setReservation } from '../firebase';
import DropDown from '../components/DropDown';


import DatePicker from '../components/DatePicker';
import DateIndicator from '../components/DateIndicator';


function ReservationDetails() {

    const location = useLocation();
    const navigate = useNavigate();
    const { pitch, index, date } = location.state;

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');
    const [hour, setHour] = useState();

    const [reservationDate, setReservationDate] = useState(date.replaceAll('-', '.'));
    const [reservationPitch, setReservationPitch] = useState(pitch);
    const [reservationHour, setReservationHour] = useState(hour);




    const [showPicker, setShowPicker] = useState(false);



    const handleSave = () => {
        const stringDate = reservationDate.replaceAll('.', '-');
        setReservation(stringDate, reservationPitch, index, name, phone, 'approved', note).then(() => {
            alert('Rezervasyon kaydedildi');
            navigate('/reservation');
        }).catch((error) => {
            alert('Rezervasyon kaydedilemedi', error);
        }
        )
    }



    useEffect(() => {
        getReservationDetails(date, pitch, index).then((data) => {
            if (data) {
                console.log(data)
                setName(data.reservedUserName);
                setPhone(data.reservedUserPhone);
                setNote(data.note);
                setHour(data.hour);
            }
        })
    }, [])


    const hours = [16, 17, 18, 19, 20, 21, 22, 23, 24];

    const handlePitch = (option) => {
        if (option === 'Saha 1') {
            setReservationPitch('firstPitch');
        } else {
            setReservationPitch('secondPitch');
        }
    }

    const handleDatePick = (date) => {
        setShowPicker(false);
        setReservationDate(date.toLocaleDateString('tr'));
    }

    const pickDateComponent = (
        <button onClick={() => setShowPicker(!showPicker)} className='btn btn-ghost normal-case text-xl xl:text-3xl '>
            📅
        </button>
    );



    const clearReservation = () => {
        setName('');
        setPhone('');
        setNote('');
        setReservationHour(hour);
        setReservationPitch(pitch);
        setReservationDate(date);
        handleSave();
    }


    return (
        <div>
            <Navbar endButton={pickDateComponent} />
            <div className='flex flex-col gap-5 items-center'>
                <p className='titleMedium font-bold text-center'>Rezervasyon Bilgileri</p>
                <DateIndicator selectedDay={reservationDate} setSelectedDay={setReservationDate} />
                <DatePicker showPicker={showPicker} handleDatePick={handleDatePick} />
                <DropDown options={['Saha 1', 'Saha 2']} onSelect={handlePitch} selectedOption={reservationPitch === 'firstPitch' ? 'Saha 1' : 'Saha 2'} placeHolder={'🏟️ Saha'} />
                <DropDown options={hours} onSelect={setReservationHour} selectedOption={reservationHour} placeHolder={'🕓 Saat'} />

                <input className='input input-bordered' type="text" placeholder='🏷️ İsim Soyisim' value={name} onChange={(e) => setName(e.target.value)} />
                <input className='input input-bordered' type="text" placeholder='📞 Telefon' value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input className='input input-bordered' type="text" placeholder='🗒️ Not' value={note} onChange={(e) => setNote(e.target.value)} />

                <div className='flex flex-col gap-5 w-52'>
                    <button className='btn btn-info' onClick={() => handleSave()}>💾 Kaydet</button>
                    <button className='btn btn-secondary' onClick={() => clearReservation()}>❌ Iptal Et</button>
                    <button className='btn btn-accent' onClick={() => navigate('/reservation')}>🚪 Geri Dön</button>
                </div>
            </div>
        </div>
    )
}

export default ReservationDetails