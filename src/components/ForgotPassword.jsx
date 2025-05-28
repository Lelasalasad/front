import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCodeSent, setIsCodeSent] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      resetCode: '',
      securityAnswer: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email(t('invalidEmail')).required(t('required')),
      resetCode: Yup.string().required(t('verificationCodeRequired')),
      securityAnswer: Yup.string().required(t('answerSecurityError')),
      newPassword: Yup.string().min(8, t('passwordMinLength')).required(t('required')),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], t('passwordsMustMatch'))
        .required(t('required')),
    }),
    onSubmit: () => {},
  });

  // ارسال كود اعادة التعيين
  const handleSendCode = async (e) => {
    e.preventDefault();
    await formik.validateField('email');
    if (formik.errors.email) return;

    try {
      const { data, status } = await axios.post(
        'http://localhost:8000/api/forgot_password',
        { email: formik.values.email }
      );
      if (status === 200) {
        setIsCodeSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.message || t('errorOccurred'));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t('errorOccurred'));
    }
  };

  // اعادة تعيين كلمة المرور
  const handleReset = async (e) => {
    e.preventDefault();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length) {
      formik.setTouched({ resetCode: true, securityAnswer: true, newPassword: true, confirmPassword: true });
      return;
    }

    try {
      const { data, status } = await axios.post(
        'http://localhost:8000/api/reset_password',
        {
          email: formik.values.email,
          reset_code: formik.values.resetCode,
          security_answer: formik.values.securityAnswer,
          new_password: formik.values.newPassword,
          new_password_confirmation: formik.values.confirmPassword,
        }
      );
      if (status === 200) {
        toast.success(data.message || t('passwordResetSuccess'));
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.message || t('errorOccurred'));
      }
    } catch (err) {
      console.error('Reset Error Response:', err.response?.data);
      if (err.response?.status === 422 && err.response.data.errors) {
        Object.values(err.response.data.errors)
          .flat()
          .forEach(msg => toast.error(msg));
      } else {
        toast.error(err.response?.data?.message || t('errorOccurred'));
      }
    }
  };

  return (
    <motion.div
      className="container log"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-container log">
        <h2>{t('forgotPassword')}</h2>

        {!isCodeSent && (
          <form onSubmit={handleSendCode}>
            <div className="input-group">
              <label>{t('email')}:</label>
              <input type="email" {...formik.getFieldProps('email')} />
              {formik.touched.email && formik.errors.email && (
                <div className="error-message">{formik.errors.email}</div>
              )}
            </div>
            <button type="submit" disabled={isCodeSent}>{t('resetpasswordCode')}</button>
          </form>
        )}

        {isCodeSent && (
          <form onSubmit={handleReset}>
            <div className="input-group">
              <label>{t('verificationCode')}:</label>
              <input type="text" {...formik.getFieldProps('resetCode')} />
              {formik.touched.resetCode && formik.errors.resetCode && (
                <div className="error-message">{formik.errors.resetCode}</div>
              )}
            </div>

            <div className="input-group">
              <label>{t('answerSecurity')}:</label>
              <input type="text" {...formik.getFieldProps('securityAnswer')} />
              {formik.touched.securityAnswer && formik.errors.securityAnswer && (
                <div className="error-message">{formik.errors.securityAnswer}</div>
              )}
            </div>

            <div className="input-group">
              <label>{t('newPassword')}:</label>
              <input type="password" {...formik.getFieldProps('newPassword')} />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <div className="error-message">{formik.errors.newPassword}</div>
              )}
            </div>

            <div className="input-group">
              <label>{t('confirmPassword')}:</label>
              <input type="password" {...formik.getFieldProps('confirmPassword')} />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="error-message">{formik.errors.confirmPassword}</div>
              )}
            </div>

            <button type="submit">{t('resetPassword')}</button>
          </form>
        )}

        <Link className="a" to="/login">
          {t('backToLogin')}
        </Link>
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar closeOnClick rtl pauseOnHover />
      </div>
    </motion.div>
  );
}
