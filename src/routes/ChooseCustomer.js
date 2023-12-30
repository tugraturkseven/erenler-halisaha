import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import CustomerSelector from '../components/CustomerSelector'
import Search from '../components/Search'
import { getAllCostumers } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function ChooseCustomer() {
    const navigate = useNavigate();
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
        // If value is name search for name if value is phone search for phone
        const searchResults = costumers.filter((costumer) => costumer.name.toLowerCase().includes(value.toLowerCase()) || costumer.phone.includes(value));
        setSearchResults(searchResults);

    }

    const handleEdit = (costumer) => {
        navigate('/costumerDetails', { state: { costumer: costumer } })
    }

    const createCustomerButton = (
        <button onClick={() => navigate('/createCustomer')} className='btn btn-ghost normal-case text-xl xl:text-3xl'>
            <FontAwesomeIcon icon={faUserPlus} color='lightgreen' />
        </button>
    )

    return (
        <div className='flex flex-col h-screen items-center gap-5'>
            <Navbar endButton={createCustomerButton} />
            <Search handleChange={handleChange} />
            <CustomerSelector data={searchResults} />
        </div>
    )
}

export default ChooseCustomer