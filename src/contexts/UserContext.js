import React, { createContext, useState, useEffect } from 'react';
import { auth, getCostumerData } from '../firebase';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Handle user authentication
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const userPhone = user.email.split('@')[0];
                const userID = userPhone + '-' + user.uid;
                getCostumerData(userID).then(data => {
                    setUserInfo(data);
                });
            } else {
                setUserInfo(null);
            }
        });

        return () => {
            unsubscribe();
        }

    }, []);

    return (
        <UserContext.Provider value={userInfo}>
            {children}
        </UserContext.Provider>
    );
};