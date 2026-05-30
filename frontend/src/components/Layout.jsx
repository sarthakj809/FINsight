import { NavLink, Outlet } from 'react-router-dom';
import MessageBar from './MessageBar.jsx';
import logoImg from '../../assets/logo.jpg';

function Layout({ user, handleLogout, message }) {
  return (
    <div className="app">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logoImg} alt="FINsight" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />
          <div>
            <h1 style={{ margin: 0 }}>FINsight</h1>
            <p style={{ margin: 0 }}>Welcome, {user?.name || 'User'}.</p>
          </div>
        </div>

        <div className="nav-buttons">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/income" className={({ isActive }) => (isActive ? 'active' : '')}>
            Income
          </NavLink>
          <NavLink to="/expense" className={({ isActive }) => (isActive ? 'active' : '')}>
            Expense
          </NavLink>
          <NavLink to="/ai-insights" className={({ isActive }) => (isActive ? 'active' : '')}>
            AI Insights
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active profile-badge active-badge' : 'profile-badge')}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </NavLink>
        </div>
      </header>

      <MessageBar message={message} />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
