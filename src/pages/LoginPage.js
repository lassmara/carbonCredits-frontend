import React from 'react';

const LoginPage = () => {
  const googleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={googleLogin}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
