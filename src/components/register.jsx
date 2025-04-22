import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { registerUser } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const { t } = useTranslation(); 
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const validateName = (name) => /^[A-Za-z]+$/.test(name);
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => password.length >= 8;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {};

        if (!validateName(formData.firstName)) {
            newErrors.firstName = t('firstNameError', { defaultValue: 'الاسم الأول يجب أن يحتوي على أحرف فقط.' });
        }
        if (!validateName(formData.lastName)) {
            newErrors.lastName = t('lastNameError', { defaultValue: 'اسم العائلة يجب أن يحتوي على أحرف فقط.' });
        }
        if (!validateEmail(formData.email)) {
            newErrors.email = t('emailError', { defaultValue: 'الرجاء إدخال بريد إلكتروني صحيح.' });
        }
        if (!validatePassword(formData.password)) {
            newErrors.password = t('passwordLengthError', { defaultValue: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.' });
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('passwordMismatchError', { defaultValue: 'كلمات المرور لا تتطابق.' });
        }

        setErrors(newErrors);

        const valid = Object.values(newErrors).every((error) => error === '');

        if (valid) {
            setLoading(true);
            try {
                const response = await registerUser({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.confirmPassword,
                });

                console.log("Server response:", response);

                // نافذة منبثقة لنجاح العملية
                toast.success(t('registrationSuccess', { defaultValue: 'تم التسجيل بنجاح!' }));

                setTimeout(() => {
                    setLoading(false);
                    navigate('/login'); // انتقال لصفحة تسجيل الدخول
                }, 3000);
            } catch (error) {
                setLoading(false);
                if (error.response && error.response.data && error.response.data.error) {
                    // عرض رسالة خطأ مخصصة إذا كان البريد الإلكتروني موجود مسبقًا
                    if (error.response.data.error.includes('email already exists')) {
                        toast.error(t('emailExistsError', { defaultValue: 'البريد الإلكتروني مستخدم بالفعل.' }));
                    } else {
                        toast.error(t('registrationFailed', { defaultValue: 'فشل التسجيل. الرجاء المحاولة مرة أخرى.' }));
                    }
                } else {
                    console.error("Error Details:", error.message);
                    toast.error(t('registrationFailed', { defaultValue: 'فشل التسجيل. الرجاء المحاولة مرة أخرى.' }));
                }
            }
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>{t('register')}</h2>
                <form onSubmit={handleSubmit}>
                    {['firstName', 'lastName', 'email'].map((field, index) => (
                        <div className="input-group" key={index}>
                            <label>{t(field)}:</label>
                            <input
                                type="text"
                                placeholder={t(field)}
                                name={field}
                                value={formData[field]}
                                onChange={handleInputChange}
                                required
                                className={errors[field] ? 'error' : ''}
                            />
                            {errors[field] && <div className="error-message">{errors[field]}</div>}
                        </div>
                    ))}
                    {['password', 'confirmPassword'].map((field, index) => (
                        <div className="input-group" key={index}>
                            <label>{t(field)}:</label>
                            <div className="input-wrapper">
                                <input
                                    type={field === 'confirmPassword' ? (showConfirmPassword ? 'text' : 'password') : (showPassword ? 'text' : 'password')}
                                    placeholder={t(field)}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleInputChange}
                                    required
                                    className={errors[field] ? 'error' : ''}
                                />
                                <span
                                    className="toggle-password"
                                    onClick={() => {
                                        if (field === 'password') {
                                            setShowPassword(!showPassword);
                                        } else {
                                            setShowConfirmPassword(!showConfirmPassword);
                                        }
                                    }}
                                >
                                    {field === 'password' ? (showPassword ? <FaEyeSlash /> : <FaEye />) : (showConfirmPassword ? <FaEyeSlash /> : <FaEye />)}
                                </span>
                            </div>
                            {errors[field] && <div className="error-message">{errors[field]}</div>}
                        </div>
                    ))}
                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? (
                            <>
                                <FaSpinner className="spinner" style={{ animation: 'spin 1s infinite linear', marginRight: '8px' }} />
                                {t('loading')}
                            </>
                        ) : (
                            t('register')
                        )}
                    </button>
                </form>

                {/* إضافة ToastContainer لعرض النوافذ المنبثقة */}
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={true} // دعم اتجاه اللغة العربية
                    pauseOnHover
                />
            </div>
        </div>
    );
};

export default Register;
