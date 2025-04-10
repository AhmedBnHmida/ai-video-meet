import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { token } = useAuth();

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {token ? (
        <div>
          <p>You are logged in!</p>
          <Link to="/logout">Logout</Link>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
