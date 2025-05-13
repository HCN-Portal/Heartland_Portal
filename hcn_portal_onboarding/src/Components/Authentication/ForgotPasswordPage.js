import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, messageClear } from '../../store/reducers/authReducer';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import hcn_logo from '../../Images/heartland_CN_logo.png';
import '../Authentication/Login/LoginPage.css';

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, successMessage, errorMessage } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError('Email is required');
    } else {
      setEmailError('');
      dispatch(forgotPassword(email));

    }
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        dispatch(messageClear());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div>
      <NavigationBar isLoggedIn={false} />

      <div className="login-wrapper">
        <div className="login-card">
          <img src={hcn_logo} alt="HCN Logo" className="login-logo" />
          <h2>Forgot your password?</h2>
          <p>Enter your email to receive reset instructions.</p>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <p className="error-text">{emailError}</p>}

            {successMessage && <p className="success-text">{successMessage}</p>}
            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
