import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { setReservation, getReservationDetails } from '../firebase';



function Dnd({ reservations, date }) {

    let source, destination, start, end, startPitchList, endPitchList;

    const [firstPitchReservationData, setFirstPitchReservationData] = useState(reservations.firstPitch);
    const [secondPitchReservationData, setSecondPitchReservationData] = useState(reservations.secondPitch);

    const navigate = useNavigate();

    const handleReservationClick = (pitch, index) => {
        navigate('/reservationDetails', { state: { pitch, index, date } });
    };





    const updateDatabaseOnDragEnd = async (pitchA, pitchB, indexA, indexB, hourA, hourB) => {
        try {
            // Fetch reservation details for pitchA and pitchB
            const itemA = await getReservationDetails(date, pitchA, indexA);
            const itemB = await getReservationDetails(date, pitchB, indexB);

            // Check if data is available before updating reservations
            if (itemA && itemB && itemA.hour === hourA && itemB.hour === hourB) {
                // Update reservations for pitchA and pitchB
                await setReservation(date, pitchA, indexA, itemB.reservedUserName, itemB.reservedUserPhone, 'approved', itemB.note);
                await setReservation(date, pitchB, indexB, itemA.reservedUserName, itemA.reservedUserPhone, 'approved', itemA.note);
            }
        } catch (error) {
            // Handle errors here
            console.error('Error updating reservations:', error);
        }
    };


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
            setFirstPitchReservationData(updatedStartPitch);
            setSecondPitchReservationData(updatedEndPitch);
        } else {
            setFirstPitchReservationData(updatedEndPitch);
            setSecondPitchReservationData(updatedStartPitch);
        }

        updateDatabaseOnDragEnd(start, end, updatedStartPitch[source.index].hour, updatedEndPitch[destination.index].hour);

    };

    return (
        <div className='flex flex-row w-96 p-5 justify-between md:w-2/3 md:justify-around lg:w-2/3 lg:justify-around xl:w-1/3'>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='firstPitch'>
                    {(provided) => (
                        <ul className="space-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                            {firstPitchReservationData.map((item, index) => (
                                <li className="bg-slate-700 rounded shadow-md h-20" key={item.hour + ':00'}>
                                    <Draggable key={item.hour + ':00'} draggableId={item.hour + ':00'} index={index}>
                                        {(provided, snapshot) => (
                                            <a
                                                onClick={() => handleReservationClick('firstPitch', index)}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <div className='flex flex-col text-center w-40 md:w-52 p-4'>
                                                    <div className='flex flex-row justify-between'>
                                                        <p className={`text-lg flex-1 font-bold ${snapshot.isDragging ? 'text-transparent' : ''}`}>{item.hour + ':00'}</p>
                                                        <p className="text-sm flex-1 font-semibold truncate">{item.note}</p>
                                                    </div>
                                                    <p className="text-lg font-bold truncate">{item.reservedUserName}</p>
                                                </div>
                                            </a>
                                        )}
                                    </Draggable>
                                </li>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
                <Droppable droppableId='secondPitch'>
                    {(provided) => (
                        <ul className="space-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                            {secondPitchReservationData.map((item, index) => (
                                <li className="bg-slate-700 rounded shadow-md h-20" key={item.hour + ':15'}>
                                    <Draggable key={item.hour + ':15'} draggableId={item.hour + ':15'} index={index}>
                                        {(provided, snapshot) => (
                                            <a
                                                onClick={() => handleReservationClick('secondPitch', index)}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <div className='flex flex-col text-center w-40 md:w-52 p-4'>
                                                    <div className='flex flex-row justify-between'>
                                                        <p className={`text-lg flex-1 font-bold ${snapshot.isDragging ? 'text-transparent' : ''}`}>{item.hour + ':15'}</p>
                                                        <p className="text-sm flex-1 font-semibold truncate">{item.note}</p>
                                                    </div>
                                                    <p className="text-lg font-bold truncate">{item.reservedUserName}</p>
                                                </div>
                                            </a>
                                        )}
                                    </Draggable>
                                </li>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default Dnd;
