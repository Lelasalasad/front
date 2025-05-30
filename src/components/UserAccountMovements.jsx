import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../App.css';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa'; // أيقونة التقويم

const UserAccountMovements = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const [transactions, setTransactions] = useState([]);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data.history?.data || []);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    if (token) fetchHistory();
  }, [token]);

  // فلترة المعاملات حسب التاريخ المختار (YYYY-MM-DD)
  const filtered = filterDate
    ? transactions.filter(txn => txn.created_at.startsWith(filterDate))
    : transactions;

  return (
    <motion.div
      className="container log"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-container log">
        <h2 className="flex items-center w-full">
  {t('UserAccountMovements')}
  <FaCalendarAlt
    className="cursor-pointer ml-auto text-2xl"
    onClick={() => setShowDateFilter(prev => !prev)}
    title={t('Filter by date')}
  />
</h2>


        {/* حقل اختيار التاريخ */}
        {showDateFilter && (
          <div className="mb-4">
            <input
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="p-2 border rounded"
            />
            {filterDate && (
              <button
                onClick={() => setFilterDate('')}
                className="ml-2 p-2 bg-gray-200 rounded"
              >
                {t('Clear')}
              </button>
            )}
          </div>
        )}

        {filtered.length === 0 ? (
          <p>{t('No transactions found')}</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>{t('ID')}</th>
                <th>{t('Type')}</th>
                <th>{t('Currency')}</th>
                <th>{t('Amount')}</th>
                <th>{t('Before')}</th>
                <th>{t('After')}</th>
                <th>{t('Note')}</th>
                <th>{t('Date')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(txn => (
                <tr key={txn.id}>
                  <td>{txn.id}</td>
                  <td>{t(txn.type)}</td>
                  <td>{txn.currency}</td>
                  <td>{txn.amount}</td>
                  <td>{txn.balance_before}</td>
                  <td>{txn.balance_after}</td>
                  <td>{txn.note}</td>
                  <td>{new Date(txn.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default UserAccountMovements;
