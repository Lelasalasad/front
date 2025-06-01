import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import { AppContext } from "./AppContext";
import { FaCalendarAlt } from "react-icons/fa";

const AdminAccountMovements = () => {
  const { t } = useTranslation();
  const { fetchProfile } = useContext(AppContext);

  const token = localStorage.getItem("token");
  const [selectedTab, setSelectedTab] = useState("pending");
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [history, setHistory] = useState([]);

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const withdrawalsRes = await axios.get(
          "http://127.0.0.1:8000/api/admin/withdrawals",
          { headers }
        );
        const pending = withdrawalsRes.data.filter(
          (w) => w.status === "pending"
        );
        setPendingWithdrawals(pending);

        const historyRes = await axios.get(
          "http://127.0.0.1:8000/api/admin/history",
          { headers }
        );
        setHistory(historyRes.data.history.data || []);
      } catch (error) {
        toast.error(t("Failed to fetch data"));
        console.error(error);
      }
    };

    fetchData();
  }, [token, t]);

  const approveWithdrawal = async (id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/admin/withdrawals/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t("Withdrawal approved successfully"));
      fetchProfile();
      setPendingWithdrawals(pendingWithdrawals.filter((w) => w.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || t("Approval failed"));
    }
  };

  const filteredHistory = filterDate
    ? history.filter((txn) => txn.created_at.startsWith(filterDate))
    : history;

  return (
    <motion.div
      className="container log"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-container log">
        <h2>{t("AdminAccountMovements")}</h2>

        <div className="tabs">
          <button
            className={selectedTab === "pending" ? "active" : ""}
            onClick={() => setSelectedTab("pending")}
          >
            {t("PendingWithdrawals")}
          </button>
          <button
            className={selectedTab === "history" ? "active" : ""}
            onClick={() => setSelectedTab("history")}
          >
            {t("TransactionHistory")}
          </button>
        </div>

        {selectedTab === "pending" && (
          <div className="pending-section">
            {pendingWithdrawals.length === 0 ? (
              <p>{t("No pending withdrawals")}</p>
            ) : (
              <table className="pending-table">
                <thead>
                  <tr>
                    <th>{t("ID")}</th>
                    <th>{t("User ID")}</th>
                    <th>{t("Amount")}</th>
                    <th>{t("Currency")}</th>
                    <th>{t("Date")}</th>
                    <th>{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingWithdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id}>
                      <td>{withdrawal.id}</td>
                      <td>{withdrawal.user_id}</td>
                      <td>{withdrawal.amount}</td>
                      <td>{withdrawal.currency}</td>
                      <td>
                        {new Date(withdrawal.created_at).toLocaleString()}
                      </td>
                      <td>
                        <button
                          className="approve-btn"
                          onClick={() => approveWithdrawal(withdrawal.id)}
                        >
                          {t("Approve")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {selectedTab === "history" && (
          <div className="history-section">
            <div className="title-with-filter">
              <h3>{t("TransactionHistory")}</h3>
              <FaCalendarAlt
                className="calendar-icon"
                onClick={() => setShowDateFilter((prev) => !prev)}
                title={t("Filter by date")}
              />
            </div>

            {showDateFilter && (
              <div className="mb-4">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="p-2 border rounded"
                />
                {filterDate && (
                  <button
                    onClick={() => setFilterDate("")}
                    className="ml-2 p-2 bg-gray-200 rounded"
                  >
                    {t("Clear")}
                  </button>
                )}
              </div>
            )}

            {filteredHistory.length === 0 ? (
              <p>{t("No transactions found")}</p>
            ) : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>{t("ID")}</th>
                    <th>{t("User ID")}</th>
                    <th>{t("Type")}</th>
                    <th>{t("Currency")}</th>
                    <th>{t("Amount")}</th>
                    <th>{t("Before")}</th>
                    <th>{t("After")}</th>
                    <th>{t("Note")}</th>
                    <th>{t("Date")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((txn) => (
                    <tr key={txn.id}>
                      <td>{txn.id}</td>
                      <td>{txn.user_id}</td>
                      <td>{txn.type}</td>
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
        )}
      </div>
    </motion.div>
  );
};

export default AdminAccountMovements;
