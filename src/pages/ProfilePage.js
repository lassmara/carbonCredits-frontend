import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/auth/me', { withCredentials: true })
      .then(res => {
        const role = res.data.role;
        setUser(res.data);

        if (role === 'employee') {
          navigate('/dashboard');
        } else if (role === 'employer') {
          navigate('/employer-dashboard');
        }
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  return <p>Loading your dashboard...</p>;
};

export default ProfilePage;
