import React, { Suspense, lazy, useState, useEffect } from 'react';
import AppProvider from './components/AppContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Navbar from './components/Navbar'; 
import FloatingCoins from './components/FloatingCoins'; 
import './App.css'; 
import './components/i18next'; 
import { ToastContainer } from 'react-toastify';

const Login = lazy(() => import('./components/login'));
const Logout = lazy(() => import('./components/Logout'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const Register = lazy(() => import('./components/register'));
const VerifyEmail = lazy(() => import('./components/VerifyEmail'));
const Inwalletexchange = lazy(() => import('./components/In_wallet_exchange'));
const Welcome = lazy(() => import('./components/Welcome'));
const Crosswalletexchange = lazy(() => import('./components/Cross_wallet_exchange'));
const Withdraw = lazy(() => import('./components/withdraw'));
const Deposit = lazy(() => import('./components/deposit'));
const Transactions = lazy(() => import('./components/transactions'));
const Profile = lazy(() => import('./components/profile'));
const AdminAccountMovements = lazy(() => import('./components/AdminAccountMovements'));
const Wallet = lazy(() => import('./components/wallet'));
const UserAccountMovements = lazy(() => import('./components/UserAccountMovements'));




const App = () => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'en'; 
    });

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        document.body.classList.toggle('ar', language === 'ar');
        document.body.classList.toggle('en', language === 'en');
        localStorage.setItem('darkMode', darkMode);
        localStorage.setItem('language', language); 
    }, [darkMode, language]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
        i18next.changeLanguage(lang);
    };

    return (

        <AppProvider>
            <div className={`app-background ${darkMode ? 'dark-mode' : ''}`}>
                <FloatingCoins />
                
                <Router>
                    <Navbar 
                        toggleDarkMode={toggleDarkMode} 
                        darkMode={darkMode} 
                        changeLanguage={changeLanguage} 
                    />
                     <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
                    <div className="main-container">
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                <Route path="/" element={<Welcome />} />
                                 <Route path="/welcome" element={<Welcome />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/logout" element={<Logout />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/verify-email" element={<VerifyEmail />} />
                                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                                <Route path="/transactions" element={<Transactions />} />
                                <Route path="/In_wallet_exchange" element={<Inwalletexchange />} />
                                <Route path="/Cross_wallet_exchange" element={<Crosswalletexchange />} />
                                <Route path="/withdraw" element={<Withdraw />} />
                                <Route path="/deposit" element={<Deposit />} />
                                <Route path="/wallet" element={<Wallet />} />
                                 <Route path="/AdminAccountMovements" element={<AdminAccountMovements />} />
                                 <Route path="/UserAccountMovements" element={<UserAccountMovements />} />



                            </Routes>
                        </Suspense>
                    </div>
                </Router>
            </div>
        </AppProvider>
    );
};

export default App;