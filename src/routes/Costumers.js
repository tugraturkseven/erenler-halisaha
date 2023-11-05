import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Table from '../components/Table'
import Search from '../components/Search'
import { getAllCostumers } from '../firebase'


function Costumers() {

    const [costumers, setCostumers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])

    const updateSearchResults = () => {
        const results = costumers.filter(costumer => costumer.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setSearchResults(results)
    }

    const handleChange = event => {
        setSearchTerm(event.target.value)
    }

    useEffect(() => {
        const userArray = [];
        getAllCostumers()
            .then((userData) => {
                if (userData) {
                    // Assuming userData is an object containing user information
                    // You can convert it to an array and store it in userArray
                    userArray.push(...Object.values(userData));
                    setCostumers(userArray)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [])


    return (
        <div className='flex flex-col h-screen items-center gap-5'>
            <Navbar addCostumer={true} />
            <Search />
            <Table />
        </div>
    )
}

export default Costumers