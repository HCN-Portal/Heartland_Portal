import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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

// Employee Pages
import EmployeeDashboard from './Components/EmployeeDashboard/EmployeeDashboard';
import EmployeeProfile from './Components/EmployeeProfile/EmployeeProfile';
import EmployeeProjects from './Components/EmployeeProjects/Projects';
import EmployeeClockify from './Components/EmployeeClockify/ClockifyPage';
import EmployeeHelp from './Components/EmployeeHelp/HelpPage';



function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Admin Routes */}
        <Route path="/admin/home" element={<AdminDashboard />} />
        <Route path="/admin/pending" element={<PendingApplications />} />
        <Route path="/admin/employees" element={<CurrentEmployees />} />

        {/* Employee Routes */}
        <Route path="/employee/home" element={<EmployeeDashboard />} />
        <Route path="/employee/profile" element={<EmployeeProfile />} />
        <Route path="/employee/projects" element={<EmployeeProjects />} />
        <Route path="/employee/clockify" element={<EmployeeClockify />} />
        <Route path="/employee/help" element={<EmployeeHelp />} />


      </Routes>
    </Router>
  );
}

export default App;
