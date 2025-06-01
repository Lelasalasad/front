import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { AppContext } from "./AppContext";

const Logout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setUser, setWallet, setIsAdmin } = useContext(AppContext);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      localStorage.removeItem("token");
      setUser(null);
      setWallet(null);
      setIsAdmin(false);
      toast.success(t("logoutSuccess"));

      const timer = setTimeout(() => {
        navigate("/login");
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      navigate("/login");
    }
  }, [navigate, t, setUser, setWallet, setIsAdmin]);

  return null;
};

export default Logout;
