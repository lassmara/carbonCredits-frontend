import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EmployerLayout from './layouts/EmployerLayout';
import EmployerDashboard from './pages/employer/Dashboard';
import EmployerProfile from './pages/employer/Profile';
import EmployerRequests from './pages/employer/Requests';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Employer Layout with nested routes */}
        <Route path="/employer" element={<EmployerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} /> {/* default route */}
          <Route path="dashboard" element={<EmployerDashboard />} />
          <Route path="profile" element={<EmployerProfile />} />
          <Route path="requests" element={<EmployerRequests />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
