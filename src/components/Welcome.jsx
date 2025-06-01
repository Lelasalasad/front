import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";
import { useTranslation } from "react-i18next";
import { FaMoneyBillWave, FaPiggyBank, FaCoins } from "react-icons/fa";
import "../App.css";

const Word = React.memo(({ word }) => {
  return <span className="falling-word">{word}</span>;
});

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      navigate("/welcome");
    }
  }, [user, navigate]);

  useEffect(() => {
    const elements = document.querySelectorAll(".word-wrapper span");
    elements.forEach((el, index) => {
      el.style.setProperty("--delay", `${index * 0.25}s`);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/login");
  };

  const text = t("welcomeMessage");

  return (
    <div className="welcome-container">
      <div className="word-wrapper bold-font">
        {text.split(" ").map((word, index) => (
          <Word key={index} word={word} />
        ))}
      </div>

      <div className="icon-row">
        <FaMoneyBillWave className="money-icon" />
        <FaPiggyBank className="money-icon" />
        <FaCoins className="money-icon" />
      </div>

      <div className="welcome-content">
        <p>{t("welcomeDescription")}</p>
        <button
          type="button"
          onClick={handleSubmit}
          className="get-started-button"
        >
          {t("getStarted")}
        </button>
      </div>
    </div>
  );
};

export default Welcome;
