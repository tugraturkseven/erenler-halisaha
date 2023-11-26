import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import { useLocation, useNavigate } from 'react-router-dom'
import { getReservationDetails, getReservations, setReservation, getReservationSchema, setAllReservations, getPitchList } from '../firebase';
import DropDown from '../components/DropDown';
import RadioGroup from '../components/RadioGroup';
import DatePicker from '../components/DatePicker';
import DateIndicator from '../components/DateIndicator';
import PhoneNumberInput from '../components/PhoneNumberInput';
import { UserContext } from '../contexts/UserContext';

function ReservationForm() {
    const user = useContext(UserContext);

    const location = useLocation();
    const navigate = useNavigate();
    const { pitch, index, date } = location.state;

    const [hour, setHour] = useState();

    const [reservationDate, setReservationDate] = useState(date);
    const [reservationPitch, setReservationPitch] = useState(pitch);
    const [reservationHour, setReservationHour] = useState(hour);
    const dateString = reservationDate.replaceAll('.', '-');
    const [payment, setPayment] = useState('Kapora');

    const [showPicker, setShowPicker] = useState(false);
    const [reservationSchema, setReservationSchema] = useState([]);
    const [schemaHours, setSchemaHours] = useState([]);
    const [pitches, setPitches] = useState([]);


    useEffect(() => {
        getReservationSchema().then((data) => {
            if (data) {
                setReservationSchema(data);
                // Add hours if visible to the schemaHours array
                setSchemaHours(data.filter(schemaItem => schemaItem.visible).map(schemaItem => schemaItem.hour));
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
                setHour(data.hour);
                setReservationHour(data.hour);
            }
        })

    }, []);



    function checkReservationExists(reservations) {
        if (reservationHour === hour && reservationPitch === pitch && date === reservationDate) return false;
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

            setAllReservations(dateString, initialReservations);

            return false;
        }

        // Find if there's a reservation for the given hour in the pitch's reservations
        const reservationIndex = reservations.findIndex(reservation => reservation.hour === reservationHour);
        if (reservationIndex === -1) {
            // No reservation found for the given hour, so the slot is available

            return false;
        }

        // Check if the reservation slot is already occupied
        const isReserved = reservations[reservationIndex].reservedUserName !== '';

        return isReserved;
    }

    const handleSave = async () => {
        try {
            const newDateString = reservationDate.replaceAll('.', '-');
            const reservations = await getReservations(newDateString, reservationPitch).then((data) => data);
            const reservationExists = checkReservationExists(reservations);
            const minute = pitches.find(pitch => pitch.name === reservationPitch).minute;
            const index = reservationSchema.findIndex(schemaItem => schemaItem.hour === reservationHour);

            if (!reservationExists) { // Check reservation exists or user updating the reservation
                await setReservation(newDateString, reservationPitch, index, reservationHour, minute, user.name, user.phone, 'Kullanici tarafindan rezerve edildi');
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


    return (
        <div className='flex flex-col items-center'>
            <Navbar endButton={pickDateComponent} />
            <div className='flex flex-col w-52 gap-5 items-center'>
                <p className='titleMedium font-bold text-center'>Rezervasyon Bilgileri</p>
                <DateIndicator selectedDay={reservationDate} setSelectedDay={setReservationDate} />
                <DatePicker showPicker={showPicker} handleDatePick={handleDatePick} />
                <DropDown options={pitches.map(pitch => pitch.name)} onSelect={handlePitch} selectedOption={reservationPitch} placeHolder={'🏟️ Saha'} />
                <DropDown options={schemaHours} onSelect={setReservationHour} selectedOption={reservationHour} placeHolder={'🕓 Saat'} />

                <PhoneNumberInput phoneNumber={user.phone} setPhoneNumber={null} />
                <input className='input w-full max-w-sm input-bordered' type="text" placeholder='🏷️ İsim Soyisim' value={user.name} disabled />
                <RadioGroup options={['Kapora', 'Rezervasyon']} selected={payment} setSelected={setPayment} />
                <div className='flex flex-col gap-5 w-52'>
                    <button className='btn btn-info' onClick={() => handleSave(true)}>✔️ Rezerve Et</button>
                    <button className='btn btn-accent' onClick={() => navigate('/reservation')}>🚪 Geri Dön</button>
                </div>
            </div>
        </div>
    )
}

export default ReservationForm