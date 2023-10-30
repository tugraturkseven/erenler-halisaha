import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

function Table() {
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
                    {/* row 1 */}
                    <tr>
                        <th>1</th>
                        <td>Ali Veli</td>
                        <td>5555555555</td>
                        <td>
                            <div className='flex flex-row '>
                                <button className="btn btn-primary mr-5">
                                    <a href="/costumerdetails">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </a>
                                </button>
                                <button className="btn btn-secondary">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>

                        </td>
                    </tr>
                    {/* row 2 */}
                    <tr>
                        <th>1</th>
                        <td>Ali Veli</td>
                        <td>5555555555</td>
                        <td>
                            <div className='flex flex-row '>
                                <button className="btn btn-primary mr-5">
                                    <a href="/costumerdetails">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </a>
                                </button>
                                <button className="btn btn-secondary">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>

                        </td>
                    </tr>
                    {/* row 3 */}
                    <tr>
                        <th>1</th>
                        <td>Ali Veli</td>
                        <td>5555555555</td>
                        <td>
                            <div className='flex flex-row '>
                                <button className="btn btn-primary mr-5">
                                    <a href="/costumerdetails">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </a>
                                </button>
                                <button className="btn btn-secondary">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Table