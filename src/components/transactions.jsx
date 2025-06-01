import React, { useState, useContext } from 'react';
import { FaSpinner } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next'; 
import { AppContext } from './AppContext';  
import '../App.css'; 

const Transactions = () => {
    const { t } = useTranslation(); 
  const { isAdmin } = useContext(AppContext);
    const [loading, setLoading] = useState({
        transfer: false,
        walletTransfer: false,
        withdraw: false,
        deposit: false,
    });
    const navigate = useNavigate();

    const handleLoading = (transaction, path) => {
        setLoading((prev) => ({ ...prev, [transaction]: true }));
        setTimeout(() => {
            setLoading((prev) => ({ ...prev, [transaction]: false }));
            navigate(path);
        }, 2000); 
    };

    return (
        <div className="container">
            <div className="transactions-container">
                <h2>{t('Transactions')}</h2>
                <div className="transactions-actions">
                    <button onClick={() => handleLoading('transfer', '/In_wallet_exchange')} disabled={loading.transfer} className="transactions-button">
                        {loading.transfer ? <FaSpinner className="spinner" /> : t('In_wallet_exchange')}
                    </button>
                    <button onClick={() => handleLoading('walletTransfer', '/Cross_wallet_exchange')} disabled={loading.walletTransfer} className="transactions-button">
                        {loading.walletTransfer ? <FaSpinner className="spinner" /> : t('Cross_wallet_exchange')}
                    </button>
                    <button onClick={() => handleLoading('withdraw', '/withdraw')} disabled={loading.withdraw} className="transactions-button">
                        {loading.withdraw ? <FaSpinner className="spinner" /> : t('withdraw')}
                    </button>
                    {isAdmin &&(
                        <button onClick={() => handleLoading('deposit', '/deposit')} disabled={loading.deposit} className="transactions-button">
                        {loading.deposit ? <FaSpinner className="spinner" /> : t('deposit')}
                    </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Transactions;
