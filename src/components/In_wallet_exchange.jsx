import React, { useState, useContext } from 'react';
import { AppContext } from './AppContext';
import { useTranslation } from 'react-i18next'; 
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const In_wallet_exchange = () => {
    const { wallet, updateWallet } = useContext(AppContext);
    const { t } = useTranslation(); 
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('');
    const [toCurrency, setToCurrency] = useState(''); 
    const [exchangeRates] = useState({
        SYR: 12000,
        USD: 1,
        TRY: 38,
        BTC: 30000, 
        ETH: 2000, 
    });
    const [calculatedAmount, setCalculatedAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
    
        if (parseFloat(amount) <= 0) {
            setErrorMessage(t('amountGreaterThanZero'));
            toast.error(t('amountGreaterThanZero'));
            return;
        }
    
        const fromRate = exchangeRates[fromCurrency];
        const toRate = exchangeRates[toCurrency];
    
        const resultAmount = (amount * fromRate / toRate).toFixed(6); 
    
        if (parseFloat(amount) > wallet[fromCurrency]) {
            setErrorMessage(t('insufficientFunds', { currency: fromCurrency })); 
            toast.error(t('insufficientFunds', { currency: fromCurrency }));
            return;
        }

        updateWallet(-parseFloat(amount), fromCurrency); 
        updateWallet(parseFloat(resultAmount), toCurrency); 
        
        setCalculatedAmount(resultAmount);
        setErrorMessage('');
        toast.success(t('exchangeSuccess', { amount: resultAmount, currency: toCurrency }));
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>{t('In_wallet_exchange')}</h2>
                <form onSubmit={handleSubmit}>
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
                        <label>{t('fromCurrency')}</label>
                        <select 
                            value={fromCurrency} 
                            onChange={(e) => setFromCurrency(e.target.value)} 
                            required
                        >
                            {Object.keys(exchangeRates).map((currencyKey) => (
                                <option key={currencyKey} value={currencyKey}>
                                    {currencyKey}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>{t('toCurrency')}</label>
                        <select 
                            value={toCurrency} 
                            onChange={(e) => setToCurrency(e.target.value)} 
                            required
                        >
                            {Object.keys(exchangeRates).map((currencyKey) => (
                                <option key={currencyKey} value={currencyKey}>
                                    {currencyKey}
                                </option>
                            ))}
                        </select>
                    </div>

                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    
                    <h5>{t('estimatedAmount')}: {calculatedAmount} {toCurrency}</h5>
                    <button type="submit">{t('convert')}</button>
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

export default In_wallet_exchange;
