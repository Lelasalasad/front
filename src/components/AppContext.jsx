import React, { createContext, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState({
    
        USD: 100,
        TRY:50,
        
        SYP: 1000,
        BTC:0.5,
        ETH: 2, 
    });

    const updateWallet = (amount, currency) => {
        setWallet(prevWallet => {
            const currentBalance = prevWallet[currency] || 0;
            const newBalance = currentBalance + amount;

            if (newBalance < 0) {
                console.error(`Insufficient funds in ${currency}. Current balance: ${currentBalance}, trying to deduct: ${-amount}`);
                toast.error(`Insufficient funds in ${currency}. Current balance: ${currentBalance}, trying to deduct: ${-amount}`);
                return prevWallet; 
            }
            

            
            return {
                ...prevWallet,
                [currency]: newBalance,
            };
        });
    };

    return (
        <AppContext.Provider value={{ user, setUser, wallet, updateWallet }}>
            {children}
        </AppContext.Provider>
    );
};
