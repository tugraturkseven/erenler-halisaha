import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'



function Table({ data, type, headings, handleDelete, handleEdit }) {

    const navigate = useNavigate();

    const renderTableData = () => {
        if (type === 'customers') {
            return data.map((user, index) => {
                const { id, name, phone } = user //destructuring
                return (
                    <tr key={id}>
                        <th>{index + 1}</th>
                        <td>{name}</td>
                        <td>{phone}</td>
                        <td>
                            <div className='flex flex-row '>
                                <button className="btn btn-info mr-5" onClick={() => handleEdit(user)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                            </div>
                        </td>
                    </tr>
                )
            })
        } else {
            return data.map((pitch, index) => {
                return (
                    <tr key={pitch.id}>
                        <th className='text-center'>{index + 1}</th>
                        <td className='text-center font-semibold'>{pitch.name}</td>
                        <td className='text-center font-semibold'>{pitch.minute}</td>
                        <td >
                            <div className='flex flex-row '>
                                <button className="btn btn-accent mr-5" onClick={() => handleEdit(pitch)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button className="btn btn-error" onClick={() => handleDelete(pitch)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </td>
                    </tr>
                )
            });
        }

    }


    return (
        <div className="">
            <table className="table ">
                {/* head */}
                <thead>
                    <tr>
                        <th></th>
                        <th>{headings.first}</th>
                        <th>{headings.second}</th>
                        <th>⚙️ Duzenle</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableData()}
                </tbody>
            </table>
        </div>
    )
}

export default Table