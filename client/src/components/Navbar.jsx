import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="dp-navbar">
      <Link to="/dashboard" className="dp-brand">
        DreamerPortal · Portal de Sonhos
      </Link>
      <div className="dp-user">
        <span className="dp-meta">{user?.name}</span>
        <button type="button" className="dp-btn dp-btn-secondary" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
};
