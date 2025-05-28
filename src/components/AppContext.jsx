import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
const [loadingUser, setLoadingUser] = useState(true);


 const fetchProfile = async () => {
const token = localStorage.getItem('token');
    console.log('fetchProfile token =', token);
  if (!token) {
    setLoadingUser(false);
    return;
  }

  try {
    const profileRes = await axios.get('http://127.0.0.1:8000/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });

    let userData = profileRes.data.data;

    const walletsRes = await axios.get('http://127.0.0.1:8000/api/wallets', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const allUsers = walletsRes.data.data;
    const currentUserWithWallet = allUsers.find(u => u.email === userData.email);

    if (currentUserWithWallet) {
      userData = {
        ...userData,
        account_number: currentUserWithWallet.account_number || '',
      };
      // خزّن رقم الحساب في localStorage
      localStorage.setItem('account_number', userData.account_number);

      const walletData = {};
      currentUserWithWallet.wallets.forEach(w => {
        walletData[w.currency_code] = parseFloat(w.balance);
      });
      setWallet(walletData);
    } else {
      setWallet(null);
      // لو ما في حساب، نمسح رقم الحساب
      localStorage.removeItem('account_number');
    }

    setUser(userData);
    console.log('User data fetched:', userData);

    // خزّن حالة الأدمن في state و localStorage
    const storedAdmin = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(storedAdmin);
    console.log('isAdmin from localStorage =', storedAdmin);

  } catch (err) {
    console.error('Error fetching profile or wallets:', err);
  } finally {
    setLoadingUser(false);
  }
};


  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        wallet,
        isAdmin,
        setUser,
        setWallet,
        setIsAdmin,
        fetchProfile,
        loadingUser,

      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
