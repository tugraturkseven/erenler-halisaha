import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { removeUser } from '../firebase'


function Table({ data }) {

    const navigate = useNavigate();

    const handleEdit = (user) => {
        navigate('/costumerdetails', { state: { user } })
    }

    const handleDelete = (user) => {
        removeUser(user.id).then(() => {
            alert('Müşteri silindi');
        }).catch((error) => {
            alert('Müşteri silinemedi', error);
        }
        );
    }


    const renderTableData = () => {

        return data.map((user, index) => {
            const { id, name, phone } = user //destructuring
            return (
                <tr key={id}>
                    <th>{index + 1}</th>
                    <td>{name}</td>
                    <td>{phone}</td>
                    <td>
                        <div className='flex flex-row '>
                            <button className="btn btn-primary mr-5" onClick={() => handleEdit(user)}>
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button className="btn btn-secondary" onClick={() => handleDelete(user)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>

                    </td>
                </tr>
            )
        })
    }

    return (
        <div className="overflow-x-auto">
            <table className="table ">
                {/* head */}
                <thead>
                    <tr>
                        <th></th>
                        <th>Isim</th>
                        <th>Telefon</th>
                        <th>Duzenle</th>
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