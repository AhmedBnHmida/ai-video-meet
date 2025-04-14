import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface IApplication {
  _id: string;
  candidate: {
    firstName: string;
    lastName: string;
    email?: string;
  };
  jobPost?: string; // يمكنك لاحقًا استخدام populate لإظهار اسم الوظيفة
  submissionDate: string;
}

const ApplicationManager: React.FC = () => {
  const [applications, setApplications] = useState<IApplication[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/application/GetAll', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (error) {
      console.error('Error fetching applications', error);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>📋 All Job Applications</h2>

      {applications.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No applications available.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#f7f7f7', borderBottom: '1px solid #ccc' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>👤 Candidate</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>📧 Email</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>📅 Submitted</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>
                  {app.candidate.firstName} firstname {app.candidate.lastName}
                </td>
                <td style={{ padding: '10px' }}>
                  {app.candidate.email || <span style={{ color: '#aaa' }}>N/A</span>}
                </td>
                <td style={{ padding: '10px' }}>
                  {new Date(app.submissionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => navigate(`/addInterview?application=${app._id}`)}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    ➕ Add Interview
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

export default ApplicationManager;
