import React, { useState, useContext } from 'react';
import { AppContext } from './AppContext';
import { useTranslation } from 'react-i18next'; 
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Deposit = () => {
    const { wallet, setWallet } = useContext(AppContext);
    const { t } = useTranslation(); 
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('');
    const [accountNumber, setAccountNumber] = useState(''); // حقل رقم الحساب

    const handleDeposit = async (event) => {
        event.preventDefault();

        const depositAmount = parseFloat(amount);
        if (!accountNumber.trim()) {
            toast.error(t('depositErrorMissingAccountNumber')); // رسالة خاصة بعدم إدخال رقم الحساب
            return;
        }
        if (!currency || isNaN(depositAmount) || depositAmount <= 0) {
            toast.error(t('depositErrorInvalidAmount'));
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            toast.error(t('missingAccountInfo'));
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    account_number: accountNumber.trim(),
                    currency_code: currency,
                    amount: depositAmount
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`${t('depositSuccess', { amount: depositAmount, currency })} ✅`);
                
                const updatedWallet = {};
                data.wallets.forEach((w) => {
                    updatedWallet[w.currency] = parseFloat(w.balance);
                });
                setWallet(updatedWallet);

                setAmount('');
                setCurrency('');
                setAccountNumber('');
            } else {
                toast.error(data.message || t('depositFailed'));
            }
        } catch (error) {
            console.error('Deposit error:', error);
            toast.error(t('depositFailed'));
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>{t('deposit')}</h2>
                <form onSubmit={handleDeposit}>
                    <div className="input-group">
                        <label>{t('accountNumber')}</label>
                        <input 
                            type="text" 
                            placeholder={t('accountNumber')} 
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>{t('amount')}</label>
                        <input 
                            type="number" 
                            placeholder={t('amount')} 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>{t('currency')}</label>
                        <select 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)} 
                            required
                        >
                            <option value="">{t('selectCurrency')}</option>
                            <option value="USD">{t('USD')}</option>
                            <option value="TRY">{t('TRY')}</option>
                            <option value="SYP">{t('SYP')}</option>
                        </select>
                    </div>
                    <button type="submit">{t('deposit')}</button>
                </form>
                
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={true} 
                    pauseOnHover
                />
            </div>
        </div>
    );
};

export default Deposit;
