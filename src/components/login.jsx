// src/components/Login.jsx

import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../App.css';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from './AppContext';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { fetchProfile } = useContext(AppContext);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email(t('invalidEmail')).required(t('required')),
      password: Yup.string().min(8, t('passwordLength')).required(t('required')),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true);
      try {
        // 1) طلب تسجيل الدخول
        const res = await loginUser(values);
        console.log('🛎️ login response:', res);

        // 2) استخرج البيانات من res.data
        const { data } = res;
        const { user, access_token: token } = data;

        if (!token) {
          throw new Error('Login failed: no token returned');
        }

        // 3) خزن التوكن وصلاحية الأدمن
        localStorage.setItem('token', token);
        localStorage.setItem('isAdmin', user.is_admin === 1 ? 'true' : 'false');

        // 4) جلب بيانات البروفايل بالكامل
        await fetchProfile();

        // 5) إشعار نجاح والتنقل
        toast.success(t('loginSuccess'));
        navigate('/wallet');
      } catch (err) {
        console.error('Login error:', err);
        const msg = err.response?.data?.message || err.message || t('invalidCredentials');
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
        <h2>{t('login')}</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label>{t('email')}:</label>
            <input type="email" {...formik.getFieldProps('email')} />
          </div>
          <div className="input-group">
            <label>{t('password')}:</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                {...formik.getFieldProps('password')}
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? <FaSpinner className="spinner" /> : t('login')}
          </button>
        </form>
        <div className="register-link">
          <p>
            {t('have_account')} <Link to="/register">{t('register')}</Link> |{' '}
            <Link to="/ForgotPassword">{t('forgotPassword')}</Link>
          </p>
        </div>
      </div>
      {/* ToastContainer ضروري يكون ظاهراً */}
      <ToastContainer position="top-right" autoClose={3000} closeOnClick />
    </motion.div>
  );
};

export default Login;
