import React, { createContext, useState, useEffect } from 'react';
import { getAllCostumers } from '../firebase'

export const CustomersContext = createContext();

export const CustomersProvider = ({ children }) => {
    const [customers, setCustomers] = useState([]);
    // Fetch customers only once at the start of the application

    const fetchCustomers = () => {
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
    };

    useEffect(() => {
        if (customers.length > 0) return;
        fetchCustomers();
    }, []);

    const addCustomer = (customer) => {
        setCustomers([...customers, customer]);
    };

    const updateCustomer = (customer) => {
        const index = customers.findIndex((c) => c.id === customer.id);
        const updatedCustomers = [...customers];
        updatedCustomers[index] = customer;
        setCustomers(updatedCustomers);
    }

    const deleteCustomer = (id) => {
        const updatedCustomers = customers.filter((c) => c.id !== id);
        setCustomers(updatedCustomers);
    }


    return (
        <CustomersContext.Provider value={{ customers, addCustomer, updateCustomer, deleteCustomer }}>
            {children}
        </CustomersContext.Provider>
    );
};

