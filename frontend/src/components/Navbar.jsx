import { useNavigate } from 'react-router-dom';

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('hospitalToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        {/* Heartbeat / cross icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
        HealthCare+
      </div>

      <div className="navbar__right">
        {userName && (
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginRight: '8px' }}>
            Hi, {userName}
          </span>
        )}
        {role && (
          <span className={`role-badge role-badge--${role}`}>
            {role}
          </span>
        )}
        <button className="btn btn-ghost btn--sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
