import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusMessage, setStatusMessage] = useState(''); // To show feedback
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem('hospitalToken');
    try {
      // Fetch Appointments
      const apptRes = await axios.get(import.meta.env.VITE_API_URL + '/api/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAppointments(apptRes.data);

      // Fetch Doctors (Requirement: Call GET /doctors) 
      const docRes = await axios.get(import.meta.env.VITE_API_URL + '/api/doctors');
      setDoctors(docRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };
  fetchData();
}, []);

  //\cancellation
  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const token = localStorage.getItem('hospitalToken');
      // We use the PUT route you established in appointment.js to update the status
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/appointments/${appointmentId}`, 
        { status: 'Cancelled' },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setStatusMessage('Appointment cancelled successfully.');
      
      // Update local state so UI reflects the change immediately
      setAppointments(appointments.map(appt => 
        appt._id === appointmentId ? { ...appt, status: 'Cancelled' } : appt
      ));

      // Clear message after 3 seconds
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error("Cancellation failed", err);
      alert(err.response?.data?.message || 'Error cancelling appointment.');
    }
  };

  // Stats
  const total = appointments.length;
  const upcoming = appointments.filter(a => a.status === 'Scheduled').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;

  const getStatusClass = (status) => {
    if (status === 'Completed') return 'status-badge--completed';
    if (status === 'Cancelled') return 'status-badge--cancelled';
    return 'status-badge--scheduled';
  };

  return (
    <div className="page">
      <Navbar role="patient" />

      <div className="page-inner fade-in">

        {statusMessage && (
          <div className="alert alert--success" style={{ marginBottom: '20px' }}>{statusMessage}</div>
        )}

        {/* Stat Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-card__value">{total}</div>
            <div className="stat-card__label">Total Appointments</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value" style={{ color: 'var(--warning)' }}>{upcoming}</div>
            <div className="stat-card__label">Upcoming</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value" style={{ color: 'var(--success)' }}>{completed}</div>
            <div className="stat-card__label">Completed</div>
          </div>
        </div>

        {/* Available Doctors */}
        <h3 className="section-title">Available Doctors</h3>
        <div className="doctor-grid">
          {doctors.map((doc) => (
            <div key={doc._id} className="doctor-card">
              <div className="doctor-card__avatar">
                {doc.doctorName?.charAt(0).toUpperCase()}
              </div>
              <div className="doctor-card__name">{doc.doctorName}</div>
              <div className="doctor-card__spec">{doc.specialization}</div>
            </div>
          ))}
        </div>

        {/* Appointments */}
        <h3 className="section-title">Your Appointments</h3>

        {appointments.length === 0 ? (
          <div className="empty-state">You have no appointments yet.</div>
        ) : (
          <div className="appt-list">
            {appointments.map((appt) => (
              <div key={appt._id} className="appt-card">
                <div>
                  <div className="appt-card__meta">
                    <strong>Doctor:</strong> {appt.doctorId?.doctorName || 'N/A'}
                  </div>
                  <div className="appt-card__meta">
                    <strong>Date:</strong> {new Date(appt.date).toLocaleDateString()} &nbsp;
                    <strong>Time:</strong> {appt.timeSlot}
                  </div>
                  <div className="appt-card__meta">
                    <strong>Reason:</strong> {appt.reasonForVisit}
                  </div>
                </div>

                <div className="appt-card__actions">
                  <span className={`status-badge ${getStatusClass(appt.status)}`}>
                    {appt.status}
                  </span>
                  {appt.status === 'Scheduled' && (
                    <button
                      id={`btn-cancel-${appt._id}`}
                      onClick={() => handleCancel(appt._id)}
                      className="btn btn-danger btn--sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="actions-bar">
          <button
            id="btn-book-appointment"
            onClick={() => navigate('/book-appointment')}
            className="btn btn-primary btn--lg"
          >
            + Book New Appointment
          </button>
          <button
            id="btn-my-reports"
            onClick={() => navigate('/reports')}
            className="btn btn-ghost btn--lg"
          >
            My Medical Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;