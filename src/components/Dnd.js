import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'


function Dnd(props) {
    var source, destination, start, end, startPitchList, endPitchList;


    function getReservationsData(list) {
        const reservationsData = [];

        for (const timeKey in list) {
            const hour = timeKey;
            const { name, note } = list[timeKey];
            reservationsData.push({ hour, name, note });
        }

        return reservationsData;
    }

    const initialReservations = {
        firstPitch: {
            id: 'firstPitch',
            list: {
                16.00: { name: 'qwe', note: '' },
                17.00: { name: 'asd', note: '' },
                18.00: { name: '', note: '' },
                19.00: { name: '', note: '' },
                20.00: { name: '', note: '' },
                21.00: { name: '', note: '' },
                22.00: { name: '', note: '' },
                23.00: { name: '', note: '' },
                24.00: { name: '', note: '' }
            }
        },
        secondPitch: {
            id: 'secondPitch',
            list: {
                16.15: { name: '', note: '' },
                17.15: { name: '', note: '' },
                18.15: { name: '', note: '' },
                19.15: { name: '', note: '' },
                20.15: { name: '', note: '' },
                21.15: { name: '', note: '' },
                22.15: { name: '', note: '' },
                23.15: { name: '', note: '' },
                24.15: { name: '', note: '' }
            }
        }
    };


    const firstPitchReservations = getReservationsData(initialReservations.firstPitch.list);
    const secondPitchReservations = getReservationsData(initialReservations.secondPitch.list);



    const [firstPitchReservationData, setFirstPitchReservationData] = useState(firstPitchReservations);
    const [secondPitchReservationData, setSecondPitchReservationData] = useState(secondPitchReservations);



    const onDragEnd = (result) => {
        destination = result.destination;
        source = result.source;

        console.log('source:', source, 'destination:', destination);


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

            const [reorderedItem] = updatedStartPitch.splice(source.index, 1);
            updatedStartPitch.splice(destination.index, 0, reorderedItem);

        } else {
            const [startItem] = updatedStartPitch.splice(source.index, 1);
            const [endItem] = updatedEndPitch.splice(destination.index, 1);


            updatedStartPitch.splice(source.index, 0, endItem);
            updatedEndPitch.splice(destination.index, 0, startItem);
        }


        if (start === 'firstPitch') {
            let hour = 16;
            for (let i = 0; i < updatedStartPitch.length; i++) {
                updatedStartPitch[i].hour = hour + '.00';
                hour++;
            }
            hour = 16;
            for (let i = 0; i < updatedEndPitch.length; i++) {
                updatedEndPitch[i].hour = hour + '.15';
                hour++;
            }

            setFirstPitchReservationData(updatedStartPitch);
            setSecondPitchReservationData(updatedEndPitch);
        } else {
            let hour = 16;
            for (let i = 0; i < updatedStartPitch.length; i++) {
                updatedStartPitch[i].hour = hour + '.15';
                hour++;
            }
            hour = 16;
            for (let i = 0; i < updatedEndPitch.length; i++) {
                updatedEndPitch[i].hour = hour + '.00';
                hour++;
            }

            setFirstPitchReservationData(updatedEndPitch);
            setSecondPitchReservationData(updatedStartPitch);
        }

        console.log('firstPitch', firstPitchReservationData, 'secondPitch', secondPitchReservationData);
    };

    return (
        <div className='flex flex-row justify-around items-center '>
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

                                    <Draggable key={item.hour} draggableId={item.hour} index={index}>
                                        {(provided) => (

                                            <a ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}>
                                                <div className='flex flex-col text-center w-48 md:w-96 p-4 '>
                                                    <div className='flex flex-row justify-between'>
                                                        <p className="text-md">{item.hour} </p>
                                                        <p className="text-md  truncate">{item.name}</p>
                                                    </div>

                                                    <p className="text-sm  flex-1 truncate">Lorem, ipsum.</p>
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
                                        {(provided) => (

                                            <a
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}>
                                                <div className='flex flex-col text-center w-48 md:w-96 p-4'>
                                                    <div className='flex flex-row justify-between'>
                                                        <p className="text-md">{item.hour} </p>
                                                        <p className="text-md  truncate">{item.name}</p>
                                                    </div>

                                                    <p className="text-sm  flex-1 truncate">Lorem, ipsum.</p>
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