import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { InterviewStatus, InterviewType } from '../models/types';
import { IUser } from '../models/User';

const EditInterviewForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interviewer, setInterviewer] = useState('');
  const [interviewers, setInterviewers] = useState<IUser[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [duration, setDuration] = useState(30);
  const [roomId, setRoomId] = useState('');
  const [type, setType] = useState<InterviewType>(InterviewType.ONLINE);
  const [status, setStatus] = useState<InterviewStatus>(InterviewStatus.SCHEDULED);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchInterview(id);
      fetchInterviewers();
    }
  }, [id]);

  const fetchInterview = async (interviewId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/interview/GetById/${interviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setInterviewer(data.interviewer);
      setScheduledDate(data.scheduledDate);
      setDuration(data.duration);
      setRoomId(data.roomId);
      setType(data.type);
      setStatus(data.status);
      setLocation(data.location);
      setNotes(data.notes || '');
    } catch (err) {
      console.error('Error fetching interview', err);
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
      await axios.put(`http://localhost:5000/interview/Update/${id}`, {
        interviewer,
        scheduledDate,
        duration,
        roomId,
        type,
        status,
        location: type === 'ONSITE' ? location : '',
        notes,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg('✅ Interview updated successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        navigate('/manage');
      }, 2000);
    } catch (error) {
      console.error('Error updating interview', error);
      alert('❌ Failed to update interview.');
    }
  };

  const roomOptions = [
    { value: 'room1', label: 'Room 1' },
    { value: 'room2', label: 'Room 2' },
    { value: 'room3', label: 'Room 3' },
    { value: 'room4', label: 'Room 4' },
  ];

  return (
    <form onSubmit={handleSubmit} style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>📝 Edit Interview</h2>

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

      <div style={inputGroupStyle}>
        <label style={labelStyle}>👤 Interviewer</label>
        <select value={interviewer} onChange={(e) => setInterviewer(e.target.value)} required style={inputStyle}>
          <option value="">Select interviewer</option>
          {interviewers.map((user) => (
            <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
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
        <label style={labelStyle}>🏠 Room</label>
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)} required style={inputStyle}>
          <option value="">Select room</option>
          {roomOptions.map((room) => (
            <option key={room.value} value={room.value}>{room.label}</option>
          ))}
        </select>
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

      <div style={inputGroupStyle}>
        <label style={labelStyle}>🗒 Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} style={inputStyle} />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>📌 Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as InterviewStatus)} style={inputStyle}>
          <option value="scheduled">Scheduled</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="done">Done</option>
        </select>
      </div>

      <button type="submit" style={submitBtnStyle}>💾 Update Interview</button>
    </form>
  );
};

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
  backgroundColor: '#28a745',
  color: 'white',
  padding: '12px 20px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  width: '100%',
  fontSize: '16px'
};

export default EditInterviewForm;