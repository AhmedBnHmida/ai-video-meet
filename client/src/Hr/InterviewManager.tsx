import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IInterview } from '../models/Interview';

const InterviewManager: React.FC = () => {
  const [interviews, setInterviews] = useState<IInterview[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/interview/GetAll', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInterviews(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch interviews', error);
    }
  };

  const deleteInterview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this interview?')) return;
    if (!id) {
      console.error("❌ Interview ID is undefined");
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/interview/Delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Interview deleted");
      fetchInterviews();
      // Refresh list if needed
    } catch (error) {
      console.error('❌ Failed to delete interview', error);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🎤 Interview Manager</h2>

      {/* Add Interview Button 
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/addInterview')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          ➕ Add Interview
        </button>
      </div>*/}

      {/* Table */}
      {interviews.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>No interviews available.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={thStyle}>👤 Candidate</th>
              <th style={thStyle}>📅 Date</th>
              <th style={thStyle}>📌 Status</th>
              <th style={thStyle}>🔗 Room ID</th>
              <th style={thStyle}>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview) => (
              <tr key={String(interview._id)} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>
                  {
                    typeof interview.candidate === 'object' && 'firstName' in interview.candidate
                      ? `${(interview.candidate as any).firstName} ${(interview.candidate as any).lastName}`
                      : 'N/A'
                  }
                </td>
                <td style={tdStyle}>
                  {new Date(interview.scheduledDate).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td style={tdStyle}>
                  <span style={{
                    backgroundColor: statusColor(interview.status),
                    padding: '5px 10px',
                    color: '#fff',
                    borderRadius: '5px',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                  }}>
                    {interview.status}
                  </span>
                </td>
                <td style={tdStyle}>{interview.roomId || '-'}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => navigate(`/editInterview/${interview._id}`)}
                    style={{ ...actionBtnStyle, backgroundColor: '#007bff' }}
                  >
                    📝 Edit
                  </button>
                  <button
                    onClick={() => deleteInterview(String(interview._id))}
                    style={{ ...actionBtnStyle, backgroundColor: '#dc3545' }}
                  >
                    🗑 Delete
                  </button>
                  <button
                    onClick={() => navigate(`/interview/${interview._id}`)}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    🔍 View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'left',
  backgroundColor: '#f1f1f1',
  fontWeight: 'bold',
};

const tdStyle: React.CSSProperties = {
  padding: '10px',
};

const actionBtnStyle: React.CSSProperties = {
  color: 'white',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '5px',
  marginRight: '8px',
  cursor: 'pointer',
  fontSize: '13px',
};

const statusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'scheduled': return '#17a2b8';
    case 'accepted': return '#28a745';
    case 'rejected': return '#dc3545';
    case 'done': return '#6c757d';
    default: return '#888';
  }
};

export default InterviewManager;
