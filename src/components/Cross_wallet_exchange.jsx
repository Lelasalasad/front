import React, { useState, useContext } from 'react';
import { AppContext } from './AppContext'; 
import { useTranslation } from 'react-i18next'; 
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cross_wallet_exchange = () => {
    const { wallet, updateWallet } = useContext(AppContext);
    const { t } = useTranslation(); 
    const [amount, setAmount] = useState('');
    const [fromWallet, setFromWallet] = useState('');
    const [toWallet, setToWallet] = useState('');
    const [currency, setCurrency] = useState('');
    const [calculatedAmount, setCalculatedAmount] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const fromBalance = wallet[fromWallet];

        if (parseFloat(amount) > fromBalance) {
            toast.error(
                t('insufficientBalance', { wallet: fromWallet, currency })
            ); // إشعار فشل العملية
            return;
        }

        updateWallet(-parseFloat(amount), fromWallet);
        updateWallet(parseFloat(amount), toWallet);
        setCalculatedAmount(amount);
        toast.success(
            t('transferSuccess', { amount, fromWallet, toWallet, currency })
        ); // إشعار نجاح العملية
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>{t('Cross_wallet_exchange')}</h2>
                <p>{t('transferDescription')}</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>{t('amountToTransfer')}:</label>
                        <input 
                            type="number" 
                            placeholder={t('enterAmount')} 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>{t('currency')}:</label>
                        <select 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)} 
                            required
                        >
                            <option value="BTC">Bitcoin (BTC)</option>
                            <option value="ETH">Ethereum (ETH)</option>
                            </select>
                    </div>

                    <div className="input-group">
                        <label>{t('fromWallet')}:</label>
                        <select 
                            value={fromWallet} 
                            onChange={(e) => setFromWallet(e.target.value)} 
                            required
                        >
                            <option value="Wallet1">Wallet 1</option>
                            <option value="Wallet2">Wallet 2</option>
                            <option value="Wallet3">Wallet 3</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>{t('toWallet')}:</label>
                        <select 
                            value={toWallet} 
                            onChange={(e) => setToWallet(e.target.value)} 
                            required
                        >
                            <option value="Wallet1">Wallet 1</option>
                            <option value="Wallet2">Wallet 2</option>
                            <option value="Wallet3">Wallet 3</option>
                        </select>
                    </div>

                    <h5>{t('estimatedAmount')}: {calculatedAmount} {currency}</h5>
                    <button type="submit">{t('transfer')}</button>
                </form>

                {/* إضافة مكوّن ToastContainer لعرض الإشعارات */}
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

export default Cross_wallet_exchange;
