import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../UI/NavigationBar/NavigationBar';
import hcn_logo from '../../../Images/hcn_logo.png'
import './LoginPage.css';

const dummyUsers = [
  { email: 'admin@hcn.com', password: 'admin123', role: 'admin' },
  { email: 'employee@hcn.com', password: 'employee123', role: 'employee' }
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = dummyUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', user.role);
      if (user.role === 'admin') {
        navigate('/admin/home');
      } else if (user.role === 'employee') {
        navigate('/employee/home');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div>
        <NavigationBar isLoggedIn={localStorage.getItem('isLoggedIn') === 'true'} />
    
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

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#nothing">Forgot password?</a>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-btn">Sign in</button>
        </form>
        {/* <p className="signup-prompt">Want to join HCN? <span className="signup-link">Sign up!</span></p> */}
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
