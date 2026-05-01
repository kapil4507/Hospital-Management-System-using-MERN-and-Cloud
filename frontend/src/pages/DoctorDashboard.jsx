import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch appointments on load
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('hospitalToken');
      if (!token) return navigate('/');

      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments", err);
    }
  };

  // Function to handle the PUT request when status is changed
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('hospitalToken');
      
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/appointments/${appointmentId}`, 
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setMessage('Appointment status updated successfully!');
      
      // Update the local state so the UI reflects the change immediately
      setAppointments(appointments.map(appt => 
        appt._id === appointmentId ? { ...appt, status: res.data.updatedAppointment.status } : appt
      ));

      // Clear the success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);

    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Function to determine badge class based on status
  const getStatusClass = (status) => {
    if (status === 'Completed') return 'status-badge--completed';
    if (status === 'Cancelled') return 'status-badge--cancelled';
    return 'status-badge--scheduled';
  };

  // Stats
  const total = appointments.length;
  const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;

return (
    <div className="page">
      <Navbar role="doctor" />

      <div className="page-inner fade-in">

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-card__value">{total}</div>
            <div className="stat-card__label">Total Appointments</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value" style={{ color: 'var(--warning)' }}>{scheduled}</div>
            <div className="stat-card__label">Scheduled</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value" style={{ color: 'var(--success)' }}>{completed}</div>
            <div className="stat-card__label">Completed</div>
          </div>
        </div>

        <h3 className="section-title">Manage Patient Appointments</h3>

        {message && (
          <div className="alert alert--success">{message}</div>
        )}

        {appointments.length === 0 ? (
          <div className="empty-state">No appointments found.</div>
        ) : (
          <div className="appt-list">
            {appointments.map((appt) => (
              <div key={appt._id} className="appt-card">
                
                {/* Appointment Details */}
                <div style={{ flex: 1 }}>
                  <div className="appt-card__meta">
                    <strong>Patient:</strong> {appt.patientId?.patientName || 'Unknown'}
                  </div>
                  <div className="appt-card__meta">
                    <strong>Date:</strong> {new Date(appt.date).toLocaleDateString()} &nbsp;
                    <strong>Time:</strong> {appt.timeSlot}
                  </div>
                  <div className="appt-card__meta">
                    <strong>Reason:</strong> {appt.reasonForVisit}
                  </div>

                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* View Patient History Button */}
                    <button
                      id={`btn-history-${appt._id}`}
                      onClick={() => {
                          // We check if the populated object exists first to avoid errors
                          if (appt.patientId && appt.patientId._id) {
                              navigate(`/patient-history/${appt.patientId._id}`);
                          } else {
                              alert("Patient database record not found.");
                          }
                      }}
                      className="btn btn-ghost btn--sm"
                    >
                      View Medical History
                    </button>

                    {/* Status Badge */}
                    <span className={`status-badge ${getStatusClass(appt.status || 'Scheduled')}`}>
                      {appt.status || 'Scheduled'}
                    </span>
                  </div>
                </div>

                {/* Status Update Control */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Update Status:</label>
                  <select
                    id={`select-status-${appt._id}`}
                    value={appt.status || 'Scheduled'}
                    onChange={(e) => handleStatusUpdate(appt._id, e.target.value)}
                    className="input"
                    style={{ width: 'auto', padding: '7px 10px', fontSize: '13px' }}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))} {/* Added missing ); here */}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;