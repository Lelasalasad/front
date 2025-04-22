import React, { useState, useContext } from 'react';
import { AppContext } from './AppContext';  
import { useTranslation } from 'react-i18next'; 
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  

const WalletManagement = () => {
    const { wallet, updateWallet } = useContext(AppContext);  
    const { t } = useTranslation(); 

    const handleTransaction = (type, currency, amount) => {
        const updatedBalance = { ...wallet };
        const amountFloat = parseFloat(amount);

        if (type === 'add') {
            updatedBalance[currency] += amountFloat;
        } else if (type === 'subtract') {
            if (amountFloat > updatedBalance[currency]) {
                // عرض إشعار خطأ عند عدم توفر الرصيد الكافي
                toast.error(t('insufficientBalance', { currency }));
                return;
            }
            updatedBalance[currency] -= amountFloat;
        }

        updateWallet(amountFloat * (type === 'add' ? 1 : -1), currency);

        // عرض إشعار نجاح العملية بناءً على نوعها
        toast.success(
            type === 'add'
                ? t('transactionSuccess_Add', { amount, currency })
                : t('transactionSuccess_Subtract', { amount, currency })
        );
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>{t('walletManagement')}</h2>
                <br />
                <h3>{t('walletBalance')}</h3>
                <ul>
                    {Object.entries(wallet).map(([currency, balance]) => (
                        <li key={currency}>
                            {currency}: {balance.toFixed(2)} {currency}
                        </li>
                    ))}
                </ul>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const type = e.target.elements.type.value;
                        const currency = e.target.elements.currency.value;
                        const amount = e.target.elements.amount.value;
                        handleTransaction(type, currency, amount);
                        e.target.reset();
                    }}
                >
                    <div className="input-group">
                        <label>{t('transactionType')}:</label>
                        <select name="type" required>
                            <option value="add">{t('addFunds')}</option>
                            <option value="subtract">{t('deductFunds')}</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>{t('currency')}:</label>
                        <select name="currency" required>
                            <option value="USD">USD (US Dollar)</option>
                            <option value="BTC">BTC (Bitcoin)</option>
                            <option value="ETH">ETH (Ethereum)</option>
                            <option value="TRY">TRY (الليرة التركية)</option>
                            <option value="SYP">SYP (Syrian Pound)</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>{t('amount')}:</label>
                        <input type="number" name="amount" placeholder={t('enterAmount')} required />
                    </div>
                    <button type="submit">{t('submitTransaction')}</button>
                </form>

                {/* عرض الإشعارات في منتصف الشاشة */}
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

export default WalletManagement;
