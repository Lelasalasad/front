import React, { useState, useContext } from 'react';
import { AppContext } from './AppContext';  
import { useTranslation } from 'react-i18next'; 
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Withdraw = () => {
    const { wallet, updateWallet } = useContext(AppContext);
    const { t } = useTranslation(); 
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('');

    const handleWithdraw = (event) => {
        event.preventDefault();
        const currentBalance = wallet[currency] || 0;
        const withdrawalAmount = parseFloat(amount);

        if (withdrawalAmount > currentBalance) {
            toast.error(
                t('insufficientBalance', { currency, balance: currentBalance })
            ); // نافذة منبثقة لفشل العملية
            return;
        }

        updateWallet(-withdrawalAmount, currency);
        setAmount('');
        toast.success(
            t('withdrawSuccess', { amount, currency })
        ); // نافذة منبثقة لنجاح العملية
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>{t('withdrawFunds')}</h2>
                <form onSubmit={handleWithdraw}>
                    <div className="input-group">
                        <label>{t('amount')}:</label>
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
                            <option value="USD">USD (US Dollar)</option>
                            <option value="TRY">TRY (Turkish Pound)</option>
                            <option value="SYP">SYP (Syrian Pound)</option>
                        </select>
                    </div>

                    <button type="submit">{t('withdraw')}</button>
                </form>

                <h3>{t('yourBalance')}</h3>
                <ul>
                    {Object.entries(wallet).map(([key, value]) => (
                        <li key={key}>
                            {key}: {typeof value === 'number' ? value.toFixed(2) : 'Invalid value'} {key}
                        </li>
                    ))}
                </ul>

                {/* إضافة مكوّن ToastContainer لعرض النوافذ المنبثقة */}
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={true} // إذا كنت بحاجة لدعم النصوص من اليمين إلى اليسار
                    pauseOnHover
                />
            </div>
        </div>
    );
};

export default Withdraw;
