import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.scss';

function UserIcon() {
  return (
    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="29" cy="29" r="29" fill="#c0b8b8"/>
      <circle cx="29" cy="22" r="10" fill="#888"/>
      <ellipse cx="29" cy="46" rx="17" ry="10" fill="#888"/>
    </svg>
  );
}

export default function Header() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo}>Регистратор</Link>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-btn${isActive ? ' nav-btn--active' : ''}`}
          >
            Главная
          </NavLink>
          <NavLink
            to="/incidents"
            className={({ isActive }) => `nav-btn${isActive ? ' nav-btn--active' : ''}`}
          >
            Происшествия
          </NavLink>
          <NavLink
            to="/involvements"
            className={({ isActive }) => `nav-btn${isActive ? ' nav-btn--active' : ''}`}
          >
            Статусы
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/participants"
              className={({ isActive }) => `nav-btn${isActive ? ' nav-btn--active' : ''}`}
            >
              Участники
            </NavLink>
          )}
        </nav>

        {isAuthenticated ? (
          <div className={styles.userArea}>
            <NavLink
              to="/profile"
              className={({ isActive }) => `user-avatar-wrapper${isActive ? ' user-avatar-wrapper--active' : ''}`}
            >
              <span className="user-avatar-icon"><UserIcon /></span>
              <span className="user-avatar-name">{user?.login || user?.username || 'Username'}</span>
            </NavLink>
            {isAdmin && <span className="user-avatar-badge">A</span>}
            <button className={styles.logoutBtn} onClick={handleLogout} title="Выйти">✕</button>
          </div>
        ) : (
          <Link to="/signin" className="btn btn-primary">Войти</Link>
        )}
      </div>
    </header>
  );
}
