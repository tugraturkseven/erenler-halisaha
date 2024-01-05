import React, { createContext, useState, useEffect } from 'react';
import { getAllCostumers } from '../firebase'

export const CustomersContext = createContext();

export const CustomersProvider = ({ children }) => {
    const [customers, setCustomers] = useState([]);
    // Fetch customers only once at the start of the application
    useEffect(() => {
        if (customers.length > 0) return;
        getAllCostumers()
            .then((userData) => {
                if (userData) {
                    const userArray = Object.entries(userData).map(([key, value]) => ({ id: key, ...value }));
                    setCustomers(userArray);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <CustomersContext.Provider value={{ customers }}>
            {children}
        </CustomersContext.Provider>
    );
};

