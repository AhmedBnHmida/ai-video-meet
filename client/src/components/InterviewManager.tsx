import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InterviewType, InterviewStatus } from '../models/types';
import { Interview, InterviewInput } from '../models/Interview';
import { User } from '../models/User';

interface InterviewWithUsers extends Interview {
  interviewerName?: string;
  candidateName?: string;
}

const InterviewManager: React.FC = () => {
  const [interviews, setInterviews] = useState<InterviewWithUsers[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Store the list of users
  const [formData, setFormData] = useState<InterviewInput>({
    applicationId: '',
    interviewerId: '',
    candidateId: '',
    type: InterviewType.ONLINE,
    status: InterviewStatus.SCHEDULED,
    scheduledDate: new Date(),
    duration: 60,
    location: '',
    notes: '',
    feedbackIds: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users and interviews on mount
  useEffect(() => {
    fetchUsers();
    fetchInterviews();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<User[]>('http://localhost:5000/user/users');
      setUsers(response.data); // Set the fetched users
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Interview[]>('http://localhost:5000/interview/interviews');
      const interviewsData = response.data;

      // Fetch user data for interviewer and candidate
      const interviewsWithUsers = await Promise.all(
        interviewsData.map(async (interview) => {
          const [interviewer, candidate] = await Promise.all([
            fetchUser(interview.interviewerId),
            fetchUser(interview.candidateId),
          ]);
          return {
            ...interview,
            interviewerName: interviewer ? `${interviewer.firstName} ${interviewer.lastName}` : 'Unknown',
            candidateName: candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown',
          };
        })
      );

      setInterviews(interviewsWithUsers);
    } catch (err) {
      setError('Failed to fetch interviews. Please try again.');
      console.error('Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (userId: string): Promise<User | null> => {
    try {
      const response = await axios.get<User>(`http://localhost:5000/user/users/${userId}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching user ${userId}:`, err);
      return null;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'scheduledDate') {
      setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
    } else if (name === 'duration') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (editingId) {
        // Update status only (for simplicity)
        await axios.patch(`http://localhost:5000/interview/${editingId}/status`, {
          status: formData.status,
        });
        setEditingId(null);
      } else {
        // Create new interview
        await axios.post('http://localhost:5000/interview/interviews', formData);
      }
      setFormData({
        applicationId: '',
        interviewerId: '',
        candidateId: '',
        type: InterviewType.ONLINE,
        status: InterviewStatus.SCHEDULED,
        scheduledDate: new Date(),
        duration: 60,
        location: '',
        notes: '',
        feedbackIds: [],
      });
      fetchInterviews(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save interview. Please try again.');
      console.error('Error saving interview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (interview: Interview) => {
    setEditingId(interview.id);
    setFormData({
      applicationId: interview.applicationId,
      interviewerId: interview.interviewerId,
      candidateId: interview.candidateId,
      type: interview.type,
      status: interview.status,
      scheduledDate: new Date(interview.scheduledDate),
      duration: interview.duration,
      location: interview.location,
      notes: interview.notes,
      feedbackIds: interview.feedbackIds || [], // Ensure feedbackIds is an array
    });
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/interview/delete/${id}`);
      fetchInterviews(); // Refresh the list
    } catch (err: any) {
      setError('Failed to delete interview. Please try again.');
      console.error('Error deleting interview:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>HR Interview Management</h2>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {loading && <div>Loading...</div>}

      {/* Form for creating/updating interviews */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <h3>{editingId ? 'Update Interview Status' : 'Create New Interview'}</h3>
        {!editingId && (
          <>
            <div>
              <label>Application ID: </label>
              <input
                type="text"
                name="applicationId"
                value={formData.applicationId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Interviewer: </label>
              <select
                name="interviewerId"
                value={formData.interviewerId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Interviewer</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {`${user.firstName} ${user.lastName}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Candidate: </label>
              <select
                name="candidateId"
                value={formData.candidateId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Candidate</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {`${user.firstName} ${user.lastName}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Type: </label>
              <select name="type" value={formData.type} onChange={handleInputChange} required>
                {Object.values(InterviewType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Scheduled Date: </label>
              <input
                type="datetime-local"
                name="scheduledDate"
                value={
                  formData.scheduledDate
                    ? new Date(formData.scheduledDate).toISOString().slice(0, 16)
                    : ''
                }
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Duration (minutes): </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
            <div>
              <label>Location (e.g., Zoom URL or Address): </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Notes: </label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} />
            </div>
          </>
        )}
        <div>
          <label>Status: </label>
          <select name="status" value={formData.status} onChange={handleInputChange} required>
            {Object.values(InterviewStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {editingId ? 'Update Status' : 'Create Interview'}
        </button>
        {editingId && (
          <button type="button" onClick={() => setEditingId(null)}>
            Cancel Edit
          </button>
        )}
      </form>

      {/* List interviews */}
      <h3>Interviews</h3>
      <table>
        <thead>
          <tr>
            <th>Interviewer</th>
            <th>Candidate</th>
            <th>Scheduled Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {interviews.map((interview) => (
            <tr key={interview.id}>
              <td>{interview.interviewerName}</td>
              <td>{interview.candidateName}</td>
              <td>{new Date(interview.scheduledDate).toLocaleString()}</td>
              <td>{interview.status}</td>
              <td>
                <button onClick={() => handleEdit(interview)}>Edit</button>
                <button onClick={() => handleDelete(interview.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InterviewManager;
