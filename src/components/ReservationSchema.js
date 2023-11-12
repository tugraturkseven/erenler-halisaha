import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { setReservationSchema } from '../firebase';
import Navbar from './Navbar';

function ReservationSchema() {

    const [schema, setSchema] = useState({
        firstPitch: [
            { hour: '00', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '01', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '02', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '03', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '04', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '05', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '06', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '07', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '08', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '09', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '10', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '11', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '12', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '13', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '14', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '15', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '16', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '17', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '18', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '19', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '20', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '21', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '22', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '23', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },

        ],
        secondPitch: [
            { hour: '00', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '01', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '02', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '03', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '04', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '05', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '06', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '07', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '08', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '09', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '10', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '11', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '12', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '13', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '14', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '15', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '16', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '17', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '18', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '19', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '20', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '21', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '22', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
            { hour: '23', reservedUserName: '', reservedUserPhone: '', note: '', request: '', visible: true },
        ]
    });

    const updateVisible = (pitch, hour, visible) => {
        const items = schema[pitch];
        const item = items.find(item => item.hour === hour);
        item.visible = !visible;
        const newSchema = {
            ...schema,
            [pitch]: items
        };
        setSchema(newSchema);
    }

    const onDragEnd = (result) => {

        const { source, destination } = result;
        if (!destination) {
            return;
        }
        const start = source.droppableId;
        const end = destination.droppableId;

        if (start === end) {

            const items = schema[start];
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);

            const newSchema = {
                ...schema,
                [start]: items
            };

            setSchema(newSchema);
        } else {
            alert('Sadece aynı saha içinde sürükle bırak yapabilirsiniz.')
        }

    }

    const handleSave = () => {
        // Call setSchema with the current state
        setReservationSchema(schema)
    };

    const saveButton = <button className='btn btn-ghost normal-case text-xl xl:text-3xl' onClick={handleSave}>💾</button>
    return (
        <div className='flex flex-col items-center'>
            <Navbar endButton={saveButton}></Navbar>
            <div className='flex flex-row justify-around w-96 mt-5'>
                <p>🏟️ Saha 1</p>
                <p>🏟️ Saha 2</p>
            </div>
            <div className='flex flex-row w-96 p-5 justify-between items-center md:w-2/3 md:justify-around lg:w-2/3 lg:justify-around xl:w-1/3'>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId='firstPitch'>
                        {(provided) => (
                            <ul className="space-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                                {schema.firstPitch.map((item, index) => (
                                    <li className="bg-slate-700 rounded shadow-md h-20" key={item.hour + ':00'}>
                                        <Draggable key={item.hour + ':00'} draggableId={item.hour + ':00'} index={index}>
                                            {(provided) => (
                                                <a
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <div className='flex flex-col w-40 md:w-52 p-4'>
                                                        <p className={`text-lg flex-1 font-bold`}>{item.hour + ':00'}</p>
                                                        <button className='flex-1'>
                                                            {item.visible ?
                                                                <FontAwesomeIcon onClick={() => updateVisible('firstPitch', item.hour, item.visible)} icon={faEye} size='xl' />
                                                                :
                                                                <FontAwesomeIcon onClick={() => updateVisible('firstPitch', item.hour, item.visible)} icon={faEyeSlash} size='xl' />
                                                            }
                                                        </button>
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
                                {schema.secondPitch.map((item, index) => (
                                    <li className="bg-slate-700 rounded shadow-md h-20" key={item.hour + ':15'}>
                                        <Draggable key={item.hour + ':15'} draggableId={item.hour + ':15'} index={index}>
                                            {(provided) => (
                                                <a

                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <div className='flex flex-col w-40 md:w-52 p-4'>
                                                        <p className={`text-lg flex-1 font-bold`}>{item.hour + ':15'}</p>
                                                        <button className='flex-1'>
                                                            {item.visible ?
                                                                <FontAwesomeIcon onClick={() => updateVisible('secondPitch', item.hour, item.visible)} icon={faEye} size='xl' />
                                                                :
                                                                <FontAwesomeIcon onClick={() => updateVisible('secondPitch', item.hour, item.visible)} icon={faEyeSlash} size='xl' />
                                                            }
                                                        </button>
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
        </div>
    )
}

export default ReservationSchema