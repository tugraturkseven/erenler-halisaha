import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import CustomerSelector from '../components/CustomerSelector'
import Search from '../components/Search'
import { getAllCostumers } from '../firebase'
import { useNavigate, useLocation } from 'react-router-dom'

function ChooseCustomer() {
    const [costumers, setCostumers] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const navigate = useNavigate();
    const location = useLocation();

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

    const createCustomerButton = (
        <button onClick={() => navigate('/createCustomer', { state: location.state })} className='btn btn-ghost normal-case text-xl xl:text-3xl'>
            <p>👱</p>
            <p className='absolute rotate-45 text-xs top-3 right-3'>❌</p>
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