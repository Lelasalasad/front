import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "./AppContext";
import { useTranslation } from "react-i18next";
import "../App.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const In_wallet_exchange = () => {
  const { wallet, fetchProfile } = useContext(AppContext);
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (parseFloat(amount) <= 0) {
      setErrorMessage(t("amountGreaterThanZero"));
      toast.error(t("amountGreaterThanZero"));
      return;
    }

    if (fromCurrency === toCurrency) {
      toast.error(t("cannotConvertSameCurrency"));
      return;
    }

    if (
      !wallet ||
      !wallet[fromCurrency] ||
      parseFloat(amount) > wallet[fromCurrency]
    ) {
      setErrorMessage(t("insufficientFunds", { currency: fromCurrency }));
      toast.error(t("insufficientFunds", { currency: fromCurrency }));
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/wallet/exchange",
        {
          from_currency: fromCurrency,
          to_currency: toCurrency,
          amount: parseFloat(amount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data && res.data.converted_amount) {
        const convertedAmount = parseFloat(res.data.converted_amount);

        setCalculatedAmount(convertedAmount.toFixed(6));
        setErrorMessage("");
        toast.success(
          t("exchangeSuccess", {
            amount: convertedAmount.toFixed(6),
            currency: toCurrency,
          })
        );
        await fetchProfile();
      } else {
        throw new Error(t("exchangeFailed"));
      }
    } catch (error) {
      console.error("تفاصيل الخطأ:", error.response?.data?.errors);

      const msg =
        error.response?.data?.message || error.message || t("exchangeFailed");
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>{t("In_wallet_exchange")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{t("amount")}</label>
            <input
              type="number"
              placeholder={t("amount")}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>{t("fromCurrency")}</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              required
            >
              <option value="">{t("Select Currency")}</option>
              {Object.keys(wallet || {}).map((currencyKey) => (
                <option key={currencyKey} value={currencyKey}>
                  {currencyKey}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>{t("toCurrency")}</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              required
            >
              <option value="">{t("Select Currency")}</option>
              {Object.keys(wallet || {}).map((currencyKey) => (
                <option key={currencyKey} value={currencyKey}>
                  {currencyKey}
                </option>
              ))}
            </select>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <h5>
            {t("estimatedAmount")}: {calculatedAmount} {toCurrency}
          </h5>
          <button type="submit">{t("convert")}</button>
        </form>
      </div>
    </div>
  );
};

export default In_wallet_exchange;
