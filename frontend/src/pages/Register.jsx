import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    mobile: '',
    email: '',
    gender: '',
    allergies: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    const patientIdRegex = /^P[0-9]{3}$/;
    if (!patientIdRegex.test(formData.patientId)) {
      return setError('Patient ID must be in format P followed by 3 digits (e.g. P123).');
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      return setError('Mobile number must be exactly 10 digits.');
    }

    try {
      setLoading(true);
      const { confirmPassword, ...dataToSend } = formData;
      await axios.post(import.meta.env.VITE_API_URL + '/api/patients', dataToSend);
      alert('Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="card card--lg fade-in" style={{ width: '100%', maxWidth: '520px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 700, fontSize: '20px', marginBottom: '4px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            HealthCare+
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>Patient Registration</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Already have an account?{' '}
            <span
              onClick={() => navigate('/')}
              style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}
            >
              Login here
            </span>
          </p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* Personal Info */}
          <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Personal Information
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div className="form-group">
              <label className="form-label">Patient ID <span>(e.g. P123)</span></label>
              <input
                id="input-patientId"
                type="text"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                placeholder="P123"
                required
                maxLength={4}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                id="input-patientName"
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                id="input-mobile"
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit number"
                required
                maxLength={10}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                id="input-gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">-- Select --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              id="input-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Allergies <span>(optional)</span></label>
            <input
              id="input-allergies"
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="e.g. Penicillin, Pollen"
              className="input"
            />
          </div>

          <hr className="divider" />
          <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Account Setup
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                id="input-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                id="input-confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                className="input"
              />
            </div>
          </div>

          <button
            id="btn-register"
            type="submit"
            disabled={loading}
            className="btn btn-primary btn--full btn--lg"
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
