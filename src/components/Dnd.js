import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { setReservation, getReservationDetails } from '../firebase';

function Dnd({ reservations, date }) {
    const navigate = useNavigate();

    // Transforming the reservations object into an array for easier mapping
    const [pitchReservations, setPitchReservations] = useState(Object.entries(reservations).map(([pitchName, reservations]) => ({ pitchName, reservations })));

    useEffect(() => {
        setPitchReservations(Object.entries(reservations).map(([pitchName, reservations]) => ({ pitchName, reservations })));
    }, [reservations]);

    const handleReservationClick = (pitch, index) => {
        navigate('/reservationDetails', { state: { pitch, index, date } });
    };

    const updateDatabaseOnDragEnd = async (pitchA, pitchB, indexA, indexB, hourA, hourB) => {
        try {
            // Fetch reservation details for pitchA and pitchB
            const dateString = date.replaceAll('.', '-');
            const itemA = await getReservationDetails(dateString, pitchA, indexA);
            const itemB = await getReservationDetails(dateString, pitchB, indexB);

            // Check if data is available before updating reservations
            if (itemA && itemB && itemA.hour === hourA && itemB.hour === hourB) {
                // Update reservations for pitchA and pitchB
                await setReservation(dateString, pitchA, indexA, hourA, itemB.reservedUserName, itemB.reservedUserPhone, itemB.note);
                await setReservation(dateString, pitchB, indexB, hourB, itemA.reservedUserName, itemA.reservedUserPhone, itemA.note);
            }
        } catch (error) {
            // Handle errors here
            console.error('Error updating reservations:', error);
        }
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

        const sourcePitch = pitchReservations.find(pitch => pitch.pitchName === source.droppableId);
        const destinationPitch = pitchReservations.find(pitch => pitch.pitchName === destination.droppableId);

        const sourceItems = Array.from(sourcePitch.reservations);
        const destItems = destination.droppableId === source.droppableId ? sourceItems : Array.from(destinationPitch.reservations);

        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);

        const newPitchReservations = pitchReservations.map(pitch => {
            if (pitch.pitchName === source.droppableId) {
                return { ...pitch, reservations: sourceItems };
            } else if (pitch.pitchName === destination.droppableId) {
                return { ...pitch, reservations: destItems };
            }
            return pitch;
        });

        setPitchReservations(newPitchReservations);

    };

    return (
        <div className='flex flex-row gap-2 p-2 justify-between md:w-2/3 md:justify-around lg:w-2/3 lg:justify-around xl:w-1/3'>
            <DragDropContext onDragEnd={onDragEnd}>
                {pitchReservations.map((pitch, index) => (
                    <div key={`${pitch.pitchName}-${index}`}>
                        <h1 className="text-lg font-semibold text-center mb-2" key={pitch.pitchName}>{pitch.pitchName}</h1>
                        <Droppable droppableId={pitch.pitchName}>
                            {(provided) => (
                                <ul className="space-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                                    {pitch.reservations.map((item, index) => item.visible && (
                                        <li className="bg-slate-700 rounded shadow-md h-20" key={item.hour}>
                                            <Draggable key={item.hour} draggableId={item.hour} index={index}>
                                                {(provided, snapshot) => (
                                                    <a
                                                        onClick={() => handleReservationClick(pitch.pitchName, index)}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <div className='flex flex-col text-center w-28 md:w-52 p-4'>
                                                            <div className='flex flex-row justify-between'>
                                                                <p className={`text-lg flex-1 font-bold ${snapshot.isDragging ? 'text-transparent' : ''}`}>{item.hour + ':' + item.minute}</p>
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
                    </div>
                ))}
            </DragDropContext>
        </div>

    );
}

export default Dnd;