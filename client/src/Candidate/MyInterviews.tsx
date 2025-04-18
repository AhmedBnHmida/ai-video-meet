import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface IInterview {
  _id: string;
  scheduledDate: string;
  status: string;
  meetingLink: string;
}

const MyInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<IInterview[]>([]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const res = await axios.get(`http://localhost:5000/interview/GetByUser/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInterviews(res.data);
    } catch (err) {
      console.error('Error fetching interviews', err);
    }
  };

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#ffc107';
      case 'accepted':
        return '#28a745';
      case 'rejected':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🎤 My Interviews</h2>

      {interviews.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No interviews scheduled.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px' }}>📅 Scheduled At</th>
              <th style={{ padding: '10px' }}>📌 Status</th>
              <th style={{ padding: '10px' }}>🔗 Link</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview) => (
              <tr key={interview._id} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '10px' }}>
                  {new Date(interview.scheduledDate).toLocaleString()}
                </td>
                <td style={{ padding: '10px' }}>
                  <span
                    style={{
                      backgroundColor: statusColor(interview.status),
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {interview.status}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  {interview.meetingLink ? (
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '5px',
                        textDecoration: 'none',
                      }}
                    >
                      Join Interview
                    </a>
                  ) : (
                    <span style={{ color: '#999' }}>Not available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyInterviews;
