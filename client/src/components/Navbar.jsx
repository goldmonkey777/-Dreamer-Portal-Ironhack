import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
      <Link to="/dashboard" style={{ fontWeight: 'bold', textDecoration: 'none' }}>
        DreamerPortal · Portal de Sonhos
      </Link>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span>{user?.name}</span>
        <button type="button" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
};
