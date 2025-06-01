import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyEmailCode, registerUser } from "../services/api";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const p = localStorage.getItem("pendingRegistration");
    if (!p) {
      toast.error("No pending registration.");
      navigate("/register", { replace: true });
      return;
    }
    const parsed = JSON.parse(p);
    setPending(parsed);
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter the verification code.");
      return;
    }
    setLoading(true);
    try {
      await verifyEmailCode(pending.email, code);
      localStorage.removeItem("pendingRegistration");
      toast.success("Email verified! Redirecting to login...");
      +setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Verify Your Email</h2>
        <form onSubmit={handleVerify}>
          <div className="input-group">
            <label>Email:</label>
            <input type="email" value={pending?.email || ""} disabled />
          </div>
          <div className="input-group">
            <label>Verification Code:</label>
            <input
              type="text"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button disabled={loading} className="submit-button">
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Verifying...
              </>
            ) : (
              "Verify & Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
