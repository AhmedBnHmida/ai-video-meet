import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!token) return null; // Hide header if user is not logged in

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#343a40',
      color: 'white',
    }}>
      <h2 style={{ margin: 0 }}>🎯 Video Meet AI</h2>

      <div>
        {user.role === 'HR-MANAGER' && (
          <>
            <button onClick={() => navigate('/HomeHR')} style={btnStyle}>📋 Applications</button>
            <button onClick={() => navigate('/manage')} style={btnStyle}>🎤 Interviews</button>
          </>
        )}

        {user.role === 'CANDIDATE' && (
          <>
            <button onClick={() => navigate('/HomeUser')} style={btnStyle}>🏠 Dashboard</button>
            <button onClick={() => navigate('/my-applications')} style={btnStyle}>📄 My Applications</button>
            <button onClick={() => navigate('/my-interviews')} style={btnStyle}>🎤 My Interviews</button>
          </>
        )}

        <button onClick={handleLogout} style={{ ...btnStyle, backgroundColor: '#dc3545' }}>
          🔓 Logout
        </button>
      </div>
    </header>
  );
};

const btnStyle: React.CSSProperties = {
  marginLeft: '10px',
  padding: '8px 14px',
  fontSize: '14px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default Header;
