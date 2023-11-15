import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { setReservationSchema, getReservationSchema } from '../firebase';
import Navbar from './Navbar';

function ReservationSchema() {

    const [schema, setSchema] = useState(
        [
            { hour: '00', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '01', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '02', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '03', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '04', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '05', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '06', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '07', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '08', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '09', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '10', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '11', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '12', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '13', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '14', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '15', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '16', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '17', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '18', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '19', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '20', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '21', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '22', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },
            { hour: '23', reservedUserName: '', reservedUserPhone: '', note: '', visible: true },

        ]
    );


    useEffect(() => {
        // Define the callback function
        const handleReservationSchema = (data) => {
            console.log(data)
            if (data) {
                setSchema(data.firstPitch);
            } else {
                setReservationSchema({ firstPitch: schema, secondPitch: schema })
            }

        };

        // Call getReservationSchema with the callback function
        getReservationSchema(handleReservationSchema);
    }, []);


    const updateVisible = (hour) => {
        console.log(hour)
        // Find the index of the item
        const index = schema.findIndex((item) => item.hour === hour);
        // Copy the schema
        const schemaCopy = [...schema];
        // Update the visible property
        schemaCopy[index].visible = !schemaCopy[index].visible;
        // Set the schema
        setSchema(schemaCopy);
    }

    const onDragEnd = (result) => {

        const { source, destination } = result;
        if (!destination) {
            return;
        }

        const items = schema;
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);

        setSchema(items);
    }

    const handleSave = () => {
        // Call setSchema with the current state
        setReservationSchema({ firstPitch: schema, secondPitch: schema })
    };

    const handleReset = () => {
        // List the schema to by hour
        const schemaByHour = schema.map((item) => {
            return {
                hour: item.hour,
                reservedUserName: '',
                reservedUserPhone: '',
                note: '',
                visible: true
            }
        });
        // Sort the schema by hour
        schemaByHour.sort((a, b) => a.hour.localeCompare(b.hour));
        // Set the schema
        setSchema(schemaByHour);

    }


    const saveButton = <button className='btn btn-ghost normal-case text-xl xl:text-3xl' onClick={handleSave}>💾</button>
    return (
        <div className='flex flex-col items-center'>
            <Navbar endButton={saveButton}></Navbar>
            <div className='flex flex-row justify-around w-96 mt-5'>
                <button className='btn btn-square px-10 mb-10 normal-case text-xl xl:text-3xl' onClick={handleReset}>Sıfırla</button>
            </div>
            <div className='flex flex-row mb-10 items-center md:w-2/3 md:justify-around lg:w-2/3 lg:justify-around xl:w-1/3'>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId='firstPitch'>
                        {(provided) => (
                            <ul className="space-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                                {schema.map((item, index) => (

                                    <Draggable key={item.hour} draggableId={item.hour} index={index}>
                                        {(provided) => (
                                            <li className="bg-slate-700 rounded shadow-md " key={item.hour}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}>
                                                <div className='flex flex-col w-56 md:w-52 p-4'>
                                                    <p className={`text-lg flex-1 font-bold`}>{item.hour}</p>
                                                    <button className='flex-1  w-10 self-center'>
                                                        {item.visible ?
                                                            <FontAwesomeIcon onClick={() => updateVisible(item.hour)} icon={faEye} size='xl' />
                                                            :
                                                            <FontAwesomeIcon onClick={() => updateVisible(item.hour)} icon={faEyeSlash} size='xl' />
                                                        }
                                                    </button>
                                                </div>
                                            </li>
                                        )}
                                    </Draggable>

                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>

                </DragDropContext>
            </div>
        </div>
    )
}

export default ReservationSchema