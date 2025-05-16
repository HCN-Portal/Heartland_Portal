// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import NavigationBar from '../UI/NavigationBar/NavigationBar';
// import hcn_logo from '../../Images/heartland_CN_logo.png';
// import './Login/LoginPage.css';
// import api from '../../api/api';
// import { messageClear } from '../../store/reducers/authReducer';

// const ResetPasswordPage = () => {
//   const { token } = useParams(); // Extract token from URL
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { successMessage, errorMessage } = useSelector((state) => state.auth); // Success and error messages from redux

//   // States for the new password, confirm password, error handling, and submitting state
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false); // For managing loading state

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Clear any previous errors
//     setError('');

//     // Check if all fields are filled
//     if (!newPassword || !confirmPassword) {
//       setError('All fields are required');
//       return;
//     }

//     // Check if the passwords match
//     if (newPassword !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//       setIsSubmitting(true); // Disable the button and show loading state
//       await api.post(`/auth/reset-password/${token}`, { password: newPassword });
//       dispatch(messageClear()); // Clear any message in the redux store
//       navigate('/login'); // Redirect to the login page after successful reset
//     } catch (err) {
//       setError(err.response?.data?.error || 'Password reset failed'); // Show error if any
//     } finally {
//       setIsSubmitting(false); // Re-enable the submit button after the API call
//     }
//   };

//   // Clear success and error messages after a short delay
//   useEffect(() => {
//     if (successMessage || errorMessage) {
//       const timer = setTimeout(() => {
//         dispatch(messageClear()); // Clear message after 3 seconds
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage, errorMessage, dispatch]);

//   return (
//     <div>
//       <NavigationBar isLoggedIn={false} /> {/* Navigation bar component */}

//       <div className="login-wrapper">
//         <div className="login-card">
//           <img src={hcn_logo} alt="HCN Logo" className="login-logo" /> {/* Logo image */}
//           <h2>Reset Your Password</h2> {/* Heading */}

//           <form onSubmit={handleSubmit}>
//             <label>New Password</label>
//             <input
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//             />

//             <label>Confirm New Password</label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />

//             {error && <p className="error-text">{error}</p>} {/* Show error if any */}

//             <button type="submit" className="login-btn" disabled={isSubmitting}>
//               {isSubmitting ? 'Resetting...' : 'Reset Password'} {/* Show loading text during submission */}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import hcn_logo from '../../Images/heartland_CN_logo.png';
import './Login/LoginPage.css';
import { resetPassword, messageClear } from '../../store/reducers/authReducer';

const ResetPasswordPage = () => {
  const { token } = useParams(); // for /reset-password/:token route
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, successMessage, errorMessage } = useSelector((state) => state.auth);
  const {userInfo} = useSelector((state) => state.auth);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFirstTime = location.pathname === '/reset-password/first-time';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    const result = await dispatch(
      resetPassword({ isFirstTime, password: newPassword, token })
    );

    if (resetPassword.fulfilled.match(result)) {
      const userRole = result.payload?.user?.role;

      if (userInfo.role === 'admin') {
        navigate('/admin/home');
      } else if (userInfo.role === 'employee') {
        navigate('/employee/home');
      } else {
        navigate('/login');
      }
    } else {
      setError(result.payload?.error || 'Password reset failed');
    }

    setIsSubmitting(false);
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
          <h2>{isFirstTime ? 'Set Your Password' : 'Reset Your Password'}</h2>
          <form onSubmit={handleSubmit}>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {(error || errorMessage) && (
              <p className="error-text">{error || errorMessage}</p>
            )}
            {successMessage && <p className="success-text">{successMessage}</p>}
            <button type="submit" className="login-btn" disabled={loading || isSubmitting}>
              {isSubmitting || loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;


