import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password });
      alert('Registration successful');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Registration failed');
    }
  };


  const handleGoHome = () => {
    navigate('/'); // Navigate to the home page
  };


  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="email"
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
      <button type="submit">Register</button>
      <button type="button" onClick={handleGoHome}>Go to Home</button>
    </form>
  );
};

export default Register;
