// src/components/Profile.jsx

import React, { useContext, useState, useEffect } from 'react';
import '../App.css';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaKey } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from './AppContext';
import axios from 'axios';

const Profile = () => {
  const { t } = useTranslation();
  const { user, setUser } = useContext(AppContext);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    account_number: '',
    full_name: '',
    email: '',
    job: '',
    phone: '',
    address: '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  // جلب البيانات عند التحميل
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('http://127.0.0.1:8000/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (data.success) {
          setProfileData({
            account_number: data.data.account_number,
            full_name: data.data.full_name,
            email: data.data.email,
            job: data.data.job || '',
            phone: data.data.phone || '',
            address: data.data.address || '',
          });
        }
      } catch {
        toast.error(t('errorFetchingProfile'));
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [t]);

  // معالجة تغييرات الحقول
  const handleProfileChange = e => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // حفظ التعديلات
  const saveProfile = async () => {
    try {
      const payload = {
        job: profileData.job,
        phone: profileData.phone,
        address: profileData.address,
      };
      // تحديث عبر API
      const { data } = await axios.put(
        'http://127.0.0.1:8000/api/profile/update',
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (data.success) {
        // إعادة جلب بيانات محدثة
        const { data: refreshed } = await axios.get(
          'http://127.0.0.1:8000/api/profile',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        if (refreshed.success) {
          setProfileData({
            account_number: refreshed.data.account_number,
            full_name: refreshed.data.full_name,
            email: refreshed.data.email,
            job: refreshed.data.job || '',
            phone: refreshed.data.phone || '',
            address: refreshed.data.address || '',
          });
          setUser(prev => ({
            ...prev,
            job: refreshed.data.job,
            phone: refreshed.data.phone,
            address: refreshed.data.address
          }));
        }
        setIsEditing(false);
        toast.success(t('savedSuccessfully'));
      }
    } catch {
      toast.error(t('updateError'));
    }
  };

  // معالجة تغيير كلمة المرور
  const handlePasswordChange = e => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // حفظ كلمة المرور الجديدة
  const savePassword = async () => {
    try {
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/profile/change-password',
        passwordData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (data.success) {
        setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' });
        setIsChangingPassword(false);
        toast.success(data.message);
      }
    } catch (err) {
      const msg = err.response?.data?.message || t('updateError');
      toast.error(msg);
    }
  };

  if (loadingProfile) return <div>{t('loading')}...</div>;

  return (
    <div className="container">
      <div className="form-container profile-container">
        <div
          className="profile-header"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <h2 style={{ marginRight: 'auto' }}>{t('Profile')}</h2>
          <FaEdit
            onClick={() => { setIsChangingPassword(false); setIsEditing(e => !e); }}
            title={t('edit')}
            style={{ cursor: 'pointer', marginRight: '1rem', fontSize: '1.5rem' }}
          />
          <FaKey
            onClick={() => { setIsEditing(false); setIsChangingPassword(c => !c); }}
            title={t('changePassword')}
            style={{ cursor: 'pointer', fontSize: '1.5rem' }}
          />
        </div>

        {!isChangingPassword ? (
          <form>
            {['account_number','full_name','email'].map((field, idx) => (
              <div key={idx} className="input-group">
                <label>{t(field)}:</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={profileData[field]}
                  disabled
                  className="profile-input"
                />
              </div>
            ))}
            {['job','phone','address'].map((field, idx) => (
              <div key={idx} className="input-group">
                <label>{t(field)}:</label>
                <input
                  type="text"
                  name={field}
                  value={profileData[field]}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="profile-input"
                />
              </div>
            ))}

            {isEditing && (
              <button type="button" onClick={saveProfile} className="submit-button">
                {t('save')}
              </button>
            )}
          </form>
        ) : (
          <form>
            {['current_password','new_password','new_password_confirmation'].map((field, idx) => (
              <div key={idx} className="input-group">
                <label>{t(field)}:</label>
                <input
                  type="password"
                  name={field}
                  value={passwordData[field]}
                  onChange={handlePasswordChange}
                  className="profile-input"
                />
              </div>
            ))}
            <button type="button" onClick={savePassword} className="submit-button">
              {t('changePassword')}
            </button>
          </form>
        )}

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default Profile;
