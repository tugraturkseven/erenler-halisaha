import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
  remove,
  update,
  push,
} from "firebase/database";
import "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const deleteCostumer = (phone, id) => {
  const db = getDatabase();
  const userRef = ref(db, "users/" + phone + "-" + id);

  try {
    remove(userRef);
  } catch (error) {
    throw error;
  }
};

const createCostumer = (userId, name, phone, type) => {
  const db = getDatabase();
  set(ref(db, "users/" + phone + "-" + userId), {
    name: name,
    type: type,
    phone: phone,
  });
};

const setPrices = (fees) => {
  const db = getDatabase();
  set(ref(db, "settings/fees/"), {
    ...fees,
  });
};

const getPrice = async () => {
  const db = getDatabase();
  const priceRef = ref(db, "settings/fees/");

  return get(priceRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const priceData = snapshot.val();
        return priceData; // Return the user data when it exists
      } else {
        return null; // Return null when no data is found
      }
    })
    .catch((error) => {
      throw error; // Re-throw the error to be handled in the calling code
    });
};

const getDeposit = async () => {
  const db = getDatabase();
  const depositRef = ref(db, "settings/fees/");
  return get(depositRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const depositData = snapshot.val();
        return depositData; // Return the user data when it exists
      } else {
        return null; // Return null when no data is found
      }
    })
    .catch((error) => {
      throw error; // Re-throw the error to be handled in the calling code
    });
};

const setTomorrowNightVisibility = (visibility) => {
  const db = getDatabase();
  set(ref(db, "settings/tomorrowNightVisibility/"), {
    visibility: visibility,
  });
};

const getTomorrowNightVisibility = async () => {
  const db = getDatabase();
  const tomorrowNightVisibilityRef = ref(
    db,
    "settings/tomorrowNightVisibility/"
  );
  return get(tomorrowNightVisibilityRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const tomorrowNightVisibilityData = snapshot.val();
        return tomorrowNightVisibilityData; // Return the user data when it exists
      } else {
        return null; // Return null when no data is found
      }
    })
    .catch((error) => {
      throw error; // Re-throw the error to be handled in the calling code
    });
};

const setPitches = (pitches) => {
  const db = getDatabase();
  set(ref(db, "pitches/"), {
    ...pitches,
  });
};

const getPitchList = () => {
  const db = getDatabase();
  const pitchesRef = ref(db, "pitches/");

  return get(pitchesRef) // Return the promise
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val(); // Return the pitch data
      } else {
        return null; // Return null when no data is found
      }
    })
    .catch((error) => {
      throw error; // Propagate the error
    });
};

const setReservationSchema = (reservationSchema) => {
  const db = getDatabase();
  set(ref(db, "reservationSchema/"), { ...reservationSchema })
    .then(() => {
      alert("Şema başarıyla kaydedildi.");
    })
    .catch((error) => {
      alert("Şema kaydedilirken bir hata oluştu.", error);
    });
};

const getReservationSchema = async () => {
  const db = getDatabase();
  const reservationSchemaRef = ref(db, "reservationSchema/");

  return get(reservationSchemaRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const reservationSchemaData = snapshot.val();
        return reservationSchemaData; // Call the callback function with the data
      } else {
        return null; // Call the callback function with no data
      }
    })
    .catch((error) => {});
};

const updateCostumer = async (userId, name, phone, type) => {
  const db = getDatabase();
  const userRef = ref(db, "users/" + userId);
  try {
    await set(userRef, {
      name: name,
      type: type,
      phone: phone,
    });
  } catch (error) {
    throw error;
  }
};

const removeUser = async (userId) => {
  const db = getDatabase();
  const userRef = ref(db, "users/" + userId);

  try {
    await remove(userRef);
    getAuth()
      .deleteUser(userId)
      .then(() => {
        console.log("Successfully deleted user");
      })
      .catch((error) => {
        console.log("Error deleting user:", error);
      });
  } catch (error) {
    throw error;
  }
};

const setAllReservations = (date, reservations) => {
  const db = getDatabase();
  const [day, month, year] = date.split("-");

  set(ref(db, `reservations_restructured/${year}/${month}/${day}`), {
    ...reservations,
  });
};

const addPitchToDate = (date, pitchName, reservationSchema) => {
  const db = getDatabase();
  set(ref(db, "reservations_restructured/" + date + "/" + pitchName), {
    ...reservationSchema,
  });
};

