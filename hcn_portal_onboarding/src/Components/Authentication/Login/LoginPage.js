import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, messageClear } from '../../../store/reducers/authReducer';
import NavigationBar from '../../UI/NavigationBar/NavigationBar';
import hcn_logo from '../../../Images/hcn_logo.png';
import './LoginPage.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, userInfo, loading, successMessage, errorMessage } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Field-level error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Handle form submission
  const handleLogin = (e) => {
    e.preventDefault();

    let valid = true;

    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      dispatch(loginUser({ email, password }));
    }
  };

  // Auto-clear success or error messages
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        dispatch(messageClear());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage, dispatch]);

  // Handle navigation based on role after successful login
  useEffect(() => {
    if (token && userInfo?.role) {
      if (userInfo.role === 'admin') {
        navigate('/admin/home');
      } else if (userInfo.role === 'employee') {
        navigate('/employee/home');
      }
    }
  }, [token, userInfo, navigate]);

  // Show backend error under password field
  useEffect(() => {
    if (errorMessage === 'Invalid email or password') {
      setPasswordError(errorMessage);
    }
  }, [errorMessage]);

  return (
    <div>
      <NavigationBar isLoggedIn={!!token} />

      <div className="login-wrapper">
        <div className="login-card">
          <img src={hcn_logo} alt="HCN Logo" className="login-logo" />
          <h2>Welcome! Please enter your details.</h2>
          
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <p className="error-text">{emailError}</p>}

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && <p className="error-text">{passwordError}</p>}

            <div className="login-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#nothing">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
