import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

const AdminAccountMovements = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState('pending'); // 'pending' or 'transactions'
  const [transactions, setTransactions] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // فقط الطلبات المعلقة حالياً
        const withdrawalsRes = await axios.get('http://127.0.0.1:8000/api/admin/withdrawals', { headers });
        const pending = withdrawalsRes.data.filter(w => w.status === 'pending');
        setPendingWithdrawals(pending);

        // الحركات المستقبلية (معطلة مؤقتاً)
        // const txnRes = await axios.get('http://127.0.0.1:8000/api/admin/transactions', { headers });
        // setTransactions(txnRes.data);
      } catch (error) {
        toast.error(t('Failed to fetch data'));
        console.error(error);
      }
    };

    fetchData();
  }, [token, t]);

  const approveWithdrawal = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/admin/withdrawals/${id}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(t('Withdrawal approved successfully'));
      setPendingWithdrawals(pendingWithdrawals.filter(w => w.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || t('Approval failed'));
    }
  };

  return (
    <motion.div
      className="container log"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-container log">
        <h2>{t('AdminAccountMovements')}</h2>

        {/* التبويبات */}
        <div className="tabs">
          <button
            className={selectedTab === 'pending' ? 'active' : ''}
            onClick={() => setSelectedTab('pending')}
          >
            {t('Pending Withdrawals')}
          </button>
          <button
            className={selectedTab === 'transactions' ? 'active' : ''}
            onClick={() => setSelectedTab('transactions')}
            disabled
          >
            {t('Users Transactions')}
          </button>
        </div>

        {/* محتوى التبويبات */}
        {selectedTab === 'pending' && (
          <>
            {pendingWithdrawals.length === 0 ? (
              <p>{t('No pending requests')}</p>
            ) : (
              <ul className="transactions-list">
                {pendingWithdrawals.map((w) => (
                  <li key={w.id} className="transaction-item">
                    <p><strong>{t('User')}:</strong> {w.full_name}</p>
                    <p><strong>{t('Amount')}:</strong> {w.amount} {w.currency}</p>
                    <p><strong>{t('Company')}:</strong> {w.transfer_company_name}</p>
                    <p><strong>{t('Note')}:</strong> {w.note}</p>
                    <button onClick={() => approveWithdrawal(w.id)}>
                      {t('Approve')}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {selectedTab === 'transactions' && (
          <p style={{ opacity: 0.6 }}>{t('Feature coming soon')}</p>
        )}

        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      </div>
    </motion.div>
  );
};

export default AdminAccountMovements;
