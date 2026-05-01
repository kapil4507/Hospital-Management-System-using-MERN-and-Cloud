import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [emailOrId, setEmailOrId] = useState(''); // Email for patient, ID for doctor
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient'); // Default role
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Determine the correct endpoint based on the selected role
    const endpoint = role === 'patient' 
      ? import.meta.env.VITE_API_URL + '/api/patients/login' 
      : import.meta.env.VITE_API_URL + '/api/doctors/login';

    // Patients login with email, Doctors login with doctorId
    const loginData = role === 'patient' 
      ? { email: emailOrId, password } 
      : { doctorId: emailOrId, password };

    try {
      const response = await axios.post(endpoint, loginData);

      // Save token and the specific role to the browser
      localStorage.setItem('hospitalToken', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      
      const userName = response.data.role === 'doctor' ? response.data.doctorName : response.data.patientName;
      if (userName) localStorage.setItem('userName', userName);
      
      alert(`${role.charAt(0).toUpperCase() + role.slice(1)} Login Successful!`);
      
      // Redirect based on role
      if (response.data.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="auth-page">
      <div className="card card--lg fade-in" style={{ width: '100%', maxWidth: '420px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 700, fontSize: '22px', marginBottom: '6px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            HealthCare+
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Sign in to your account</p>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        {/* Role Selector */}
        <div className="role-tabs">
          <button
            id="tab-patient"
            type="button"
            onClick={() => setRole('patient')}
            className={`role-tab ${role === 'patient' ? 'role-tab--active' : ''}`}
          >
            Patient
          </button>
          <button
            id="tab-doctor"
            type="button"
            onClick={() => setRole('doctor')}
            className={`role-tab ${role === 'doctor' ? 'role-tab--active' : ''}`}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">
              {role === 'patient' ? 'Email' : 'Doctor ID (e.g. D111)'}
            </label>
            <input
              id="input-emailOrId"
              type="text"
              value={emailOrId}
              onChange={(e) => setEmailOrId(e.target.value)}
              required
              placeholder={role === 'patient' ? 'email@example.com' : 'D111'}
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="input-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
          </div>

          <button id="btn-login" type="submit" className="btn btn-primary btn--full btn--lg" style={{ marginTop: '4px' }}>
            Log In as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>

          {/* Patient Registration Link */}
          {role === 'patient' && (
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
              New patient?{' '}
              <span
                onClick={() => navigate('/register')}
                style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}
              >
                Register here
              </span>
            </p>
          )}

          {/* Admin Access Section */}
          <hr className="divider" />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>Hospital Administrator?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <span
                id="link-manage-doctors"
                onClick={() => navigate('/admin/add-doctor')}
                style={{ color: 'var(--danger)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
              >
                Manage Doctors
              </span>
              <span
                id="link-view-appointments"
                onClick={() => navigate('/admin/appointments')}
                style={{ color: 'var(--danger)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
              >
                View All Appointments
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;