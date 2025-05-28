import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function handleApiError(error) {
  if (error.response) {
    const { data, status } = error.response;
    if (data && data.message) throw new Error(data.message);
    if (status === 422 && data.errors) {
      const msgs = Object.values(data.errors).flat().join('\n');
      throw new Error(msgs);
    }
    throw new Error(`Server responded with status ${status}`);
  }
  throw new Error('Network error – please check your connection');
}

// استدعاء تسجيل المستخدم (يرسل رمز التحقق أيضاً)
export const registerUser = async (userData) => {
  try {
    const { data } = await axios.post(`${API_URL}/register`, userData);
    return data; // { success: true, message: "...", ... }
  } catch (error) {
    handleApiError(error);
  }
};

// استدعاء تسجيل الدخول
export const loginUser = async (credentials) => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, credentials);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const verifyEmailCode = async (email, code) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/verify_email`,
      { email, verification_code: code }
    );
    return data;
  } catch (error) {
    handleApiError(error);
  }
};
