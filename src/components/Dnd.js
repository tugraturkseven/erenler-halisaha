import React, { useState, useEffect, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { setReservation, getReservationDetails } from '../firebase';
import { UserContext } from '../contexts/UserContext';
function Dnd({ reservations, date }) {
    const navigate = useNavigate();
    const user = useContext(UserContext);

    // Transforming the reservations object into an array for easier mapping
    const [pitchReservations, setPitchReservations] = useState(Object.entries(reservations).map(([pitchName, reservations]) => ({ pitchName, reservations })));

    useEffect(() => {
        setPitchReservations(Object.entries(reservations).map(([pitchName, reservations]) => ({ pitchName, reservations })));
    }, [reservations]);



    const updateDatabaseOnDragEnd = async (pitchA, pitchB, indexA, indexB, hourA, hourB) => {
        try {
            // Fetch reservation details for pitchA and pitchB
            const dateString = date.replaceAll('.', '-');
            const itemA = await getReservationDetails(dateString, pitchA, indexA);
            const itemB = await getReservationDetails(dateString, pitchB, indexB);

            // Check if data is available before updating reservations
            if (itemA && itemB && itemA.hour === hourA && itemB.hour === hourB) {
                // Update reservations for pitchA and pitchB
                await setReservation(dateString, pitchA, indexA, hourA, itemA.minute, itemB.reservedUserName, itemB.reservedUserPhone, itemB.note);
                await setReservation(dateString, pitchB, indexB, hourB, itemB.minute, itemA.reservedUserName, itemA.reservedUserPhone, itemA.note);
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



        if (source.droppableId === destination.droppableId) {
            // Drag and drop in the same list
            const [itemA] = sourceItems.slice(source.index, source.index + 1);
            const [itemB] = destItems.slice(destination.index, destination.index + 1);

            [itemA.hour, itemB.hour] = [itemB.hour, itemA.hour];
            [itemA.minute, itemB.minute] = [itemB.minute, itemA.minute];

            sourceItems.splice(source.index, 1, itemB);
            destItems.splice(destination.index, 1, itemA);

        } else {
            // Drag and drop between different lists
            const [itemA] = sourceItems.splice(source.index, 1);
            const [itemB] = destItems.splice(destination.index, 1);

            [itemA.hour, itemB.hour] = [itemB.hour, itemA.hour];
            [itemA.minute, itemB.minute] = [itemB.minute, itemA.minute];

            sourceItems.splice(source.index, 0, itemB);
            destItems.splice(destination.index, 0, itemA);
        }

        const newPitchReservations = pitchReservations.map(pitch => {
            if (pitch.pitchName === source.droppableId) {
                return { ...pitch, reservations: sourceItems };
            } else if (pitch.pitchName === destination.droppableId) {
                return { ...pitch, reservations: destItems };
            }
            return pitch;
        });

        setPitchReservations(newPitchReservations);
        updateDatabaseOnDragEnd(source.droppableId, destination.droppableId, source.index, destination.index, sourceItems[source.index].hour, destItems[destination.index].hour);
    };


    const handleWidth = () => {
        if (pitchReservations.length === 1) {
            return 'w-80';
        } else if (pitchReservations.length === 2) {
            return 'w-40';
        } else {
            return 'w-28';
        }
    }
    const showReservedOrNot = (item) => {
        if (user.type === 'admin') {
            return item.reservedUserName;
        } else if (user.type !== 'admin' && item.reservedUserName !== '') {
            return 'Rezerve';
        } else if (user.type !== 'admin' && item.reservedUserName === '') {
            return 'Boş';
        }
    }

    const handleReservationClick = (pitch, index, item) => {
        const isReserved = item.reservedUserName !== '';
        if (user.type === 'admin') {
            navigate('/reservationDetails', { state: { pitch, index, date } });
        } else if (user.type !== 'admin' && !isReserved) {
            navigate('/reservationForm', { state: { pitch, index, date } });
        }

    };

    return (
        <div className='flex flex-row gap-2 p-2 justify-between md:w-2/3 md:justify-around lg:w-2/3 lg:justify-around xl:w-1/3'>
            <DragDropContext onDragEnd={onDragEnd}>
                {pitchReservations.map((pitch, index) => (
                    <div key={`${pitch.pitchName}-${index}`}>

                        <Droppable droppableId={pitch.pitchName}>
                            {(provided) => (
                                <ul className="space-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                                    {pitch.reservations.map((item, index) => item.visible && (
                                        <li className="bg-slate-700 rounded shadow-md h-20" key={item.hour}>
                                            <Draggable key={pitch.pitchName + '-' + item.hour} draggableId={pitch.pitchName + '-' + item.hour} index={index}>
                                                {(provided, snapshot) => (
                                                    <a
                                                        onClick={() => handleReservationClick(pitch.pitchName, index, item)}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <div className={`flex flex-col text-center md:w-52 p-4 ${handleWidth()}`}>
                                                            <div className='flex flex-row justify-between'>
                                                                <p className={`text-lg flex-1 font-bold ${snapshot.isDragging ? 'text-transparent' : ''}`}>{item.hour + ':' + item.minute}</p>
                                                                <p className="text-sm flex-1 font-semibold truncate">{user.type === 'admin' ? item.note : ''}</p>
                                                            </div>
                                                            <p className="text-lg font-bold truncate">{showReservedOrNot(item)}</p>
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