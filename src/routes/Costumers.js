import React from 'react'
import Navbar from '../components/Navbar'
import Table from '../components/Table'
import Search from '../components/Search'


function Costumers() {
    return (
        <div className='flex flex-col h-screen items-center gap-5'>
            <Navbar addCostumer={true} />
            <Search />
            <Table />
        </div>
    )
}

export default Costumers