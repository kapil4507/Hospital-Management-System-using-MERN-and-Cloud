import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    doctorId: '',
    doctorName: '',
    specialization: '',
    password: '',
    adminSecret: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Frontend validation for Doctor ID format
    const doctorIdRegex = /^D[0-9]{3}$/;
    if (!doctorIdRegex.test(formData.doctorId)) {
      return setError('Doctor ID must be in format D followed by 3 digits (e.g., D111).');
    }

    try {
      setLoading(true);
      await axios.post(import.meta.env.VITE_API_URL + '/api/doctors', formData);
      setSuccessMsg(`Doctor ${formData.doctorName} added successfully!`);
      
      // Clear form after success
      setFormData({
        doctorId: '', doctorName: '', specialization: '', password: '', adminSecret: ''
      });
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="card card--lg fade-in" style={{ width: '100%', maxWidth: '500px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span className="role-badge role-badge--admin">Admin Portal</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>Add New Doctor</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Back to{' '}
            <span
              onClick={() => navigate('/')}
              style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}
            >
              Login
            </span>
          </p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}
        {successMsg && <div className="alert alert--success">{successMsg}</div>}

        <form onSubmit={handleSubmit}>

          {/* Doctor ID */}
          <div className="form-group">
            <label className="form-label">Doctor ID <span>(e.g. D111)</span></label>
            <input
              id="input-doctorId"
              type="text"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              placeholder="D111"
              required
              maxLength={4}
              className="input"
            />
          </div>

          {/* Doctor Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              id="input-doctorName"
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              placeholder="Dr. Sarah Jenkins"
              required
              className="input"
            />
          </div>

          {/* Specialization */}
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <select
              id="input-specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="" disabled>-- Select Specialization --</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="General Practice">General Practice</option>
            </select>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Doctor Login Password</label>
            <input
              id="input-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password for the doctor"
              required
              className="input"
            />
          </div>

          {/* Admin Secret Key */}
          <div className="form-group">
            <label className="form-label" style={{ color: 'var(--danger)' }}>Admin Authorization Key</label>
            <input
              id="input-adminSecret"
              type="password"
              name="adminSecret"
              value={formData.adminSecret}
              onChange={handleChange}
              placeholder="Enter secret key to authorize"
              required
              className="input"
              style={{ borderColor: 'var(--danger)' }}
            />
          </div>

          <button
            id="btn-register-doctor"
            type="submit"
            disabled={loading}
            className="btn btn-primary btn--full btn--lg"
          >
            {loading ? 'Registering...' : 'Register Doctor'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;