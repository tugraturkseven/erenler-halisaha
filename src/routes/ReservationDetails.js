import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useLocation, useNavigate } from 'react-router-dom'
import { getReservationDetails, getReservations, setReservation, getReservationSchema, setAllReservations, getPitchList } from '../firebase';
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


    const [showPicker, setShowPicker] = useState(false);
    const [reservationSchema, setReservationSchema] = useState([]);
    const [schemaHours, setSchemaHours] = useState([]);
    const [pitches, setPitches] = useState([]);


    useEffect(() => {
        getReservationSchema().then((data) => {
            if (data) {
                setReservationSchema(data);
                setSchemaHours(data.map((item) => item.hour));
            }
        }).catch((error) => {
            console.log('Hata', error)
        });
        getPitchList().then(fetchedPitches => {
            setPitches(fetchedPitches);
        }).catch(error => {
            console.log('Error fetching pitches:', error);
        });

        getReservationDetails(dateString, pitch, index).then((data) => {
            if (data) {
                setName(data.reservedUserName);
                setPhone(data.reservedUserPhone);
                setNote(data.note);
                setHour(data.hour);
                setReservationHour(data.hour);
            }
        })
    }, []);



    function checkReservationExists(reservations) {
        if (reservationHour === hour && reservationPitch === pitch && date.replaceAll('.', '-') === reservationDate) return false;
        if (!reservations) {
            // No reservations for this pitch or date, so the slot is available
            let initialReservations = {};
            pitches.forEach(pitch => {
                // Add the minute attribute from the pitch to each schema item
                initialReservations[pitch.name] = reservationSchema.map(schemaItem => ({
                    ...schemaItem,
                    minute: pitch.minute
                }));
            });
            clearReservation();
            return false;
        }

        // Find if there's a reservation for the given hour in the pitch's reservations
        const reservationIndex = reservations.findIndex(reservation => reservation.hour === reservationHour);
        if (reservationIndex === -1) {
            // No reservation found for the given hour, so the slot is available
            clearReservation();
            return false;
        }

        // Check if the reservation slot is already occupied
        const isReserved = reservations[reservationIndex].reservedUserName !== '';
        clearReservation();
        return isReserved;
    }

    const handleSave = async () => {
        try {
            const newDateString = reservationDate.replaceAll('.', '-');
            const reservations = await getReservations(newDateString, reservationPitch).then((data) => data);
            const reservationExists = checkReservationExists(reservations);

            if (!reservationExists) { // Check reservation exists or user updating the reservation
                await setReservation(newDateString, reservationPitch, index, reservationHour, name, phone, note);
                alert('Rezervasyon kaydedildi');
                navigate('/reservation');
            } else {
                alert('Bu tarih ve saat rezerve edilmiş');
            }
        } catch (error) {
            console.error('Hata olustu:', error);
            alert('Bir hata oluştu, lütfen tekrar deneyin');
        }
    };



    const handlePitch = (selectedPitchName) => {
        const selectedPitch = pitches.find(pitch => pitch.name === selectedPitchName);
        setReservationPitch(selectedPitch ? selectedPitch.name : null);
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
    }


    return (
        <div>
            <Navbar endButton={pickDateComponent} />
            <div className='flex flex-col gap-5 items-center'>
                <p className='titleMedium font-bold text-center'>Rezervasyon Bilgileri</p>
                <DateIndicator selectedDay={reservationDate} setSelectedDay={setReservationDate} />
                <DatePicker showPicker={showPicker} handleDatePick={handleDatePick} />
                <DropDown options={pitches.map(pitch => pitch.name)} onSelect={handlePitch} selectedOption={reservationPitch} placeHolder={'🏟️ Saha'} />
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