import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const PatientHistory = () => {
  const { patientId } = useParams();
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('hospitalToken');
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reports/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(res.data);
      } catch (err) {
        console.error("Failed to fetch patient history");
      }
    };
    fetchHistory();
  }, [patientId]);

  // ADDED: The secure S3 fetching logic
  const handleViewFile = async (reportId) => {
    try {
      const token = localStorage.getItem('hospitalToken'); 
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reports/view/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.open(res.data.url, '_blank'); 
    } catch (err) {
      alert('Could not load file. Please try again.');
    }
  };

  const getTypeBadgeClass = (type) => {
    if (type === 'Lab Result')   return 'type-badge type-badge--lab';
    if (type === 'Prescription') return 'type-badge type-badge--presc';
    if (type === 'Scan')         return 'type-badge type-badge--scan';
    return 'type-badge type-badge--other';
  };

  return (
    <div className="page">
      <Navbar role="doctor" />

      <div className="page-inner fade-in" style={{ maxWidth: '720px' }}>

        <div className="page-header">
          <h2>Patient Medical History</h2>
          <button
            id="btn-back"
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn--sm"
          >
            ← Back
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="empty-state">No records found for this patient.</div>
        ) : (
          <div className="appt-list">
            {reports.map(report => (
              <div key={report._id} className="appt-card">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '15px' }}>{report.title}</strong>
                    <span className={getTypeBadgeClass(report.reportType)}>
                      {report.reportType}
                    </span>
                  </div>
                  <div className="appt-card__meta">
                    <strong>Doctor:</strong> {report.doctorId?.doctorName || 'Unknown'}
                  </div>
                </div>
                <button
                  id={`btn-view-${report._id}`}
                  onClick={() => handleViewFile(report._id)}
                  className="btn btn-ghost btn--sm"
                >
                  View File
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;