// src/pages/Register.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa'; // أضفنا FaSpinner هنا
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerUser } from '../services/api';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    answerSecurity: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const validateName = name => /^[A-Za-z]+$/.test(name);
  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = pwd => pwd.length >= 8;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = {};

    if (!validateName(formData.firstName)) errs.firstName = t('firstNameError');
    if (!validateName(formData.lastName))  errs.lastName  = t('lastNameError');
    if (!validateEmail(formData.email))    errs.email     = t('emailError');
    if (!validatePassword(formData.password)) errs.password = t('passwordLengthError');
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = t('passwordMismatchError');
    if (!formData.birthDate)    errs.birthDate    = t('birthDateError');
    if (!formData.answerSecurity) errs.answerSecurity = t('answerSecurityError');

    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      localStorage.setItem(
      'pendingRegistration',
       JSON.stringify({
         first_name: formData.firstName,
         last_name: formData.lastName,
         email: formData.email,
         password: formData.password,
         password_confirmation: formData.confirmPassword,
         birth_date: formData.birthDate,
         answer_security: formData.answerSecurity,
       })
     );
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        birth_date: formData.birthDate,
        answer_security: formData.answerSecurity,
      };
      const res = await registerUser(payload);
 toast.success(res.message);
 navigate('/verify-email');

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>{t('register')}</h2>
        <form onSubmit={handleSubmit}>
          {['firstName', 'lastName', 'email', 'birthDate'].map((f, i) => (
            <div className="input-group" key={i}>
              <label>{t(f)}:</label>
              <input
                type={f === 'birthDate' ? 'date' : 'text'}
                placeholder={t(f)}
                name={f}
                value={formData[f]}
                onChange={handleChange}
                className={errors[f] ? 'error' : ''}
                required
              />
              {errors[f] && <div className="error-message">{errors[f]}</div>}
            </div>
          ))}

          <div className="input-group">
            <label>{t('whatIsYourFavoriteColor')}:</label>
            <input
              type="text"
              placeholder={t('whatIsYourFavoriteColor')}
              name="answerSecurity"
              value={formData.answerSecurity}
              onChange={handleChange}
              className={errors.answerSecurity ? 'error' : ''}
              required
            />
            {errors.answerSecurity && (
              <div className="error-message">{errors.answerSecurity}</div>
            )}
          </div>

          {['password', 'confirmPassword'].map((f, i) => (
            <div className="input-group" key={i}>
              <label>{t(f)}:</label>
              <div className="input-wrapper">
                <input
                  type={
                    f === 'confirmPassword'
                      ? showConfirm
                        ? 'text'
                        : 'password'
                      : showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder={t(f)}
                  name={f}
                  value={formData[f]}
                  onChange={handleChange}
                  className={errors[f] ? 'error' : ''}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => {
                    if (f === 'password') setShowPassword(s => !s);
                    else setShowConfirm(s => !s);
                  }}
                >
                  {f === 'password'
                    ? showPassword
                      ? <FaEyeSlash />
                      : <FaEye />
                    : showConfirm
                    ? <FaEyeSlash />
                    : <FaEye />}
                </span>
              </div>
              {errors[f] && <div className="error-message">{errors[f]}</div>}
            </div>
          ))}

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? (
              <>
                <FaSpinner className="spinner" /> {t('sendingCode')}
              </>
            ) : (
              t('register')
            )}
          </button>
        </form>

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          rtl
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default Register;
