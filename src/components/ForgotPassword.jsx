import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import '../App.css';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [submitted, setSubmitted] = useState(false);

    const formik = useFormik({
        initialValues: { email: '' },
        validationSchema: Yup.object({
            email: Yup.string()
                .email(t('invalidEmail'))
                .required(t('required')),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
                // إرسال الطلب إلى السيرفر
                console.log("Sending password reset request:", values);
                toast.success(t('resetLinkSent'));
                setSubmitted(true);
            } catch (error) {
                console.error(error);
                toast.error(t('errorOccurred'));
            } finally {
                setSubmitting(false);
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
                <h2>{t('forgotPassword')}</h2>
                {!submitted ? (
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
                            {formik.touched.email && formik.errors.email && (
                                <div className="error-message">{formik.errors.email}</div>
                            )}
                        </div>
                        <button type="submit" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? t('loading') : t('sendResetLink')}
                        </button>
                    </form>
                ) : (
                    <p className="success-message">{t('checkYourEmail')}</p>
                )}
                <p style={{ marginTop: '15px' }}>
                    <Link className="a" to="/login">{t('backToLogin')}</Link>
                </p>
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

export default ForgotPassword;
