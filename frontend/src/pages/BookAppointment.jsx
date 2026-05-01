import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    timeSlot: '',
    reasonForVisit: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // 1. Fetch available doctors when the page loads
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/doctors');
        setDoctors(res.data);
      } catch (err) {
        console.error("Failed to fetch doctors");
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('hospitalToken');

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/appointments', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("Appointment Booked Successfully!");
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="page">
      <Navbar role="patient" />

      <div className="page-inner--sm fade-in">

        <div className="page-header">
          <h2>Book an Appointment</h2>
          <button
            id="btn-back-dashboard"
            className="btn btn-ghost btn--sm"
            onClick={() => navigate('/dashboard')}
          >
            ← Back
          </button>
        </div>

        <div className="card">
          {message && <div className="alert alert--error">{message}</div>}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label className="form-label">Select Doctor</label>
              <select
                id="select-doctor"
                required
                className="input"
                onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
              >
                <option value="">-- Choose a Doctor --</option>
                {doctors.map(doc => (
                  <option key={doc._id} value={doc._id}>{doc.doctorName} ({doc.specialization})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                id="input-date"
                type="date"
                required
                className="input"
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time Slot</label>
              <select
                id="select-timeslot"
                required
                className="input"
                onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
              >
                <option value="">-- Select Time --</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reason for Visit</label>
              <textarea
                id="input-reason"
                required
                className="input"
                placeholder="Describe your reason for visiting..."
                onChange={(e) => setFormData({...formData, reasonForVisit: e.target.value})}
              />
            </div>

            <button id="btn-confirm" type="submit" className="btn btn-primary btn--full btn--lg">
              Confirm Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;