export function SendWhatsAppMessage(msg, minute, msgType, reservationDate, reservationHour, reservationPitch, reservationType, phone) {

  const monthNames = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  const turkishDateFormatter = (date) => {
    const [day, month, year] = date.split(".");
    // The output should be in the format of 22 Şubat
    return `${day} ${monthNames[month - 1]}`;
  };

  const getTurkishDayName = (date) => {
    const [day, month, year] = date.split(".");
    const dateObj = new Date(year, month - 1, day);
    const dayName = dateObj.toLocaleDateString("tr", { weekday: "long" });
    return dayName;
  };

  const preReservationMessage = `
    
    Tarih: ${turkishDateFormatter(reservationDate)}
    Gün: ${getTurkishDayName(reservationDate)}
    Saat: ${reservationHour}:${minute} 
    Saha No: ${reservationPitch}

    ${msg}
  `;

  const reservationMessage = ` 
  Tarih: ${turkishDateFormatter(reservationDate)}
  Gün: ${getTurkishDayName(reservationDate)}
  Saat: ${reservationHour}:${minute} 
  Saha No: ${reservationPitch}

    ${msg}
  `;

  const cancelMsg = `
  Tarih: ${turkishDateFormatter(reservationDate)}
  Gün: ${getTurkishDayName(reservationDate)}
  Saat: ${reservationHour}:${minute}
  Saha No: ${reservationPitch}
  
  ${msg}
  `;

  const message =
    msgType === "cancel"
      ? cancelMsg
      : reservationType === "Ön Rez."
        ? preReservationMessage
        : reservationMessage;

  // Replace line breaks with a special character sequence
  const encodedMessage = encodeURIComponent(message);

  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
}
