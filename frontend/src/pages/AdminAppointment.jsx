import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminAppointments = () => {
  const [adminSecret, setAdminSecret] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/appointments/admin/all', { adminSecret });
      setAppointments(res.data);
      setIsUnlocked(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to authenticate.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Completed') return 'status-badge--completed';
    if (status === 'Cancelled') return 'status-badge--cancelled';
    return 'status-badge--scheduled';
  };

  return (
    <div className="auth-page" style={{ alignItems: isUnlocked ? 'flex-start' : 'center', paddingTop: isUnlocked ? '40px' : '24px', paddingBottom: '40px' }}>
      <div className="fade-in" style={{ width: '100%', maxWidth: isUnlocked ? '820px' : '460px' }}>

        {/* Header */}
        <div className="card card--lg" style={{ marginBottom: isUnlocked ? '24px' : '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="role-badge role-badge--admin">Admin Portal</span>
            </div>
            <span
              onClick={() => navigate('/')}
              style={{ color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
            >
              ← Login
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Master Appointment List</h2>

          {error && <div className="alert alert--error">{error}</div>}

          {/* Auth Gate Form */}
          {!isUnlocked && (
            <form onSubmit={handleUnlock}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--danger)' }}>Admin Authorization Key</label>
                <input
                  id="input-adminSecret"
                  type="password"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="Enter secret key to unlock records"
                  required
                  className="input"
                  style={{ borderColor: 'var(--danger)' }}
                />
              </div>
              <button
                id="btn-unlock"
                type="submit"
                disabled={loading}
                className="btn btn-danger btn--full"
              >
                {loading ? 'Unlocking...' : '🔐 View Master List'}
              </button>
            </form>
          )}

          {isUnlocked && (
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Showing <strong style={{ color: 'var(--text)' }}>{appointments.length}</strong> appointment{appointments.length !== 1 ? 's' : ''} in the system.
            </p>
          )}
        </div>

        {/* Unlocked Appointments List */}
        {isUnlocked && (
          appointments.length === 0 ? (
            <div className="empty-state">No appointments found in the system.</div>
          ) : (
            <div className="appt-list">
              {appointments.map((appt) => (
                <div key={appt._id} className="appt-card">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '15px' }}>
                        {new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}
                      </strong>
                      <span className={`status-badge ${getStatusClass(appt.status)}`}>
                        {appt.status}
                      </span>
                    </div>
                    <div className="appt-card__meta">
                      <strong>Doctor:</strong> {appt.doctorId?.doctorName} ({appt.doctorId?.specialization})
                    </div>
                    <div className="appt-card__meta">
                      <strong>Patient:</strong> {appt.patientId?.patientName} | {appt.patientId?.mobile}
                    </div>
                    <div className="appt-card__meta">
                      <strong>Reason:</strong> {appt.reasonForVisit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;