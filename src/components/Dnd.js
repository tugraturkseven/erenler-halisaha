import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const initialData = [
    { id: '1', hour: '10:00 AM', name: 'John', surname: 'Doe', customerType: 'Regular' },
    { id: '2', hour: '11:00 AM', name: 'Jane', surname: 'Smith', customerType: 'VIP' },
    { id: '3', hour: '12:00 PM', name: 'John', surname: 'Doe', customerType: 'Regular' },
    { id: '4', hour: '13:00 PM', name: 'Jane', surname: 'Smith', customerType: 'VIP' },
    { id: '5', hour: '14:00 PM', name: 'John', surname: 'Doe', customerType: 'Regular' },
    { id: '6', hour: '15:00 PM', name: 'Jane', surname: 'Smith', customerType: 'VIP' },
    { id: '7', hour: '16:00 PM', name: 'John', surname: 'Doe', customerType: 'Regular' },
    { id: '8', hour: '17:00 PM', name: 'Jane', surname: 'Smith', customerType: 'VIP' },
    // Add more reservation data
];

function Dnd() {
    const [data, setData] = useState(initialData);


    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = [...data];
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        items.forEach((item, index) => {
            item.position = index + 1;
            item.hour = `${16 + (item.position - 1)}:00`;
        });



        setData(items);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="reservations">
                {(provided) => (
                    <ul
                        className="space-y-4" // Apply Tailwind CSS spacing
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {data.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                    <li
                                        className="p-4 bg-slate-700 rounded shadow-md" // Apply Tailwind CSS styling
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <a >
                                            <div className='flex flex-row text-center w-72  md:w-96'>
                                                <p className="text-lg font-bold flex-1"> {item.hour}</p>
                                                <p className="text-lg font-semibold flex-1">{item.name + ' ' + item.surname}</p>
                                                <p className="text-lg font-semibold flex-1">{item.customerType}</p>
                                            </div>
                                        </a>

                                    </li>
                                )}
                            </Draggable>
                        ))}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default Dnd