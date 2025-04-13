import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

const EmployerDashboard = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch logged-in employer info
  useEffect(() => {
    axios.get('/auth/me', { withCredentials: true })
      .then(res => {
        if (res.data.role !== 'employer') {
          navigate('/');
        } else {
          setUser(res.data);
          fetchRequests();
        }
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  // Fetch pending point requests
  const fetchRequests = () => {
    axios.get('/api/points/requests', { withCredentials: true })
      .then(res => setRequests(res.data))
      .catch(err => console.error('Failed to load requests', err));
  };

  // Approve or dismiss request
  const handleDecision = async (id, decision) => {
    try {
      await axios.post(`/api/points/requests/${id}/decision`,
        { decision },
        { withCredentials: true }
      );
      fetchRequests(); // Refresh list after decision
    } catch (err) {
      console.error(`Failed to ${decision} request`, err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Employer Dashboard</h1>
      <p>Logged in as: <strong>{user.email}</strong></p>

      <h2>Pending Point Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests ✅</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Option</th>
              <th>Points</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req._id}>
                <td>{req.employee?.email || 'Unknown'}</td>
                <td>{req.option}</td>
                <td>{req.points}</td>
                <td>
                  <button onClick={() => handleDecision(req._id, 'approved')}>✅ Approve</button>
                  <button onClick={() => handleDecision(req._id, 'dismissed')}>❌ Dismiss</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployerDashboard;
