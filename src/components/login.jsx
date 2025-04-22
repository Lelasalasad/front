import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../App.css';
import { useTranslation } from 'react-i18next'; 
import { loginUser } from "../services/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const { t } = useTranslation(); 
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // تحقق مما إذا كان التوكن موجودًا
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/operations'); 
        }
    }, [navigate]);

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string()
                .email(t('invalidEmail', { defaultValue: 'البريد الإلكتروني غير صالح.' })) 
                .required(t('required', { defaultValue: 'هذا الحقل مطلوب.' })),
            password: Yup.string()
                .min(8, t('passwordLength', { defaultValue: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.' }))
                .required(t('required', { defaultValue: 'هذا الحقل مطلوب.' })),
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            setSubmitting(true);
            try {
                console.log("Data sent for login:", values);
                const response = await loginUser(values); 

                console.log("Server response:", response); 
                
                // تأكد من تخزين التوكن بشكل صحيح
                localStorage.setItem('token', response.data.access_token); // استخدم access_token
                console.log("Stored token:", localStorage.getItem('token'));
                
                toast.success(t('loginSuccess', { defaultValue: 'تم تسجيل الدخول بنجاح!' })); 
                
                setTimeout(() => {
                    setSubmitting(false);
                    navigate('/operations'); 
                }, 2000);
            } catch (error) {
                setSubmitting(false);
                if (error.response) {
                    console.error("Server Response Error Data:", error.response.data);
                } else {
                    console.error("Error Details:", error.message);
                }
                
                toast.error(t('invalidCredentials', { defaultValue: 'البيانات المدخلة غير صحيحة.' })); // نافذة منبثقة للفشل
                
                setErrors({ email: t('invalidCredentials', { defaultValue: 'البيانات المدخلة غير صحيحة' }) });
            }
        },
    });

    return (
        <motion.div
            className="container log"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="form-container log">
                <h2>{t('login')}</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="input-group">
                        <label>{t('email')}:</label>
                        <input
                            type="email"
                            name="email"
                            placeholder={t('email')}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            required
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="error-message">{formik.errors.email}</div>
                        ) : null}
                    </div>
                    <div className="input-group">
                        <label>{t('password')}:</label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder={t('password')}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {formik.touched.password && formik.errors.password ? (
                            <div className="error-message">{formik.errors.password}</div>
                        ) : null}
                    </div>
                    <button type="submit" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? (
                            <>
                                <FaSpinner className="spinner" style={{ marginRight: '8px', animation: 'spin 1s infinite linear' }} />
                                {t('loading')}
                            </>
                        ) : (
                            t('login')
                        )}
                    </button>
                </form>
                <div className="register-link">
                    <p>
                        {t('have_account')} <Link className='a' to="/register">{t('register')}</Link> |{" "}
                        <Link className='a' to="/ForgotPassword">{t('forgotPassword')}</Link>
                    </p>
                </div>

                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={true} 
                    pauseOnHover
                />
            </div>
        </motion.div>
    );
};

export default Login;