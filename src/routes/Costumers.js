import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Table from '../components/Table'
import Search from '../components/Search'
import { getAllCostumers } from '../firebase'



function Costumers() {

    const [costumers, setCostumers] = useState([])
    const [searchResults, setSearchResults] = useState([])

    useEffect(() => {
        getAllCostumers()
            .then((userData) => {
                if (userData) {
                    const userArray = Object.entries(userData).map(([key, value]) => ({ id: key, ...value }));
                    setCostumers(userArray);
                    setSearchResults(userArray);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const handleChange = (value) => {

        const results = costumers.filter((costumer) => {
            return costumer.name.toLowerCase().includes(value.toLowerCase())
        })
        setSearchResults(results)

    }

    const headings = { first: '🏷️ Isim', second: '📞 Telefon' }

    return (
        <div className='flex flex-col h-screen items-center gap-5'>
            <Navbar addCostumer={true} />
            <Search handleChange={handleChange} />
            <Table data={searchResults} type={'customers'} headings={headings} />
        </div>
    )
}

export default Costumers