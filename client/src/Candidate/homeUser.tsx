import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomeUser = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  const jobs = [
    { id: 'job1', title: 'Frontend Developer' },
    { id: 'job2', title: 'Backend Developer' },
    { id: 'job3', title: 'Fullstack Engineer' },
    { id: 'job4', title: 'DevOps Specialist' },
  ];

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to your Dashboard!</h1>
      <p>You are successfully logged in.</p>

      {/* Buttons */}
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={handleLogout}
          style={{
            marginRight: '10px',
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

        <button
          onClick={() => navigate('/my-applications')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          My Applications
        </button>
      </div>

      {/* Job List */}
      <h2>Available Jobs</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {jobs.map((job) => (
          <li key={job.id} style={{ marginBottom: '15px' }}>
            <span style={{ marginRight: '10px', fontWeight: 'bold' }}>{job.title}</span>
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  const user = JSON.parse(localStorage.getItem('user') || '{}');
                  const response = await fetch('http://localhost:5000/application/Add', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      jobPost: job.id,
                      candidate: user.id,
                      status: 'SUBMITTED'
                    }),
                  });

                  if (response.ok) {
                    alert('Application submitted successfully!');
                  } else {
                    alert('Failed to submit application.');
                  }
                } catch (err) {
                  console.error('Error:', err);
                  alert('Something went wrong.');
                }
              }}
              style={{
                backgroundColor: '#ffc107',
                color: '#000',
                padding: '5px 10px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              ➕ Apply
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default HomeUser;
