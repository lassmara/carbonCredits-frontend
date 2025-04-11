// import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// import axios from 'axios';
import EmployeeActions from '../components/EmployeeActions';
import EmployerDashboard from '../components/EmployerDashboard';

const Dashboard = () => {
  const [params] = useSearchParams();
  const role = params.get('role');
  const email = params.get('email');

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <p>Email: {email}</p>
      <p>Role: {role}</p>

      {role === 'employee' && <EmployeeActions />}
      {role === 'employer' && <EmployerDashboard />}
    </div>
  );
};

export default Dashboard;
