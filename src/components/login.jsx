import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import "../App.css";
import { useTranslation } from "react-i18next";
import { loginUser } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "./AppContext";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { fetchProfile } = useContext(AppContext);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email(t("invalidEmail")).required(t("required")),
      password: Yup.string()
        .min(8, t("passwordLength"))
        .required(t("required")),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true);
      try {
        const res = await loginUser(values);
        console.log("🛎️ login response:", res);

        const { data } = res;
        const { user, access_token: token } = data;

        if (!token) {
          throw new Error("Login failed: no token returned");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("isAdmin", user.is_admin === 1 ? "true" : "false");

        await fetchProfile();

        toast.success(t("loginSuccess"));
        navigate("/wallet");
      } catch (err) {
        console.error("Login error:", err);
        const msg =
          err.response?.data?.message || err.message || t("invalidCredentials");
        toast.error(msg);
        setErrors({ email: msg });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <motion.div
      className="container "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-container ">
        <h2>{t("Login")}</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label>{t("email")}:</label>
            <input type="email" {...formik.getFieldProps("email")} />
          </div>
          <div className="input-group">
            <label>{t("password")}:</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("password")}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? (
              <FaSpinner className="spinner" />
            ) : (
              t("Login")
            )}
          </button>
        </form>
        <div className="register-link">
          <p>
            {t("have_account")} <Link to="/register">{t("Register")}</Link>
          </p>
          <p>
            {t("forgot_question")}{" "}
            <Link to="/ForgotPassword">{t("forgotPassword")}</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
