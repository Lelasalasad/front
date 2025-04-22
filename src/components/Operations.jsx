import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next'; 
import '../App.css'; 

const Operations = () => {
    const { t } = useTranslation(); 
    const [loading, setLoading] = useState({
        transfer: false,
        walletTransfer: false,
        withdraw: false,
        deposit: false,
        WalletManagement: false,
    });
    const navigate = useNavigate();

    const handleLoading = (operation, path) => {
        setLoading((prev) => ({ ...prev, [operation]: true }));
        setTimeout(() => {
            setLoading((prev) => ({ ...prev, [operation]: false }));
            navigate(path);
        }, 2000); 
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>{t('operations')}</h2> {}
                <ul className="operations-list">
                    <li>
                        <button className="operation-button" onClick={() => handleLoading('WalletManagement', '/WalletManagement')} disabled={loading.WalletManagement}>
                            {loading.WalletManagement ? <FaSpinner className="spinner" /> : t('walletManagement')} {}
                        </button>
                    </li>
                    <li>
                        <button className="operation-button" onClick={() => handleLoading('In_wallet_exchange', '/In_wallet_exchange')} disabled={loading.transfer}>
                            {loading.transfer ? <FaSpinner className="spinner" /> : t('In_wallet_exchange')} {}
                        </button>
                    </li>
                    <li>
                        <button className="operation-button" onClick={() => handleLoading('Cross_wallet_exchange', '/Cross_wallet_exchange')} disabled={loading.walletTransfer}>
                            {loading.walletTransfer ? <FaSpinner className="spinner" /> : t('Cross_wallet_exchange')} {}
                        </button>
                    </li>
                    <li>
                        <button className="operation-button" onClick={() => handleLoading('withdraw', '/withdraw')} disabled={loading.withdraw}>
                            {loading.withdraw ? <FaSpinner className="spinner" /> : t('withdraw')} {}
                        </button>
                    </li>
                    <li>
                        <button className="operation-button" onClick={() => handleLoading('deposit', '/deposit')} disabled={loading.deposit}>
                            {loading.deposit ? <FaSpinner className="spinner" /> : t('deposit')} {}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Operations;