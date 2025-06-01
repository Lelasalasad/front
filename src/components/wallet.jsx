import React, { useContext } from "react";
import { motion } from "framer-motion";
import "../App.css";
import { AppContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaUserCircle } from "react-icons/fa";

const flagMap = {
  USD: "/flags/USD.png",
  TRY: "/flags/TRY.png",
  SYP: "/flags/SYR.png",
};

const Wallet = () => {
  const { user, wallet } = useContext(AppContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!localStorage.getItem("token")) {
    navigate("/login");
    return null;
  }

  if (!user) {
    return <p>{t("loading")}...</p>;
  }

  return (
    <motion.div
      className="main-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-container wallet-container profile-container">
        <div className="welcome-heading">
          <FaUserCircle className="user-icon" />
          <span>{t("welcomeUser", { name: user.full_name })}</span>
        </div>

        <div className="input-group">
          <label>{t("AccountNumber")}:</label>
          <input
            type="text"
            name="account_number"
            value={user.account_number || "غير متوفر"}
            className="profile-input"
            readOnly
          />
        </div>

        <div className="input-group">
          <label>{t("Balance")}:</label>
        </div>

        <div className="balances-container">
          {["USD", "TRY", "SYP"].map((cur) => (
            <div
              key={cur}
              className={`card balance-card currency-${cur.toLowerCase()}`}
            >
              <h3 className="currency-label">{cur}</h3>
              <p className="currency-value">
                {cur === "USD"}
                {cur === "TRY"}
                {wallet && wallet[cur] ? wallet[cur].toFixed(2) : "0.00"}{" "}
                {cur === "SYP"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Wallet;
