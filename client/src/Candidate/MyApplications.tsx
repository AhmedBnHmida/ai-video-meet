import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface IApplication {
  _id: string;
  jobPost: string | { title: string };
  submissionDate: string;
  status: string;
  interviews: { _id: string }[];
}

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<IApplication[]>([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const res = await axios.get(`http://localhost:5000/application/GetByUser/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications', err);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/application/Delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchApplications();
    } catch (err) {
      console.error('Error deleting application', err);
      alert('Failed to delete application.');
    }
  };

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return '#007bff';
      case 'accepted':
        return '#28a745';
      case 'rejected':
        return '#dc3545';
      case 'done':
        return '#6c757d';
      default:
        return '#333';
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📄 My Applications</h2>

      {applications.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No applications found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px' }}>💼 Job</th>
              <th style={{ padding: '10px' }}>📅 Submitted</th>
              <th style={{ padding: '10px' }}>📌 Status</th>
              <th style={{ padding: '10px' }}>🎤 Interview</th>
              <th style={{ padding: '10px' }}>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '10px' }}>
                  {typeof app.jobPost === 'object' ? app.jobPost.title : app.jobPost}
                </td>
                <td style={{ padding: '10px' }}>
                  {new Date(app.submissionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td style={{ padding: '10px' }}>
                  <span
                    style={{
                      backgroundColor: statusColor(app.status),
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {app.status}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  {Array.isArray(app.interviews) && app.interviews.length > 0 ? (
                    <button
                      onClick={() => alert(`Navigate to interview ${app.interviews[0]._id}`)}
                      style={{
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      View Interview
                    </button>
                  ) : (
                    <span style={{ color: '#999' }}>No Interview</span>
                  )}
                </td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => deleteApplication(app._id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    🗑 Delete
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

export default MyApplications;
