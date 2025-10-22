import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../src/Components/PrivateRoute'; 

// Public Pages
import LandingPage from './Components/LandingPage/LandingPage';
import ApplicationForm from './Components/ApplicationForm/ApplicationForm';
import LoginPage from './Components/Authentication/Login/LoginPage';
import ForgotPasswordPage from './Components/Authentication/ForgotPasswordPage';
import ResetPasswordPage from './Components/Authentication/ResetPasswordPage';

// Admin Pages
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import PendingApplications from './Components/PendingApplications/PendingApplications';
import CurrentEmployees from './Components/CurrentEmployees/CurrentEmployees';
import Projects from './Components/Projects/Projects';

// Employee Pages
import EmployeeDashboard from './Components/EmployeeDashboard/EmployeeDashboard';
import EmployeeProfile from './Components/EmployeeProfile/EmployeeProfile';
import EmployeeProjects from './Components/EmployeeProjects/Projects';
import EmployeeClockify from './Components/EmployeeClockify/ClockifyPage';
import EmployeeHelp from './Components/EmployeeHelp/HelpPage';
import ProjectsEmployee from './Components/ProjectsEmployee/ProjectsEmployee';

import ProjectsManager from './Components/ProjectsManager/ProjectsManager';



function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/first-time" element={<ResetPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Admin Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin/home" element={<AdminDashboard />} />
          <Route path="/admin/pending" element={<PendingApplications />} />
          <Route path="/admin/employees" element={<CurrentEmployees />} />
          <Route path="/admin/projects" element={<Projects />} />
          {/* Just for test as unable to login to Employee Dashboard */}
          <Route path='/admin/managerprojects' element={<ProjectsManager />} />
        </Route>

        {/* Employee Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={['employee']} />}>
          <Route path="/employee/home" element={<EmployeeDashboard />} />
          <Route path="/employee/profile" element={<EmployeeProfile />} />
          {/* <Route path="/employee/projects" element={<EmployeeProjects />} /> */}
          <Route path="/employee/clockify" element={<EmployeeClockify />} />
          <Route path="/employee/help" element={<EmployeeHelp />} />
          <Route path="/employee/projects" element={<ProjectsEmployee />} />
          <Route path="/employee/managerprojects" element={<ProjectsManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
