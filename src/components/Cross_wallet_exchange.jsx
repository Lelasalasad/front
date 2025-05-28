import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from './AppContext'; 
import { useTranslation } from 'react-i18next'; 
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cross_wallet_exchange = () => {
const { wallet, fetchProfile } = useContext(AppContext);
    const { t } = useTranslation(); 
    const [amount, setAmount] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [currency, setCurrency] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // التحقق من المدخلات الأساسية
        if (!amount || parseFloat(amount) <= 0) {
            toast.error(t('amountGreaterThanZero'));
            return;
        }
        if (!accountNumber) {
            toast.error(t('accountNumberRequired'));
            return;
        }
        if (!currency) {
            toast.error(t('currencyRequired'));
            return;
        }

        // التحقق من الرصيد في المحفظة
        const balance = wallet?.[currency] || 0;
        if (parseFloat(amount) > balance) {
            toast.error(t('insufficientBalance', { wallet: accountNumber, currency }));
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/crosswalletexchange', {
                account_number: accountNumber,
                currency,
                amount,
                note
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data && res.data.message) {

                toast.success(t('transferSuccess', { amount, accountNumber, currency }));
                setAmount('');
                setAccountNumber('');
                setCurrency('');
                setNote('');
                await fetchProfile();

            } else {
                throw new Error(t('transferFailed'));
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || t('transferFailed');
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>{t('Cross_wallet_exchange')}</h2>
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
                        <label>{t('accountNumber')}:</label>
                        <input 
                            type="text" 
                            placeholder={t('enterAccountNumber')} 
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)} 
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
                            <option value="">{t('Select Currency')}</option>
                            {Object.keys(wallet || {}).map((cur) => (
                                <option key={cur} value={cur}>{cur}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>{t('note')}:</label>
                        <textarea 
                            placeholder={t('enterNote')} 
                            value={note}
                            onChange={(e) => setNote(e.target.value)} 
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? t('processing') : t('transfer')}
                    </button>
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

export default Cross_wallet_exchange;
