import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Table from '../components/Table'
import Search from '../components/Search'
import { getAllCostumers } from '../firebase'
import { useNavigate } from 'react-router-dom'


function Costumers() {
    const navigate = useNavigate();
    const [costumers, setCostumers] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        if (costumers.length > 0) return;
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

    const formatPhoneNumber = (phoneNumber) => {
        // Remove all non-digit characters for consistency
        let cleaned = phoneNumber.replace(/\D/g, '');

        // Formatting based on the length and pattern of the input
        if (cleaned.startsWith('90')) {
            if (cleaned.length <= 2) {
                return '+' + cleaned;
            } else {
                cleaned = '+' + cleaned;
                return cleaned.replace(/(\+\d{2})(\d{1,3})?(\d{0,3})?(\d{0,2})?(\d{0,2})?/, (match, p1, p2, p3, p4, p5) => {
                    return [p1, p2, p3, p4, p5].filter(Boolean).join(' ');
                });
            }
        } else if (cleaned.startsWith('0')) {
            return cleaned.replace(/(\d{1,4})?(\d{0,3})?(\d{0,2})?(\d{0,2})?/, (match, p1, p2, p3, p4) => {
                return [p1, p2, p3, p4].filter(Boolean).join(' ');
            });
        } else {
            return cleaned.replace(/(\d{1,3})?(\d{0,3})?(\d{0,2})?(\d{0,2})?/, (match, p1, p2, p3, p4) => {
                return [p1, p2, p3, p4].filter(Boolean).join(' ');
            });
        }
    }




    const handleInputChange = (e) => {
        const value = e.target.value;
        // Regular expression to test if the value is numerical (phone number)
        const isPhoneNumber = /^[\d\s\+\-]+$/.test(value);

        if (isPhoneNumber) {
            // Format the phone number for display
            const formattedValue = formatPhoneNumber(value.replace(/\s+/g, ''));
            setSearchInput(formattedValue); // Update the search bar's display value
        } else {
            setSearchInput(value); // Update the search input state for non-phone number inputs
        }

        // Use the original, unformatted value for filtering
        handleChange(value.replace(/\s+/g, ''));
    }


    const handleChange = (value) => {
        // Regular expression to test if the value is numerical (phone number)
        const isPhoneNumber = /^[\d\s\+\-]+$/.test(value);

        if (isPhoneNumber) {
            // Format the phone number for display
            const formattedValue = formatPhoneNumber(value);
            setSearchInput(formattedValue); // Update the search bar's display value
        }

        // Use the original value for filtering
        const searchResults = costumers.filter((costumer) => {
            if (isPhoneNumber) {
                // Remove non-digits from the input and costumer's phone for comparison
                const cleanedInput = value.replace(/\D/g, '');
                const cleanedPhone = costumer.phone.replace(/\D/g, '');
                return cleanedPhone.includes(cleanedInput);
            } else {
                // If value is alphabetical, search in the name
                return costumer.name.toLowerCase().includes(value.toLowerCase());
            }
        });

        setSearchResults(searchResults);
    }

    const handleEdit = (costumer) => {
        navigate('/costumerDetails', { state: { costumer: costumer } })
    }

    const headings = { first: '🏷️ Isim', second: '📞 Telefon' }

    return (
        <div className='flex flex-col h-screen items-center gap-5'>
            <Navbar addCostumer={true} />
            <Search handleChange={handleChange} inputValue={searchInput} handleInputChange={handleInputChange} />
            <Table data={searchResults} type={'customers'} headings={headings} handleEdit={handleEdit} />
        </div>
    )
}

export default Costumers