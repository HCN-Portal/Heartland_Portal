import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './EmployeeDashboard.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import Sidebar from '../Sidebar/Sidebar';
import { get_user_by_id } from '../../store/reducers/userReducer';

const EmployeeDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  
  // Get user info from auth state and user state
  const { userInfo } = useSelector(state => state.auth);
  const { selectedUser, loading } = useSelector(state => state.users);
  
  // Fetch user details when component mounts or when userInfo changes
  useEffect(() => {
    const fetchUserData = async () => {
      // Check if we have userInfo from localStorage (after reload)
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const userId = userInfo?.userId || storedUserInfo?.userId;
      
      if (userId && !selectedUser) {
        try {
          await dispatch(get_user_by_id(userId));
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [dispatch, userInfo?.userId, selectedUser]);

  // Get the display name with better fallback logic
  const getDisplayName = () => {
    // First try selectedUser (complete profile data)
    if (selectedUser?.firstName) {
      return `${selectedUser.firstName} ${selectedUser.lastName || ''}`.trim();
    }
    
    // Then try userInfo from Redux state
    if (userInfo?.firstName) {
      return `${userInfo.firstName} ${userInfo.lastName || ''}`.trim();
    }
    
    // Finally try localStorage (for page reloads)
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (storedUserInfo?.firstName) {
      return `${storedUserInfo.firstName} ${storedUserInfo.lastName || ''}`.trim();
    }
    
    return 'Employee';
  };

  const displayName = getDisplayName();

  // Show loading state while fetching user data
  if (isLoading || loading) {
    return (
      <div>
        <NavigationBar isLoggedIn={true} />
        <div className="employee-dashboard">
          <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="dashboard-main">
            <div className="employee-header">
              <h1>Employee Dashboard - Loading...</h1>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavigationBar isLoggedIn={true} />
     
      <div className="employee-dashboard">
         <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="dashboard-main">
          <div className="employee-header">
            <h1>Employee Dashboard - {displayName}</h1>
          </div>

          <div className="summary-cards-employee">
            <div className="card">
              <h3>Projects count</h3>
              <p className="card-number">2</p>
            </div>
            <div className="card">
              <h3>No. of Hours Worked this week</h3>
              <p className="card-number">32</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
