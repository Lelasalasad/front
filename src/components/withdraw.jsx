import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "./AppContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const Withdraw = () => {
  const { isAdmin, fetchProfile } = useContext(AppContext);
  const { t } = useTranslation();
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(t("Unauthorized"));
      return;
    }

    setLoading(true);

    try {
      let response;

      if (isAdmin) {
        // 🟦 حالة الأدمن
        response = await axios.post(
          "http://127.0.0.1:8000/api/admin/manual-withdrawal",
          {
            account_number: accountNumber,
            currency,
            amount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(
          `${t("withdrawSuccess")}: ${response.data.receipt_number}`
        );
        await fetchProfile();
      } else {
        // 🟦 حالة المستخدم
        response = await axios.post(
          "http://127.0.0.1:8000/api/withdrawals/request",
          {
            currency_code: currency,
            amount,
            password,
            full_name: fullName,
            phone,
            location,
            note,
            transfer_company_name: company,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(
          `${t("requestSuccess")}: ${response.data.withdrawal.receipt_number}`
        );
        await fetchProfile();
      }

      setAccountNumber("");
      setAmount("");
      setCurrency("");
      setFullName("");
      setPhone("");
      setLocation("");
      setNote("");
      setCompany("");
      setPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || t("withdrawFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>
          {isAdmin ? t("Admin_Withdraw_from_User") : t("Request Withdraw")}
        </h2>
        <form onSubmit={handleWithdraw}>
          {!isAdmin && (
            <>
              <div className="input-group">
                <label>{t("Full Name")}:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>{t("Phone")}:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>{t("Location")}:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>{t("Transfer Company")}:</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>{t("Password")}:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {isAdmin && (
            <div className="input-group">
              <label>{t("AccountNumber")}:</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>{t("amount")}:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>{t("currency")}:</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
            >
              <option value="">{t("Select Currency")}</option>
              <option value="USD">{t("USD")}</option>
              <option value="TRY">{t("TRY")}</option>
              <option value="SYP">{t("SYP")}</option>
            </select>
          </div>
          <div className="input-group">
            <label>{t("Note")}:</label>
            <textarea
              placeholder={t("enterNote")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="note-textarea"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? t("Processing...") : t("Withdraw")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Withdraw;
