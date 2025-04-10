import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      const { token, role } = data;
      setToken(token); // Store the token in state or context
      localStorage.setItem('token', token); // Store the token in localStorage
  
      // Role-based navigation
      if (role === 'HR-MANAGER') {
        navigate('/manage'); // Redirect HR-MANAGER to /manage
      } else if (role === 'CANDIDATE') {
        navigate('/homeUser'); // Redirect CANDIDATE to /home
      } else {
        alert('Invalid role');
      }
    } catch (error) {
      console.error(error);
      alert('Invalid credentials');
    }
  };
  

  const handleGoHome = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={email}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      <button type="button" onClick={handleGoHome}>Go to Home</button>
    </form>
  );
};

export default Login;
