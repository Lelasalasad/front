import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Logout = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            localStorage.removeItem('token');
            toast.success(t('logoutSuccess', { defaultValue: 'تم تسجيل الخروج بنجاح!' }));

            // تأخير إعادة التوجيه بعد عرض النافذة المنبثقة
            const timer = setTimeout(() => {
                navigate('/login');
            }, 2000);

            return () => clearTimeout(timer); // تنظيف المؤقت
        } else {
            navigate('/login');
        }
    }, [navigate, t]);

    return null; // ليس هناك ما يجب عرضه
};

export default Logout;