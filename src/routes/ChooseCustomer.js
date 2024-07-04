import React, { useState, useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import CustomerSelector from "../components/CustomerSelector";
import Search from "../components/Search";
import { CustomersContext } from "../contexts/CustomersContext";
import { PitchListContext } from "../contexts/PitchListContext";
import { SMSTemplatesContext } from "../contexts/SMSTemplatesContext";
import { useNavigate, useLocation } from "react-router-dom";
import WaiterList from "./WaiterList";
import { updateReservationProperty } from "../firebase";
import { toast } from "react-toastify";
import { getNextSameDayDate } from "../utils/SameDaysDate";
function ChooseCustomer() {
  const costumersContext = useContext(CustomersContext);
  const costumers = [...costumersContext.customers];
  const pitches = useContext(PitchListContext);
  const templates = useContext(SMSTemplatesContext);

  const [searchResults, setSearchResults] = useState(costumers);
  const [searchInput, setSearchInput] = useState("");
  const [tab, setTab] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state;

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

  const sendSubscriberMessage = (phoneNumber) => {
    const { date, minute, hour } = item;
    const pitch = pitches.find((pitch) => pitch.minute === minute);
    const subscriberMessage = `
        Tarih: ${turkishDateFormatter(date)}
        Gün: ${getTurkishDayName(date)}
        Saat: ${hour}:${minute}
        Saha No: ${pitch}

        ${
          templates.find(
            (template) => template?.description === "Bekleyen Hatırlatma"
          )?.message
        }
    `;
    const encodedMessage = encodeURIComponent(subscriberMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleAssign = (user) => {
    navigate("/reservationDetails", {
      state: {
        user: { phone: user.phoneNumber, name: user.name },
        ...location.state,
      },
    });
  };

  const handleRemove = async (user) => {
    const date = location.state.date;
    const dates = getNextSameDayDate(date);
    const { pitch, index } = location.state;
    const confirm = window.confirm(
      "Bekleyen listesinden kaldırmak istediğinizden emin misiniz?"
    );
    if (!confirm) {
      return;
    }

    if (!user) {
      for (const date of dates) {
        const [day, month, year] = date.split(".");
        await updateReservationProperty(
          year,
          month,
          day,
          pitch,
          index,
          "subscribers",
          []
        );
      }
      navigate("/reservation", { state: { date: location.state.date } });
      setTimeout(() => {
        toast(`Bekleyen listesi temizlendi.`);
      }, 1);
    } else {
      const filtered = item?.subscribers?.filter(
        (subscriber) => subscriber.phoneNumber !== user.phoneNumber
      );
      for (const date of dates) {
        const [day, month, year] = date.split(".");
        await updateReservationProperty(
          year,
          month,
          day,
          pitch,
          index,
          "subscribers",
          filtered
        );
      }
      navigate("/reservation", { state: { date: location.state.date } });
      setTimeout(() => {
        toast(`${user.name} bekleyen listesinden kaldırıldı`);
      }, 1);
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    // Remove all non-digit characters for consistency
    let cleaned = phoneNumber.replace(/\D/g, "");

    // Formatting based on the length and pattern of the input
    if (cleaned.startsWith("90")) {
      if (cleaned.length <= 2) {
        return "+" + cleaned;
      } else {
        cleaned = "+" + cleaned;
        return cleaned.replace(
          /(\+\d{2})(\d{1,3})?(\d{0,3})?(\d{0,2})?(\d{0,2})?/,
          (match, p1, p2, p3, p4, p5) => {
            return [p1, p2, p3, p4, p5].filter(Boolean).join(" ");
          }
        );
      }
    } else if (cleaned.startsWith("0")) {
      return cleaned.replace(
        /(\d{1,4})?(\d{0,3})?(\d{0,2})?(\d{0,2})?/,
        (match, p1, p2, p3, p4) => {
          return [p1, p2, p3, p4].filter(Boolean).join(" ");
        }
      );
    } else {
      return cleaned.replace(
        /(\d{1,3})?(\d{0,3})?(\d{0,2})?(\d{0,2})?/,
        (match, p1, p2, p3, p4) => {
          return [p1, p2, p3, p4].filter(Boolean).join(" ");
        }
      );
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Regular expression to test if the value is numerical (phone number)
    const isPhoneNumber = /^[\d\s\+\-]+$/.test(value);

    let formattedValue = value;

    if (isPhoneNumber) {
      // Format the phone number for display, removing spaces
      formattedValue = formatPhoneNumber(value.replace(/\s+/g, ""));
    }

    setSearchInput(formattedValue); // Update the search input state

    // Use the original value for phone numbers (with spaces removed) and the unmodified value for names
    handleChange(isPhoneNumber ? formattedValue : value);
  };

  const handleChange = (value) => {
    // Regular expression to test if the value is numerical (phone number)
    const isPhoneNumber = /^[\d\s\+\-]+$/.test(value);

    if (isPhoneNumber) {
      // Format the phone number for display
      const formattedValue = formatPhoneNumber(value);
      setSearchInput(formattedValue); // Update the search bar's display value
    }

    // Use the original value for filtering
    const searchResults = costumers.filter((costumer) => {
      if (isPhoneNumber) {
        // Remove non-digits from the input and costumer's phone for comparison
        const cleanedInput = value.replace(/\D/g, "");
        const cleanedPhone = costumer.phone.replace(/\D/g, "");
        return cleanedPhone.includes(cleanedInput);
      } else {
        // If value is alphabetical, search in the name
        return costumer.name.toLowerCase().includes(value.toLowerCase());
      }
    });

    setSearchResults(searchResults);
  };

  const createCustomerButton = (
    <button
      onClick={() => navigate("/createCustomer", { state: location.state })}
      className="btn btn-ghost normal-case text-xl xl:text-3xl"
    >
      <p>👱</p>
      <p className="absolute rotate-45 text-xs top-3 right-3">❌</p>
    </button>
  );

  const changeTabButton = (
    <button
      onClick={() => setTab(!tab)}
      className="btn btn-ghost normal-case text-xl xl:text-3xl"
    >
      {tab ? `⌛` : `👱`}
    </button>
  );

  return (
    <div className="flex flex-col h-screen items-center gap-5">
      <Navbar middleButton={changeTabButton} endButton={createCustomerButton} />

      {tab ? (
        <>
          <Search
            handleChange={handleChange}
            inputValue={searchInput}
            handleInputChange={handleInputChange}
          />
          <CustomerSelector data={searchResults} />
        </>
      ) : (
        <WaiterList
          data={item.subscribers}
          sendMessage={sendSubscriberMessage}
          handleAssign={(user) => handleAssign(user)}
          handleRemove={(user) => handleRemove(user)}
          date={location.state.date}
          index={location.state.index}
          pitch={location.state.pitch}
        />
      )}
    </div>
  );
}

export default ChooseCustomer;
