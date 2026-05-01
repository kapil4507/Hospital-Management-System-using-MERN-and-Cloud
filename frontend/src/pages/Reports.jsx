import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    title: '',
    reportType: 'Other'
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('hospitalToken');

  // Fetch reports and doctors on load
  useEffect(() => {
    if (!token) { navigate('/'); return; }
    fetchReports();
    fetchDoctors();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('hospitalToken');
      console.log('Token found:', token);
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleViewFile = async (reportId) => {
  try {
    const token = localStorage.getItem('hospitalToken'); // move it here
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reports/view/${reportId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    window.open(res.data.url, '_blank'); // opens the signed URL in new tab
  } catch (err) {
    alert('Could not load file. Please try again.');
  }
};
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/doctors');
      setDoctors(res.data);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('hospitalToken');
    setError('');
    setSuccessMsg('');

    if (!file) return setError('Please select a file to upload.');
    if (!formData.doctorId) return setError('Please select a doctor.');
    if (!formData.title) return setError('Please enter a report title.');

    const data = new FormData();
    data.append('reportFile', file);
    data.append('doctorId', formData.doctorId);
    data.append('title', formData.title);
    data.append('reportType', formData.reportType);

    try {
      setUploading(true);
      await axios.post(import.meta.env.VITE_API_URL + '/api/reports', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMsg('Report uploaded successfully!');
      setFormData({ doctorId: '', title: '', reportType: 'Other' });
      setFile(null);
      // Reset file input
      document.getElementById('fileInput').value = '';
      fetchReports(); // refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
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
      <Navbar role="patient" />

      <div className="page-inner fade-in" style={{ maxWidth: '720px' }}>

        {/* Header */}
        <div className="page-header">
          <h2>Medical Reports</h2>
          <button
            id="btn-back-dashboard"
            onClick={() => navigate('/dashboard')}
            className="btn btn-ghost btn--sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Upload Section */}
        <div className="card" style={{ marginBottom: '28px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 600 }}>Upload New Report</h3>

          {error && <div className="alert alert--error">{error}</div>}
          {successMsg && <div className="alert alert--success">{successMsg}</div>}

          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label className="form-label">Report Title</label>
              <input
                id="input-report-title"
                type="text"
                placeholder="e.g. Blood Test Results"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div className="form-group">
                <label className="form-label">Doctor</label>
                <select
                  id="select-doctor"
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="input"
                >
                  <option value="">-- Select Doctor --</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>{doc.doctorName} ({doc.specialization})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Report Type</label>
                <select
                  id="select-report-type"
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  className="input"
                >
                  <option value="Lab Result">Lab Result</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Scan">Scan</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">File</label>
              <input
                id="fileInput"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files[0])}
                className="input"
              />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Accepted: PDF, JPG, PNG</p>
            </div>

            <button
              id="btn-upload"
              type="submit"
              disabled={uploading}
              className="btn btn-primary"
            >
              {uploading ? 'Uploading...' : 'Upload Report'}
            </button>
          </form>
        </div>

        {/* Reports List */}
        <h3 className="section-title">Your Reports</h3>

        {loadingReports ? (
          <div className="empty-state">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="empty-state">No reports uploaded yet.</div>
        ) : (
          <div className="appt-list">
            {reports.map((report) => (
              <div key={report._id} className="appt-card">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '15px' }}>{report.title}</strong>
                    <span className={getTypeBadgeClass(report.reportType)}>
                      {report.reportType}
                    </span>
                  </div>
                  <div className="appt-card__meta">
                    <strong>Doctor:</strong> {report.doctorId?.doctorName || 'N/A'} &nbsp;|&nbsp;
                    <strong>Date:</strong> {new Date(report.uploadDate).toLocaleDateString()}
                  </div>
                </div>
                <button
                  id={`btn-view-${report._id}`}
                  onClick={() => handleViewFile(report._id)}
                  className="btn btn-success btn--sm"
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

export default Reports;
