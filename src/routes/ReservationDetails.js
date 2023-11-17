import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useLocation, useNavigate } from 'react-router-dom'
import { getReservationDetails, getReservations, setReservation, getReservationSchema, setAllReservations } from '../firebase';
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

    const [reservationDate, setReservationDate] = useState(date);
    const [reservationPitch, setReservationPitch] = useState(pitch);
    const [reservationHour, setReservationHour] = useState(hour);
    const dateString = reservationDate.replaceAll('.', '-');
    const [isNewReservation, setIsNewReservation] = useState(true); // If the reservation is new, set it to true, otherwise false

    const [showPicker, setShowPicker] = useState(false);
    const [reservationSchema, setReservationSchema] = useState({ firstPitch: [], secondPitch: [] });
    const [schemaHours, setSchemaHours] = useState([]);



    useEffect(() => { // Schema needed for the date picker, if day is not created, create one
        getReservationSchema((data) => {
            setReservationSchema(data);
            const hours = data.firstPitch.map((item) => item.hour);
            setSchemaHours(hours);
        });
    }, []);



    const handleSave = () => {

        if (date.replaceAll('.', '-') !== dateString) { // If date is changed to another day.
            getReservations(dateString).then((data) => { // Get the reservations for the new date
                if (data) { // If there are reservations for the new date
                    const index = data[reservationPitch].findIndex((item) => item.hour === reservationHour);

                    if (index !== -1 && data[reservationPitch][index].reservedUserName == '') { // If the new hour is not reserved
                        setReservation(dateString, reservationPitch, index, reservationHour, name, phone, note);
                        if (!isNewReservation) setReservation(date.replaceAll('.', '-'), pitch, index, hour, '', '', '');
                        alert('Rezervasyon kaydedildi');
                        navigate('/reservation')
                    } else { // If the new hour is reserved
                        alert('Bu tarih ve saat rezerve edilmiş');
                    }
                } else {
                    setAllReservations(dateString, reservationSchema);
                    setReservation(dateString, reservationPitch, index, reservationHour, name, phone, note);
                    if (!isNewReservation) setReservation(date.replaceAll('.', '-'), pitch, index, hour, '', '', '');
                    alert('Rezervasyon kaydedildi');
                    navigate('/reservation')
                }
            }).catch((error) => { // If there are no reservations for the new date
                alert('Hata olustu:', error)
            });

        } else {
            getReservations(dateString).then((data) => {
                if (data) {

                    const newIndex = data[reservationPitch].findIndex((item) => item.hour === reservationHour);

                    const reservedUserName = data[reservationPitch][newIndex].reservedUserName;
                    if (newIndex !== -1 && ((hour === reservationHour && pitch === reservationPitch) || reservedUserName === '')) {
                        // Since date is not changed, check if hour or pitch is changed, if not check if the hour is reserved or not
                        // If hour or pitch is not changed, this means user is updating the reservation
                        setReservation(dateString, reservationPitch, newIndex, reservationHour, name, phone, note);

                        if (!isNewReservation && (hour !== reservationHour || pitch !== reservationPitch)) setReservation(date.replaceAll('.', '-'), pitch, index, hour, '', '', '');
                        // Reservation is not new, and hour or pitch is changed, so delete the old reservation
                        alert('Rezervasyon kaydedildi');
                        navigate('/reservation')
                    } else { // If the new hour is reserved
                        alert('Bu tarih ve saat rezerve edilmiş');
                    }
                }
            });
        }
    }



    useEffect(() => {
        getReservationDetails(dateString, pitch, index).then((data) => {
            if (data) {
                setName(data.reservedUserName);
                setPhone(data.reservedUserPhone);
                setNote(data.note);
                setHour(data.hour);
                setReservationHour(data.hour);
                data.reservedUserName !== '' ? setIsNewReservation(false) : setIsNewReservation(true);
            }
        })
    }, [])




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
        setReservation(date.replaceAll('.', '-'), pitch, index, hour, '', '', '');
        alert('Rezervasyon iptal edildi');
    }


    return (
        <div>
            <Navbar endButton={pickDateComponent} />
            <div className='flex flex-col gap-5 items-center'>
                <p className='titleMedium font-bold text-center'>Rezervasyon Bilgileri</p>
                <DateIndicator selectedDay={reservationDate} setSelectedDay={setReservationDate} />
                <DatePicker showPicker={showPicker} handleDatePick={handleDatePick} />
                <DropDown options={['Saha 1', 'Saha 2']} onSelect={handlePitch} selectedOption={reservationPitch === 'firstPitch' ? 'Saha 1' : 'Saha 2'} placeHolder={'🏟️ Saha'} />
                <DropDown options={schemaHours} onSelect={setReservationHour} selectedOption={reservationHour} placeHolder={'🕓 Saat'} />

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