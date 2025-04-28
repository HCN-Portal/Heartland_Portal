// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/LandingPage/LandingPage';
import ApplicationForm from './Components/ApplicationForm/ApplicationForm';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import PendingApplications from './Components/PendingApplications/PendingApplications';
import CurrentEmployees from './Components/CurrentEmployees/CurrentEmployees';
import LoginPage from './Components/Authentication/Login/LoginPage';


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/apply" element={<ApplicationForm />} />
      <Route path='/admin/home' element={<AdminDashboard />} />
      <Route path='/admin/pending' element={<PendingApplications />} />
      <Route path='/admin/employees' element={<CurrentEmployees />} />
      <Route path='/Login' element={<LoginPage />} />
      </Routes>
    </Router>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
