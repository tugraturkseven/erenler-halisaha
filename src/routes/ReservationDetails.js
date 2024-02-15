import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getReservationDetails,
  getReservations,
  setReservation,
  getReservationSchema,
  setAllReservations,
  getPitchList,
  getTomorrowNightVisibility,
} from "../firebase";
import DropDown from "../components/DropDown";
import DatePicker from "../components/DatePicker";
import DateIndicator from "../components/DateIndicator";
import PhoneNumberInput from "../components/PhoneNumberInput";
import RadioGroup from "../components/RadioGroup";

function ReservationDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, pitch, index, date } = location.state;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [hour, setHour] = useState();

  const [reservationDate, setReservationDate] = useState(date);
  const [reservationPitch, setReservationPitch] = useState(pitch);
  const [reservationHour, setReservationHour] = useState(hour);
  const [reservationType, setReservationType] = useState("");
  const dateString = reservationDate.replaceAll(".", "-");

  const [showPicker, setShowPicker] = useState(false);
  const [reservationSchema, setReservationSchema] = useState([]);
  const [schemaHours, setSchemaHours] = useState([]);
  const [pitches, setPitches] = useState([]);

  useEffect(() => {
    if (schemaHours.length === 0) {
      getReservationSchema()
        .then((data) => {
          if (data) {
            setReservationSchema(data);
            // Add hours if visible to the schemaHours array
            setSchemaHours(
              data
                .filter((schemaItem) => schemaItem.visible)
                .map((schemaItem) => schemaItem.hour)
            );
          }
        })
        .catch((error) => {
          console.log("Hata", error);
        });


    }
    if (schemaHours.length > 0) {
      getTomorrowNightVisibility().then((data) => {
        if (data) {
          setSchemaHours((prevSchemaHours) => [
            ...prevSchemaHours,
            "01",
            "02",
            "03",
            "04",
          ]);
        }
      });

    }
    if (pitches.length === 0) {
      getPitchList()
        .then((fetchedPitches) => {
          setPitches(fetchedPitches);
        })
        .catch((error) => {
          console.log("Error fetching pitches:", error);
        });
    }


    if (!reservationHour) {
      getReservationDetails(dateString, pitch, index).then((data) => {
        if (data) {
          setPhone(user ? user.phone : data.reservedUserPhone);
          setNote(data?.note);
          setHour(data?.hour);
          setReservationHour(data?.hour);
          setName(user ? user?.name : data?.reservedUserName);
          setReservationType(data?.reservationType || "Ön Rez.");
        }
      });
    }
  }, []);

  function checkReservationExists(reservations) {
    if (
      reservationHour === hour &&
      reservationPitch === pitch &&
      date === reservationDate
    )
      return false;
    if (!reservations) {
      // No reservations for this pitch or date, so the slot is available
      let initialReservations = {};
      pitches.forEach((pitch) => {
        // Add the minute attribute from the pitch to each schema item
        initialReservations[pitch.name] = reservationSchema.map(
          (schemaItem) => ({
            ...schemaItem,
            minute: pitch.minute,
          })
        );
      });
      setAllReservations(dateString, initialReservations);
      return false;
    }

    // Find if there's a reservation for the given hour in the pitch's reservations
    const reservationIndex = reservations.findIndex(
      (reservation) => reservation.hour === reservationHour
    );
    if (reservationIndex === -1) {
      // No reservation found for the given hour, so the slot is available

      return false;
    }

    // Check if the reservation slot is already occupied
    const isReserved = reservations[reservationIndex].reservedUserName !== "";

    return isReserved;
  }

  const sendWhatsAppMessage = (minute, msgType) => {
    const preReservationMessage = `
      Gün: ${reservationDate}
      Saat: ${reservationHour}:${minute} 
      Saha No: ${reservationPitch}

      *ÖN REZERVASYONUNUZ* YAPILMIŞTIR.

      Lütfen iki saat içinde

      *700 TL CAYMA BEDELİ*

      ödeme yapınız.

      Ödeme yapmaz iseniz ön rezervasyonunuz otomatik olarak iptal edilecektir.

      NOT: MAÇ OYNANDIKTAN SONRA YAPTIĞINIZ ÖDEME BAKİYEDEN DÜŞÜLECEKTİR.

      Nazlı AK

      Halkbank

      71 0001 2001 2700 0001 1173 80

      Ödeme yapınca mutlaka bilgilendirme yapınız.`;

    const reservationMessage = ` 
    Gün: ${reservationDate}
    Saat: ${reservationHour}:${minute} 
    Saha No: ${reservationPitch}
    
    *REZERVASYONUNUZ YAPILMIŞTIR*

    Lütfen tarihi ve saati kontrol ediniz.

    ÖNEMLİ NOT;

    MAÇIN OLACAĞI GÜN LÜTFEN SABAHTAN HAVA DURUMUNA BAKIP, YAĞMUR YAĞACAK DİYE MAÇI İPTAL ETTİRMEYİNİZ. MAÇ SAATİNDEN BİR SAAT ÖNCE HAVA KOŞULLARI UYGUN OLMAZSA DURUM DEĞERLENDİRMESİ YAPILIP, MAÇINIZ İPTAL EDİLEBİLİR VEYA ERTELEYEBİLİRİZ.

    Bir saat önceden iptal ve erteleme şartı sadece

    YAĞMURLU HAVA KOŞULLARI İÇİN GEÇERLİDİR.
    `;


    const cancelMsg = `
    Gün: ${reservationDate}
    Saat: ${reservationHour}:${minute}
    Saha No: ${reservationPitch}

    *REZERVASYONUNUZ İPTAL EDİLMİŞTİR*

    İyi günler dileriz.`;

    const message = msgType === "cancel" ? cancelMsg : (reservationType === "Ön Rez." ? preReservationMessage : reservationMessage);

    // Replace line breaks with a special character sequence
    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };



  const handleSave = async () => {
    try {
      const newDateString = reservationDate.replaceAll(".", "-");
      const reservations = await getReservations(
        newDateString,
        reservationPitch
      ).then((data) => data);
      const reservationExists = checkReservationExists(reservations);
      const minute = pitches.find(
        (pitch) => pitch.name === reservationPitch
      ).minute;
      const index = reservationSchema.findIndex(
        (schemaItem) => schemaItem.hour === reservationHour
      );

      if (!reservationExists) {
        // Check reservation exists or user updating the reservation
        await setReservation(
          newDateString,
          reservationPitch,
          index,
          reservationHour,
          minute,
          name,
          phone,
          note,
          reservationType
        );
        alert("Rezervasyon kaydedildi");
        if (window.confirm("Rezervasyon sahibine bilgi vermek ister misiniz?")) {
          sendWhatsAppMessage(minute, "reservation");
        }
        navigate("/reservation", { state: { date: reservationDate } });
      } else {
        alert("Bu tarih ve saat rezerve edilmiş");
      }
    } catch (error) {
      console.error("Hata olustu:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin");
    }
    if (
      reservationHour !== hour ||
      reservationPitch !== pitch ||
      date !== reservationDate
    )
      clearReservation(false);
  };

  const handlePitch = (selectedPitchName) => {
    const selectedPitch = pitches.find(
      (pitch) => pitch.name === selectedPitchName
    );
    setReservationPitch(selectedPitch ? selectedPitch.name : null);
  };

  const handleDatePick = (date) => {
    setShowPicker(false);
    setReservationDate(date.toLocaleDateString("tr"));
  };

  const pickDateComponent = (
    <button
      onClick={() => setShowPicker(!showPicker)}
      className="btn btn-ghost normal-case text-xl xl:text-3xl "
    >
      📅
    </button>
  );

  const clearReservation = (notify) => {
    if (
      notify &&
      !window.confirm("Bu rezervasyonu iptal etmek istediğinize emin misiniz?")
    )
      return;
    const minute = pitches.find((p) => p.name === pitch).minute;
    setName("");
    setPhone("");
    setNote("");
    setReservation(
      date.replaceAll(".", "-"),
      pitch,
      index,
      hour,
      minute,
      "",
      "",
      ""
    );
    if (notify) {
      alert("Rezervasyon iptal edildi");
      if (window.confirm("Rezervasyon sahibine bilgi vermek ister misiniz?")) {
        sendWhatsAppMessage(minute, "cancel");
      }
      navigate("/reservation", { state: { date: reservationDate } });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Navbar endButton={pickDateComponent} />
      <div className="flex flex-col gap-5 items-center">
        <p className="titleMedium font-bold text-center">
          Rezervasyon Bilgileri
        </p>
        <DateIndicator
          selectedDay={reservationDate}
          setSelectedDay={setReservationDate}
        />
        <DatePicker showPicker={showPicker} handleDatePick={handleDatePick} />
        <DropDown
          options={pitches.map((pitch) => pitch.name)}
          onSelect={handlePitch}
          selectedOption={reservationPitch}
          placeHolder={"🏟️ Saha"}
        />
        <DropDown
          options={schemaHours}
          onSelect={setReservationHour}
          selectedOption={reservationHour}
          placeHolder={"🕓 Saat"}
        />

        <PhoneNumberInput phoneNumber={phone} setPhoneNumber={setPhone} width={'w-52'} />
        <input
          className="input  w-52 max-w-sm input-bordered"
          type="text"
          placeholder="🏷️ İsim Soyisim"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input w-52 max-w-sm input-bordered"
          type="text"
          placeholder="🗒️ Not"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="flex flex-row items-center justify-center gap-5 w-52">
          <RadioGroup options={["Ön Rez.", "Kesin Rez."]} selected={reservationType} setSelected={setReservationType} />
        </div>
        <div className="flex flex-row gap-5 w-52">
          <button className="btn btn-info" onClick={() => handleSave(true)}>
            💾
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => clearReservation(true)}
          >
            ❌
          </button>
          <button
            className="btn btn-accent"
            onClick={() => navigate("/reservation")}
          >
            🚪
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationDetails;
