import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [employer, setEmployer] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => {
        alert('Please login again');
        navigate('/login');
      });
  }, []);
  
  
  

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/auth/register-employee',
        { name, employerName: employer },
        { withCredentials: true }
      );
      window.location.reload(); // reload after registration
    } catch (err) {
      alert('Registration failed');
    }
  };

  if (loading) return <p>Loading...</p>;

  // If user is missing name or employer, show registration
  if (!user.name || !user.employer) {
    return (
      <div>
        <h2>Complete Your Registration</h2>
        <input
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br/>
        <input
          type="text"
          placeholder="Your employer's name"
          value={employer}
          onChange={(e) => setEmployer(e.target.value)}
        /><br/>
        <button onClick={handleRegister}>Submit</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default Dashboard;
