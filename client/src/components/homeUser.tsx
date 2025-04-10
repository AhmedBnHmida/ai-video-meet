import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const HomeUser = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth(); // Get setToken from AuthContext

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setToken(null); // Clear the token from AuthContext
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to your Dashboard!</h1>
      <p>You are successfully logged in.</p>
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default HomeUser;
