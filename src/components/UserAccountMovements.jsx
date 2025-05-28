import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../App.css';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../services/api';
import { AppContext } from './AppContext';

const UserAccountMovements = () => {
  const { t } = useTranslation();
  const { user } = useContext(AppContext);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const getTransactions = async () => {
      if (!user?.id) return;
      try {
        const res = await loginUser(user.id);
        setTransactions(res.data);
      } catch (error) {
        console.error("Error fetching user transactions:", error);
      }
    };
    getTransactions();
  }, [user?.id]);

  return (
    <motion.div
      className="container log"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-container log">
        <h2>{t('UserAccountMovements')}</h2>
        <ul className="transactions-list">
          {transactions.map((txn) => (
            <li key={txn.id} className="transaction-item">
              <p><strong>{t('amount')}: </strong> {txn.amount}</p>
              <p><strong>{t('date')}: </strong> {txn.date}</p>
              <p><strong>{t('status')}: </strong> {txn.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default UserAccountMovements;
