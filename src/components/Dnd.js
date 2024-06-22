import React, { useState, useEffect, useContext, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import {
  setReservation,
  getReservationDetails,
  getReservations,
} from "../firebase";
import { UserContext } from "../contexts/UserContext";
import { ReservationSchemaContext } from "../contexts/ReservationSchemaContext";
import { SendWhatsAppMessage } from "../utils/SendWhatsAppMessage";
import { DateContext } from "../contexts/DateContext";

function Dnd({ reservations, tomorrowNight }) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const schema = useContext(ReservationSchemaContext);
  const { selectedDay } = useContext(DateContext);

  // Transforming the reservations object into an array for easier mapping
  const [pitchReservations, setPitchReservations] = useState(
    Object.entries(reservations).map(([pitchName, reservations]) => ({
      pitchName,
      reservations: reservations.filter(
        (reservation) => reservation.visible === true
      ),
    }))
  );

  const [tomorrowNightReservations, setTomorrowNightReservations] = useState(
    []
  );

  useEffect(() => {
    setPitchReservations(
      Object.entries(reservations).map(([pitchName, reservations]) => ({
        pitchName,
        reservations: reservations.filter(
          (reservation) => reservation.visible === true
        ),
      }))
    );

    return () => {
      setPitchReservations([]);
    };
  }, [reservations]);

  useEffect(() => {
    if (tomorrowNight)
      setTomorrowNightReservations(
        Object.entries(tomorrowNight).map(([pitchName, reservations]) => ({
          pitchName,
          reservations: reservations.filter(
            (reservation) => reservation.visible === true
          ),
        }))
      );

    return () => {
      setTomorrowNightReservations([]);
    };
  }, [tomorrowNight]);

  const notifyCustomer = (
    minute,
    reservationDate,
    reservationHour,
    reservationPitch,
    phone
  ) => {
    const message =
      "REZERVASYON SAATİNİZ YUKARIDA PAYLAŞILAN ŞEKİLDE GÜNCELLENMİŞTİR. LÜTFEN DİKKAT EDİNİZ.";

    SendWhatsAppMessage(
      message,
      minute,
      "hourUpdate",
      reservationDate,
      reservationHour,
      reservationPitch,
      "Ön Rez.",
      phone
    );
  };

  const updateDatabaseOnDragEnd = async (
    pitchA,
    pitchB,
    hourA,
    hourB,
    dateA,
    dateB
  ) => {
    try {
      // Fetch reservation details for pitchA and pitchB
      const dateAString = dateA.replaceAll(".", "-");
      const dateBString = dateB.replaceAll(".", "-");

      const indexA = await determineDBIndexOfItem(hourA);
      const indexB = await determineDBIndexOfItem(hourB);

      const itemA = await getReservationDetails(dateAString, pitchA, indexA);
      const itemB = await getReservationDetails(dateBString, pitchB, indexB);

      // Check if data is available before updating reservations
      if (itemA && itemB && itemA.hour === hourA && itemB.hour === hourB) {
        // Update reservations for pitchA and pitchB
        if (indexA !== undefined && indexB !== undefined) {
          await setReservation(
            dateAString,
            pitchA,
            indexA,
            hourA,
            itemA.minute,
            itemB.reservedUserName,
            itemB.reservedUserPhone,
            itemB.note,
            itemB.reservationType
          );
          await setReservation(
            dateBString,
            pitchB,
            indexB,
            hourB,
            itemB.minute,
            itemA.reservedUserName,
            itemA.reservedUserPhone,
            itemA.note,
            itemA.reservationType
          );
        } else {
          alert("Rezervasyon bilgileri alınamadı. Lütfen tekrar deneyin.");
        }
      }
    } catch (error) {
      // Handle errors here
      console.error("Error updating reservations:", error);
    }
  };

  const determineSourcePitch = (source) => {
    if (source.index < pitchReservations[0].reservations.length) {
      return pitchReservations.find(
        (pitch) => pitch.pitchName === source.droppableId
      );
    } else {
      return tomorrowNightReservations.find(
        (pitch) => pitch.pitchName === source.droppableId
      );
    }
  };

  const determineDestinationPitch = (destination) => {
    if (destination.index < pitchReservations[0].reservations.length) {
      return pitchReservations.find(
        (pitch) => pitch.pitchName === destination.droppableId
      );
    } else {
      return tomorrowNightReservations.find(
        (pitch) => pitch.pitchName === destination.droppableId
      );
    }
  };

  const determineSourceIndex = (source) => {
    if (source.index < pitchReservations[0].reservations.length) {
      return source.index;
    } else {
      return source.index - pitchReservations[0].reservations.length;
    }
  };

  const determineDestinationIndex = (destination) => {
    if (destination.index < pitchReservations[0].reservations.length) {
      return destination.index;
    } else {
      return destination.index - pitchReservations[0].reservations.length;
    }
  };

  const fetchReservations = useMemo(
    () => async () => {
      const dateStr = selectedDay.replaceAll(".", "-");
      const items = await getReservations(dateStr, "Saha 1");
      return items;
    },
    [selectedDay]
  );

  const determineDBIndexOfItem = async (hour) => {
    const items = await fetchReservations();
    const index = items.findIndex((item) => item.hour === hour);
    if (index !== -1) {
      return index;
    }
  };

  const reservationsOnDragEnd = (source, destination) => {
    const sourcePitch = pitchReservations.find(
      (pitch) => pitch.pitchName === source.droppableId
    );
    const destinationPitch = pitchReservations.find(
      (pitch) => pitch.pitchName === destination.droppableId
    );

    const sourceItems = Array.from(sourcePitch.reservations);
    const destItems =
      destination.droppableId === source.droppableId
        ? sourceItems
        : Array.from(destinationPitch.reservations);

    if (source.droppableId === destination.droppableId) {
      // Drag and drop in the same list
      const [itemA] = sourceItems.slice(source.index, source.index + 1);
      const [itemB] = destItems.slice(destination.index, destination.index + 1);

      [itemA.hour, itemB.hour] = [itemB.hour, itemA.hour];
      [itemA.minute, itemB.minute] = [itemB.minute, itemA.minute];
      [itemA.date, itemB.date] = [itemB.date, itemA.date];
      if (itemA.reservationType && itemB.reservationType) {
        [itemA.reservationType, itemB.reservationType] = [
          itemB.reservationType,
          itemA.reservationType,
        ];
      }

      sourceItems.splice(source.index, 1, itemB);
      destItems.splice(destination.index, 1, itemA);
    } else {
      // Drag and drop between different lists
      const [itemA] = sourceItems.splice(source.index, 1);
      const [itemB] = destItems.splice(destination.index, 1);

      [itemA.hour, itemB.hour] = [itemB.hour, itemA.hour];
      [itemA.minute, itemB.minute] = [itemB.minute, itemA.minute];
      [itemA.date, itemB.date] = [itemB.date, itemA.date];
      if (itemA.reservationType && itemB.reservationType) {
        [itemA.reservationType, itemB.reservationType] = [
          itemB.reservationType,
          itemA.reservationType,
        ];
      }

      sourceItems.splice(source.index, 0, itemB);
      destItems.splice(destination.index, 0, itemA);
    }

    const newPitchReservations = pitchReservations.map((pitch) => {
      if (pitch.pitchName === source.droppableId) {
        return { ...pitch, reservations: sourceItems };
      } else if (pitch.pitchName === destination.droppableId) {
        return { ...pitch, reservations: destItems };
      }
      return pitch;
    });

    setPitchReservations(newPitchReservations);
    updateDatabaseOnDragEnd(
      source.droppableId,
      destination.droppableId,
      sourceItems[source.index].hour,
      destItems[destination.index].hour,
      sourceItems[source.index].date,
      destItems[destination.index].date
    );
    notifyCustomer(
      destItems[destination.index].minute,
      destItems[destination.index].date,
      destItems[destination.index].hour,
      destination.droppableId,
      destItems[destination.index].reservedUserPhone
    );
  };

  const nightReservationsOnDragEnd = (source, destination) => {
    const sourcePitch = tomorrowNightReservations.find(
      (pitch) => pitch.pitchName === source.droppableId
    );
    const destinationPitch = tomorrowNightReservations.find(
      (pitch) => pitch.pitchName === destination.droppableId
    );

    const sourceIndex = determineSourceIndex(source);
    const destinationIndex = determineDestinationIndex(destination);

    const sourceItems = Array.from(sourcePitch.reservations);
    const destItems =
      destination.droppableId === source.droppableId
        ? sourceItems
        : Array.from(destinationPitch.reservations);

    if (source.droppableId === destination.droppableId) {
      // Drag and drop in the same list
      const [itemA] = sourceItems.slice(sourceIndex, sourceIndex + 1);
      const [itemB] = destItems.slice(destinationIndex, destinationIndex + 1);

      [itemA.hour, itemB.hour] = [itemB.hour, itemA.hour];
      [itemA.minute, itemB.minute] = [itemB.minute, itemA.minute];
      [itemA.date, itemB.date] = [itemB.date, itemA.date];
      if (itemA.reservationType && itemB.reservationType) {
        [itemA.reservationType, itemB.reservationType] = [
          itemB.reservationType,
          itemA.reservationType,
        ];
      }
      sourceItems.splice(sourceIndex, 1, itemB);
      destItems.splice(destinationIndex, 1, itemA);
    } else {
      // Drag and drop between different lists
      const [itemA] = sourceItems.splice(sourceIndex, 1);
      const [itemB] = destItems.splice(destinationIndex, 1);

      [itemA.hour, itemB.hour] = [itemB.hour, itemA.hour];
      [itemA.minute, itemB.minute] = [itemB.minute, itemA.minute];
      [itemA.date, itemB.date] = [itemB.date, itemA.date];
      if (itemA.reservationType && itemB.reservationType) {
        [itemA.reservationType, itemB.reservationType] = [
          itemB.reservationType,
          itemA.reservationType,
        ];
      }

      sourceItems.splice(sourceIndex, 0, itemB);
      destItems.splice(destinationIndex, 0, itemA);
    }

    const newPitchReservations = tomorrowNightReservations.map((pitch) => {
      if (pitch.pitchName === source.droppableId) {
        return { ...pitch, reservations: sourceItems };
      } else if (pitch.pitchName === destination.droppableId) {
        return { ...pitch, reservations: destItems };
      }
      return pitch;
    });

    setTomorrowNightReservations(newPitchReservations);

    updateDatabaseOnDragEnd(
      source.droppableId,
      destination.droppableId,
      sourceItems[sourceIndex].hour,
      destItems[destinationIndex].hour,
      sourceItems[sourceIndex].date,
      destItems[destinationIndex].date
    );
    notifyCustomer(
      destItems[destination.index].minute,
      destItems[destination.index].date,
      destItems[destination.index].hour,
      destination.droppableId,
      destItems[destination.index].reservedUserPhone
    );
  };

  const crossReservationsOnDragEnd = (source, destination) => {
    // Handle drag and drop between actualReservations and nightReservations
    const sourcePitch = determineSourcePitch(source);
    const destinationPitch = determineDestinationPitch(destination);

    const sourceIndex = determineSourceIndex(source);
    const destinationIndex = determineDestinationIndex(destination);

    const sourceItems = Array.from(sourcePitch.reservations);
    const destItems = Array.from(destinationPitch.reservations);

    const [itemA] = sourceItems.splice(sourceIndex, 1); // Kaynak rezervasyonu listeden çıkarır
    const [itemB] = destItems.splice(destinationIndex, 1); // Destinasyon rezervasyonu listeden çıkarır

    // Kaynak ve destinasyon rezervasyonlarının saat, dakika ve tarih bilgilerini çaprazlar
    [itemA.hour, itemB.hour] = [itemB.hour, itemA.hour];
    [itemA.minute, itemB.minute] = [itemB.minute, itemA.minute];
    [itemA.date, itemB.date] = [itemB.date, itemA.date];
    if (itemA.reservationType && itemB.reservationType) {
      [itemA.reservationType, itemB.reservationType] = [
        itemB.reservationType,
        itemA.reservationType,
      ];
    }
    sourceItems.splice(sourceIndex, 0, itemB); // Kaynak rezervasyonunu destinasyon rezervasyonunun bulunduğu indexe ekler
    destItems.splice(destinationIndex, 0, itemA); // Destinasyon rezervasyonunu kaynak rezervasyonunun bulunduğu indexe ekler

    updateSourcePitchReservations(source, sourceItems);
    updateDestinationPitchReservations(destination, destItems);

    updateDatabaseOnDragEnd(
      source.droppableId,
      destination.droppableId,
      sourceItems[sourceIndex].hour,
      destItems[destinationIndex].hour,
      sourceItems[sourceIndex].date,
      destItems[destinationIndex].date
    );
    notifyCustomer(
      destItems[destination.index].minute,
      destItems[destination.index].date,
      destItems[destination.index].hour,
      destination.droppableId,
      destItems[destination.index].reservedUserPhone
    );
  };

  const updateSourcePitchReservations = (source, sourceItems) => {
    // Kaynak pitch'in rezervasyonlarını günceller
    const sourcePitch = determineSourcePitch(source); // Kaynak pitch'in rezervasyonlarını bulur

    if (
      // Kaynak pitch'in rezervasyon sayısı gece rezervasyonlarından fazlaysa, gün içerisindeki rezervasyonları günceller
      sourcePitch.reservations.length >
      tomorrowNightReservations[0].reservations.length
    ) {
      setPitchReservations((prevReservations) =>
        prevReservations.map((pitch) => {
          if (pitch.pitchName === source.droppableId) {
            return { ...pitch, reservations: sourceItems };
          }
          return pitch;
        })
      );
    } else {
      // Kaynak pitch'in rezervasyon sayısı gün içerisindeki rezervasyonlardan fazlaysa, gece rezervasyonlarını günceller
      setTomorrowNightReservations((prevReservations) =>
        prevReservations.map((pitch) => {
          if (pitch.pitchName === source.droppableId) {
            return { ...pitch, reservations: sourceItems };
          }
          return pitch;
        })
      );
    }
  };

  const updateDestinationPitchReservations = (destination, destItems) => {
    // Destinasyon pitch'in rezervasyonlarını günceller
    const destinationPitch = determineDestinationPitch(destination);

    if (
      destinationPitch.reservations.length >
      tomorrowNightReservations[0].reservations.length
    ) {
      setPitchReservations((prevReservations) =>
        prevReservations.map((pitch) => {
          if (pitch.pitchName === destination.droppableId) {
            return { ...pitch, reservations: destItems };
          }
          return pitch;
        })
      );
    } else {
      setTomorrowNightReservations((prevReservations) =>
        prevReservations.map((pitch) => {
          if (pitch.pitchName === destination.droppableId) {
            return { ...pitch, reservations: destItems };
          }
          return pitch;
        })
      );
    }
  };

  const onDragEnd = (result) => {
    if (!window.confirm("Rezervasyonu taşımak istediğinize emin misiniz?"))
      // Rezervasyonu kabul etmezse taşıma işlemi gerçekleşmez
      return;
    const { source, destination } = result;

    if (
      // Destinasyon yoksa, kaynak ve destinasyon aynıysa, kaynak ve destinasyon indexleri aynıysa taşıma işlemi gerçekleşmez
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return;

    const isSourceActual = // Kaynak indexi pitchReservations[0].reservations.length'den küçükse gün içerisindeki rezervasyondur
      source.index < pitchReservations[0].reservations.length;
    const isDestinationActual = // Destinasyon indexi pitchReservations[0].reservations.length'den küçükse gün içerisindeki rezervasyondur
      destination.index < pitchReservations[0].reservations.length;

    if (isSourceActual && isDestinationActual) {
      // Gün içerisindeki rezervasyonlar kaydırılıyorsa
      reservationsOnDragEnd(source, destination);
    } else if (!isSourceActual && !isDestinationActual) {
      // Gece rezervasyonları kaydırılıyorsa
      nightReservationsOnDragEnd(source, destination);
    } else {
      // Gün içerisindeki rezervasyonlar gece rezervasyonlarına, gece rezervasyonları gün içerisindeki rezervasyonlara kaydırılıyorsa
      crossReservationsOnDragEnd(source, destination);
    }
  };

  const handleWidth = () => {
    if (pitchReservations.length === 1) {
      return "w-80";
    } else if (pitchReservations.length === 2) {
      return "w-40";
    } else {
      return "w-28";
    }
  };
  const showReservedOrNot = (item) => {
    if (user.type === "admin") {
      return item.reservedUserName;
    } else if (user.type !== "admin" && item.reservedUserName !== "") {
      return "Rezerve";
    } else if (user.type !== "admin" && item.reservedUserName === "") {
      return "Boş";
    }
  };

  const handleReservationClick = async (pitch, item) => {
    const isReserved = item.reservedUserName !== "";
    const date = item.date;
    const type = item.reservationType;
    const index = await determineDBIndexOfItem(item.hour);
    if (user.type === "admin") {
      if (isReserved) {
        navigate("/reservationDetails", {
          state: { pitch, item, index, date },
        });
      } else {
        navigate("/chooseCustomer", { state: { pitch, index, date } });
      }
    } else if (user.type !== "admin" && !isReserved) {
      navigate("/reservationForm", { state: { pitch, index, date } });
    }
  };

  const handleBackground = (item) => {
    if (item.subscribers && item.subscribers.length > 0) return "bg-sky-600";
    if (item.reservationType === "Ön Rez.") return "bg-yellow-600";
    if (item.reservationType === "Kesin Rez.") return "bg-green-600";
    return "bg-slate-700";
  };

  return (
    <div className="flex flex-row gap-2  justify-around w-full px-5 sm:px-10">
      <DragDropContext onDragEnd={onDragEnd}>
        {pitchReservations.map((pitch, index) => (
          <div
            key={`${pitch.pitchName}-${index}`}
            className="flex-1"
            style={{ minWidth: "50%" }}
          >
            <Droppable droppableId={pitch.pitchName}>
              {(provided) => (
                <ul
                  className="space-y-1 w-full"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {pitch.reservations.map(
                    (item, index) =>
                      item.visible && (
                        <li
                          className={`${handleBackground(
                            item
                          )} rounded shadow-md h-20`}
                          key={item.hour}
                        >
                          <Draggable
                            key={"today-" + pitch.pitchName + "-" + item.hour}
                            draggableId={
                              "today-" + pitch.pitchName + "-" + item.hour
                            }
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <a
                                onClick={() =>
                                  handleReservationClick(pitch.pitchName, item)
                                }
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div
                                  className={`flex flex-col text-center  py-2 px-2`}
                                >
                                  <div className="flex flex-row justify-between align-baseline items-baseline">
                                    <p
                                      className={`mr-1 text-lg text-left font-bold ${
                                        snapshot.isDragging
                                          ? "text-transparent"
                                          : ""
                                      }`}
                                    >
                                      {item.hour + ":" + item.minute}
                                    </p>
                                    <p className="text-sm flex-1 font-semibold truncate text-left md:text-right md:text-base xl:text-lg">
                                      {showReservedOrNot(item)}
                                    </p>
                                  </div>
                                  <p className="text-lg font-semibold h-10 truncate pt-1">
                                    {user.type === "admin" ? item.note : ""}
                                  </p>
                                </div>
                              </a>
                            )}
                          </Draggable>
                        </li>
                      )
                  )}
                  {/* If there is tomorrow night reservations, map them by pitch name */}
                  {tomorrowNight &&
                    tomorrowNightReservations[index]?.reservations.map(
                      (item, index) =>
                        item.visible && (
                          <li
                            className="bg-slate-700 rounded shadow-md h-20"
                            key={item.hour}
                          >
                            <Draggable
                              key={
                                "tomorrow-" + pitch.pitchName + "-" + item.hour
                              }
                              draggableId={
                                "tomorrow-" + pitch.pitchName + "-" + item.hour
                              }
                              index={
                                index +
                                pitchReservations[0]?.reservations?.length
                              }
                            >
                              {(provided, snapshot) => (
                                <a
                                  onClick={() =>
                                    handleReservationClick(
                                      pitch.pitchName,
                                      item
                                    )
                                  }
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div
                                    className={`flex flex-col text-center md:w-52 py-2 px-2 ${handleWidth()}`}
                                  >
                                    <div className="flex flex-row justify-between align-baseline items-baseline">
                                      <p
                                        className={`mr-2 text-lg text-left font-bold ${
                                          snapshot.isDragging
                                            ? "text-transparent"
                                            : ""
                                        }`}
                                      >
                                        {item.hour + ":" + item.minute}
                                      </p>
                                      <p className="text-sm flex-1 font-semibold truncate">
                                        {showReservedOrNot(item)}
                                      </p>
                                    </div>
                                    <p className="text-lg font-semibold h-10 truncate pt-1">
                                      {user.type === "admin" ? item.note : ""}
                                    </p>
                                  </div>
                                </a>
                              )}
                            </Draggable>
                          </li>
                        )
                    )}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}

export default Dnd;
