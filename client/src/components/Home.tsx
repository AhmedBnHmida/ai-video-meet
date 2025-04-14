import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { token } = useAuth();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👋 Welcome to the Interview Platform</h1>

      {token ? (
        <div>
          <p style={styles.message}>✅ You are logged in!</p>
          <Link to="/logout" style={styles.buttonLogout}>Logout</Link>
        </div>
      ) : (
        <div>
          <p style={styles.message}>🔒 You are not logged in.</p>
          <div style={styles.buttonGroup}>
            <Link to="/login" style={styles.buttonLogin}>Login</Link>
            <Link to="/register" style={styles.buttonRegister}>Register</Link>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f8f9fa',
    height: '100vh',
  },
  title: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#333',
  },
  message: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#555',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  buttonLogin: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  buttonRegister: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  buttonLogout: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Home;
