import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Interview {
  _id: string;
  application: string;
  interviewer: any;
  candidate: any;
  type: string;
  status: string;
  scheduledDate: string;
  duration: number;
  location?: string;
  roomId?: string;
  createdAt: string;
}

const InterviewDetail: React.FC = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/interview/GetById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInterview(res.data);
    } catch (error) {
      console.error('Error fetching interview', error);
    }
  };

  const handleAction = async (action: 'Accept' | 'Reject') => {
    if (!interview) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/interview/${action}/${interview._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchInterview(); // refresh status
      alert(`Interview ${action.toLowerCase()}ed successfully!`);
    } catch (error) {
      alert(`Failed to ${action.toLowerCase()} interview.`);
    } finally {
      setLoading(false);
    }
  };

  if (!interview) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>⏳ Loading interview...</p>;
  }

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🎤 Interview Details</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr><td><strong>📌 Status:</strong></td><td>{interview.status}</td></tr>
          <tr><td><strong>👤 Interviewer:</strong></td><td>{interview.interviewer?.email || interview.interviewer}</td></tr>
          <tr><td><strong>👤 Candidate:</strong></td><td>{interview.candidate?.email || interview.candidate}</td></tr>
          <tr><td><strong>📅 Date:</strong></td><td>{new Date(interview.scheduledDate).toLocaleString()}</td></tr>
          <tr><td><strong>⏱ Duration:</strong></td><td>{interview.duration} minutes</td></tr>
          <tr><td><strong>🧭 Type:</strong></td><td>{interview.type}</td></tr>
          {interview.location && <tr><td><strong>📍 Location:</strong></td><td>{interview.location}</td></tr>}
          {interview.roomId && <tr><td><strong>🏠 Room:</strong></td><td>{interview.roomId}</td></tr>}
          <tr><td><strong>📅 Created At:</strong></td><td>{new Date(interview.createdAt).toLocaleString()}</td></tr>
        </tbody>
      </table>
{/*
      {interview.status === 'SCHEDULED' && (
        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <button
            onClick={() => handleAction('Accept')}
            disabled={loading}
            style={actionBtnStyle("#28a745")}
          >
            ✅ Accept
          </button>
          <button
            onClick={() => handleAction('Reject')}
            disabled={loading}
            style={actionBtnStyle("#dc3545")}
          >
            ❌ Reject
          </button>
        </div>
      )}
*/} 
    </div>
  );
};

const actionBtnStyle = (bgColor: string): React.CSSProperties => ({
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  margin: '0 10px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px'
});

export default InterviewDetail;
