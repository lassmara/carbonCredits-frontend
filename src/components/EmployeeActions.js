import React from 'react';
import axios from 'axios';

const EmployeeActions = () => {
  const handleRequest = async (option) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/points/request',
        { option },
        { withCredentials: true }
      );

      alert(`✅ Request submitted for ${option}`);
      console.log("Response:", response.data);
    } catch (err) {
      console.error("❌ Error submitting request:", err.response?.data || err.message);
      alert(`❌ Error: ${err.response?.data?.message || "Request failed"}`);
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