const setReservation = async (
  date,
  pitch,
  index,
  hour,
  minute,
  userName,
  phone,
  note,
  reservationType,
  subscribers
) => {
  try {
    // Initialize the Firebase database
    const db = getDatabase();
    const [day, month, year] = date.split("-");

    // Create a reference to the reservation data
    const reservationRef = ref(
      db,
      `reservations_restructured/${year}/${month}/${day}/${pitch}/${index}`
    );

    // Create an object with reservation details
    const reservationData = {
      hour: hour,
      minute,
      note: note,
      reservedUserName: userName,
      reservedUserPhone: phone,
      visible: true,
      reservationType: reservationType || "",
      subscribers: subscribers || [],
    };

    // Set the reservation data in the database
    await set(reservationRef, reservationData);
  } catch (error) {
    throw error;
  }
};

const getCostumerData = async (userId) => {
  const db = getDatabase();
  const userRef = ref(db, "users/" + userId);

  return get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        return userData;
      } else {
        return null;
      }
    })
    .catch((error) => {});
};

const getAllCostumers = async () => {
  const db = getDatabase();
  const usersRef = ref(db, "users/");

  try {
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      return snapshot.val(); // Return the user data when it exists
    } else {
      console.log("No user found.");
      return null; // Return null when no data is found
    }
  } catch (error) {
    throw error; // Re-throw the error to be handled in the calling code
  }
};

const getReservations = async (date, pitchName) => {
  const db = getDatabase();
  const [day, month, year] = date.split("-");
  const reservationRef = ref(
    db,
    `reservations_restructured/${year}/${month}/${day}` + "/" + pitchName
  );
  try {
    const snapshot = await get(reservationRef);
    if (snapshot.exists()) {
      const reservationData = snapshot.val();
      return reservationData;
    } else {
      return null;
    }
  } catch (error) {
    throw error; // Rethrow the error for further error handling
  }
};

const checkDateExist = async (date) => {
  const db = getDatabase();
  const [day, month, year] = date.split("-");
  const reservationRef = ref(
    db,
    `reservations_restructured/${year}/${month}/${day}`
  );
  try {
    const snapshot = await get(reservationRef);
    if (snapshot.exists()) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error; // Rethrow the error for further error handling
  }
};

