import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployerDashboard = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/points/requests', {
        withCredentials: true,
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests', err);
    }
  };

  const handleDecision = async (id, decision) => {
    try {
      await axios.post(
        `http://localhost:5000/api/points/requests/${id}/decision`,
        { decision },
        { withCredentials: true }
      );
      fetchRequests(); // Refresh list
    } catch (err) {
      alert('Error updating request');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <h3>Pending Employee Requests</h3>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req._id}>
              <p>
                <strong>{req.employee.email}</strong> requested{' '}
                <em>{req.option}</em> ({req.points} pts)
              </p>
              <button onClick={() => handleDecision(req._id, 'approved')}>
                Approve
              </button>
              <button onClick={() => handleDecision(req._id, 'dismissed')}>
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployerDashboard;
