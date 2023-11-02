import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useNavigate } from 'react-router-dom';

function Dnd({ reservations, date }) {
    var source, destination, start, end, startPitchList, endPitchList;

    function reservationDataToArray(list, pitchName) { // Turns the object in to an array 
        const reservationsData = [];
        let hourIndex = 16;
        for (const key in list) {
            const hour = pitchName == 'firstPitch' ? hourIndex + ':00' : hourIndex + ':30';
            hourIndex++;
            const { note, reservedUserName } = list[key];
            reservationsData.push({ hour, note, reservedUserName });
        }

        return reservationsData;
    }



    const firstPitchReservations = reservationDataToArray(reservations.firstPitch, 'firstPitch'); // turning the object into an array
    const secondPitchReservations = reservationDataToArray(reservations.secondPitch, 'secondPitch'); // turning the object into an array
    const [firstPitchReservationData, setFirstPitchReservationData] = useState(firstPitchReservations); // state for the first pitch
    const [secondPitchReservationData, setSecondPitchReservationData] = useState(secondPitchReservations); // state for the second pitch

    const navigate = useNavigate();

    const handleReservationClick = (pitch, hour) => {

        navigate('/reservationDetails', { state: { pitch, hour, date } });
    }


    const onDragEnd = (result) => {
        destination = result.destination;
        source = result.source;


        if (!destination) return; // If the item is dropped outside the list, do nothing

        start = source.droppableId; // get the id of the start pitch
        end = destination.droppableId; // get the id of the end pitch

        if (start === 'firstPitch') {
            startPitchList = firstPitchReservationData
            endPitchList = secondPitchReservationData
        } else {
            startPitchList = secondPitchReservationData
            endPitchList = firstPitchReservationData
        }


        // Initialize updatedStartPitch and updatedEndPitch as empty arrays
        let updatedStartPitch = [...startPitchList];
        let updatedEndPitch = [...endPitchList];

        if (start === end) {
            const [startItem] = updatedStartPitch.slice(source.index, source.index + 1);
            const [endItem] = updatedStartPitch.slice(destination.index, destination.index + 1);

            updatedStartPitch.splice(source.index, 1, endItem);
            updatedStartPitch.splice(destination.index, 1, startItem);

        } else {
            const [startItem] = updatedStartPitch.splice(source.index, 1);
            const [endItem] = updatedEndPitch.splice(destination.index, 1);


            updatedStartPitch.splice(source.index, 0, endItem);
            updatedEndPitch.splice(destination.index, 0, startItem);
        }

        if (start === 'firstPitch') {
            setFirstPitchReservationData(reservationDataToArray(updatedStartPitch, 'firstPitch'));
            setSecondPitchReservationData(reservationDataToArray(updatedEndPitch, 'secondPitch'));
        } else {
            setFirstPitchReservationData(reservationDataToArray(updatedEndPitch, 'firstPitch'));
            setSecondPitchReservationData(reservationDataToArray(updatedStartPitch, 'secondPitch'));
        }



    };

    return (
        <div className='flex flex-row  w-96 p-5 justify-between md:w-2/3 md:justify-around lg:w-2/3 lg:justify-around xl:w-1/3 '>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='firstPitch'>
                    {(provided) => (
                        <ul
                            className="space-y-4" // Apply Tailwind CSS spacing
                            {...provided.droppableProps}
                            ref={provided.innerRef}

                        >
                            {firstPitchReservationData.map((item, index) => (
                                <li
                                    className=" bg-slate-700 rounded shadow-md h-20" // Apply Tailwind CSS styling
                                    key={item.hour}
                                >

                                    <Draggable key={item.hour} draggableId={item.hour} index={index} >
                                        {(provided, snapshot) => (

                                            <a onClick={() => handleReservationClick('firstPitch', item.hour)}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}>
                                                <div className='flex flex-col text-center w-40 md:w-52 p-4 '>
                                                    <div className='flex flex-row justify-between'>
                                                        <p className={`text-lg flex-1 font-bold ${snapshot.isDragging ? 'text-transparent' : ''}`}>{item.hour} </p>
                                                        <p className="text-sm flex-1 font-semibold truncate">{item.note}</p>
                                                    </div>
                                                    <p className="text-lg font-bold truncate">{item.reservedUserName}</p>

                                                </div>
                                            </a>


                                        )}
                                    </Draggable>
                                </li>
                            ))}
                        </ul>
                    )}
                </Droppable>
                <Droppable droppableId='secondPitch'>
                    {(provided) => (
                        <ul
                            className="space-y-4" // Apply Tailwind CSS spacing
                            {...provided.droppableProps}
                            ref={provided.innerRef}

                        >
                            {secondPitchReservationData.map((item, index) => (
                                <li
                                    className=" bg-slate-700 rounded shadow-md h-20" // Apply Tailwind CSS styling

                                >
                                    <Draggable key={item.hour} draggableId={item.hour} index={index}>
                                        {(provided, snapshot) => (

                                            <a onClick={() => handleReservationClick('firstPitch', item.hour)}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}>
                                                <div className='flex flex-col text-center w-40 md:w-52 p-4 '>
                                                    <div className='flex flex-row justify-between'>
                                                        <p className={`text-lg flex-1 font-bold ${snapshot.isDragging ? 'text-transparent' : ''}`}>{item.hour} </p>
                                                        <p className="text-sm flex-1 font-semibold truncate">{item.note}</p>
                                                    </div>
                                                    <p className="text-md font-bold truncate">{item.reservedUserName}</p>

                                                </div>
                                            </a>


                                        )}
                                    </Draggable>
                                </li>
                            ))}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>

        </div>
    );
}

export default Dnd