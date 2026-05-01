import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';
import Register from './pages/Register';
import Reports from './pages/Reports';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientHistory from './pages/PatientHistory'
import AddDoctor from './pages/AddDocot'
import AdminAppointments from './pages/AdminAppointment';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('hospitalToken');
  const role = localStorage.getItem('userRole');
  if (!token || role !== 'patient') {
    return <Navigate to="/" />;
  }
  return children; //go ahead
};

const DoctorRoute = ({ children }) => {
  const token = localStorage.getItem('hospitalToken');
  const role = localStorage.getItem('userRole');

  if (!token || role !== 'doctor') {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* patient only */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/book-appointment" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          {/* doctor only */}
          <Route path="/doctor-dashboard" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
          <Route path="/patient-history/:patientId" element={<DoctorRoute><PatientHistory /></DoctorRoute>} />

          <Route path="/admin/add-doctor" element={<AddDoctor />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;