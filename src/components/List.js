import React from 'react'

function List() {
    return (
        <div className="overflow-x-auto">
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        <th></th>
                        <th>Isim</th>
                        <th>Musteri Tipi</th>
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    <tr>
                        <th>16.00</th>
                        <td>Burak Eren Ak</td>
                        <td>Abone</td>

                    </tr>
                    {/* row 2 */}
                    <tr>
                        <th>17.00</th>
                        <td>Tugra Turkseven</td>
                        <td>Duzenli</td>

                    </tr>
                    {/* row 3 */}
                    <tr>
                        <th>18.00</th>
                        <td>Brice Swyre</td>
                        <td>Tax Accountant</td>

                    </tr>
                </tbody>
            </table>
        </div>

    )
}

export default List