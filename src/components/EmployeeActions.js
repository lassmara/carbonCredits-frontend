import React from 'react';
import axios from 'axios';

const EmployeeActions = () => {
  const handleRequest = async (option) => {
    try {
        axios.post('http://localhost:5000/api/points/request', 
            { option },
            { withCredentials: true }
          );
          
      alert(`Request submitted for ${option}`);
    } catch (err) {
      alert('Error submitting request');
    }
  };

  return (
    <div>
      <h3>Request Points</h3>
      <button onClick={() => handleRequest('car')}>Car (10 pts)</button>
      <button onClick={() => handleRequest('remote working')}>Remote Work (20 pts)</button>
      <button onClick={() => handleRequest('other')}>Other (30 pts)</button>
    </div>
  );
};

export default EmployeeActions;