const getReservationDetails = async (date, pitch, index) => {
  try {
    // Initialize the Firebase database
    const db = getDatabase();
    const [day, month, year] = date.split("-");
    // Create a reference to the reservation data
    const reservationRef = ref(
      db,
      `reservations_restructured/${year}/${month}/${day}/${pitch}/${index}`
    );

    // Fetch the data using get
    const snapshot = await get(reservationRef);

    if (snapshot.exists()) {
      // Data exists, return it
      return snapshot.val();
    } else {
      // Data not found
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const getSMSTemplates = async () => {
  const db = getDatabase();
  const smsTemplatesRef = ref(db, "smsTemplates/");

  try {
    const snapshot = await get(smsTemplatesRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const saveSMSTemplate = async (template) => {
  const db = getDatabase();
  const smsTemplateRef = ref(db, "smsTemplates/" + template.id);

  try {
    await set(smsTemplateRef, template);
  } catch (error) {
    throw error;
  }
};

const deleteSMSTemplate = (id) => {
  const db = getDatabase();
  remove(ref(db, "smsTemplates/" + id));
};

const getSMSTemplate = async (id) => {
  const db = getDatabase();
  const smsTemplateRef = ref(db, "smsTemplates/" + id);

  try {
    const snapshot = await get(smsTemplateRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const setAlertTime = async (time) => {
  const db = getDatabase();
  const alertTimeRef = ref(db, "settings/alertTime/");
  try {
    await set(alertTimeRef, time);
  } catch (error) {
    throw error;
  }
};

const getAlertTime = async () => {
  const db = getDatabase();
  const alertTimeRef = ref(db, "settings/alertTime/");

  try {
    const snapshot = await get(alertTimeRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const countReservations = async (date) => {
  // const month = (new Date().getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if necessary
  // const year = new Date().getFullYear();
  // Date is in the format of DD.MM.YYYY, so we need to split it into day, month, and year
  const [day, month, year] = date?.split(".");
  const db = getDatabase();
  const reservationsRef = ref(db, `reservations_restructured/${year}/${month}`);

  try {
    const snapshot = await get(reservationsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error counting reservations:", error);
    throw error;
  }
};

const setReservationUpdateFlag = async () => {
  const db = getDatabase();
  const now = new Date();
  const reservationUpdateFlagRef = ref(db, "flags/");

  try {
    await set(reservationUpdateFlagRef, {
      reservationUpdateFlag: now.toISOString(),
    });
  } catch (error) {
    throw error;
  }
};

const getReservationUpdateFlag = async () => {
  const db = getDatabase();
  const reservationUpdateFlagRef = ref(db, "flags/reservationUpdateFlag/");

  try {
    const snapshot = await get(reservationUpdateFlagRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error getting reservation update flag:", error);
    throw error;
  }
};

const updateReservationProperty = async (
  year,
  month,
  day,
  pitch,
  index,
  property,
  value
) => {
  const db = getDatabase();
  const reservationRef = ref(
    db,
    `reservations_restructured/${year}/${month}/${day}/${pitch}/${index}`
  );
  try {
    const updateData = {};
    updateData[property] = value;
    await update(reservationRef, updateData);
  } catch (error) {
    throw error;
  }
};

const addSubscriberToReservation = async (
  year,
  month,
  day,
  pitch,
  index,
  value
) => {
  const db = getDatabase();
  const reservationRef = ref(
    db,
    `reservations_restructured/${year}/${month}/${day}/${pitch}/${index}`
  );
  try {
    const subscribers = (await get(reservationRef)).val().subscribers;
    const isIncluded = subscribers?.find(
      (item) => item.phoneNumber === value.phoneNumber
    );
    if (isIncluded) {
      throw new Error("Müşteri zaten bekleyen listesinde bulunuyor.");
    }
    if (subscribers && subscribers.length > 0) {
      const newSubscribers = [...subscribers, value];
      await update(reservationRef, { subscribers: newSubscribers });
    } else {
      await update(reservationRef, { subscribers: [value] });
    }
  } catch (error) {
    throw error;
  }
};

const saveAnnouncementMessage = async (announcement) => {
  const db = getDatabase();
  const announcementMessagesRef = ref(
    db,
    "announcementMessages/" + announcement.id
  );
  try {
    await set(announcementMessagesRef, announcement);
  } catch (error) {
    throw error;
  }
};

const getAnnouncementMessages = async () => {
  const db = getDatabase();
  const announcementMessagesRef = ref(db, "announcementMessages/");

  try {
    const snapshot = await get(announcementMessagesRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const addNotice = async (notice, index) => {
  const db = getDatabase();
  const noticeRef = ref(db, "notices/" + index);

  try {
    await set(noticeRef, notice);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

const deleteNotice = async (index) => {
  const db = getDatabase();
  const noticeRef = ref(db, "notices/" + index);

  try {
    await remove(noticeRef);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

const deleteAllNotices = async () => {
  const db = getDatabase();
  const noticesRef = ref(db, "notices");

  try {
    await remove(noticesRef);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

const getAllNotices = async () => {
  const db = getDatabase();
  const noticesRef = ref(db, "notices/");

  try {
    const snapshot = await get(noticesRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const updateAllNotices = async (notices) => {
  const db = getDatabase();
  const noticesRef = ref(db, "notices");

  try {
    await set(noticesRef, notices);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

const getNoticeAutoflow = async () => {
  const db = getDatabase();
  const autoFlowRef = ref(db, "settings/noticeAutoflow");

  try {
    const snapshot = await get(autoFlowRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const setNoticeAutoflow = async (autoflow) => {
  const db = getDatabase();
  const autoFlowRef = ref(db, "settings/noticeAutoflow");

  try {
    await set(autoFlowRef, autoflow);
    return "success";
  } catch (error) {
    throw error;
  }
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  deleteCostumer,
  createCostumer,
  setAllReservations,
  addPitchToDate,
  getCostumerData,
  getReservations,
  getReservationDetails,
  setReservation,
  getAllCostumers,
  updateCostumer,
  removeUser,
  setReservationSchema,
  getReservationSchema,
  setPitches,
  getPitchList,
  setPrices,
  getPrice,
  getDeposit,
  setTomorrowNightVisibility,
  getTomorrowNightVisibility,
  checkDateExist,
  getSMSTemplates,
  getSMSTemplate,
  saveSMSTemplate,
  deleteSMSTemplate,
  setAlertTime,
  getAlertTime,
  countReservations,
  setReservationUpdateFlag,
  getReservationUpdateFlag,
  updateReservationProperty,
  addSubscriberToReservation,
  saveAnnouncementMessage,
  getAnnouncementMessages,
  getAllNotices,
  deleteAllNotices,
  addNotice,
  deleteNotice,
  setNoticeAutoflow,
  getNoticeAutoflow,
  updateAllNotices,
};
