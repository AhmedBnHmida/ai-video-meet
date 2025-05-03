import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InterviewStatus, InterviewType } from '../models/types';
import { IUser } from '../models/User';

const AddInterviewForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("application");

  const [candidate, setCandidate] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [interviewers, setInterviewers] = useState<IUser[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [type, setType] = useState<InterviewType>(InterviewType.ONLINE);
  const [status] = useState<InterviewStatus>(InterviewStatus.SCHEDULED);
  const [location, setLocation] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (applicationId) fetchApplicationData(applicationId);
    fetchInterviewers();
  }, [applicationId]);

  const fetchApplicationData = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/application/GetById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidate(res.data.candidate.id);
    } catch (err) {
      console.error('Error fetching application details', err);
    }
  };

  const fetchInterviewers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/user/GetAll', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInterviewers(res.data);
    } catch (err) {
      console.error('Error fetching interviewers', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

//      const roomId = `meet-${Date.now()}`; 

      await axios.post(
        'http://localhost:5000/interview/Add',
        {
          application: applicationId,
          candidate,
          interviewer,
          scheduledDate,
          duration,
//          roomId,
          type,
          status,
          location: type === 'ONSITE' ? location : '',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMsg('✅ Interview created successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        navigate('/manage');
      }, 2000);
    } catch (error) {
      console.error('Error creating interview', error);
      alert('❌ Failed to create interview. Please check the server.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>➕ Add Interview</h2>

      {successMsg && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb',
          textAlign: 'center'
        }}>
          {successMsg}
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <label style={labelStyle}>👤 Interviewer</label>
        <select value={interviewer} onChange={(e) => setInterviewer(e.target.value)} required style={inputStyle}>
          <option value="">Select interviewer</option>
          {interviewers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName} | {user.email}
            </option>
          ))}
        </select>
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>📅 Scheduled Date</label>
        <input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} required style={inputStyle} />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>⏱ Duration (minutes)</label>
        <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} style={inputStyle} />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>📡 Interview Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as InterviewType)} style={inputStyle}>
          <option value="ONLINE">Online</option>
          <option value="ONSITE">Onsite</option>
        </select>
      </div>

      {type === 'ONSITE' && (
        <div style={inputGroupStyle}>
          <label style={labelStyle}>📍 Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />
        </div>
      )}

      <button type="submit" style={submitBtnStyle}>💾 Create Interview</button>
    </form>
  );
};

// Styles
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 500
};

const inputGroupStyle: React.CSSProperties = {
  marginBottom: '15px'
};

const submitBtnStyle: React.CSSProperties = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '12px 20px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  width: '100%',
  fontSize: '16px'
};

export default AddInterviewForm;
