import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
