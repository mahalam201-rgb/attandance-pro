import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BarChart3,
  LogOut,
  GraduationCap,
  ChevronRight
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/students', label: 'Students', icon: Users },
    { path: '/attendance', label: 'Attendance', icon: CalendarCheck },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <GraduationCap size={24} />
            </div>
            <span>Attendance Pro</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? 'nav-item active' : 'nav-item'
                }
                end={item.path === '/dashboard'}
              >
                <Icon size={20} className="nav-icon" />
                <span>{item.label}</span>
                <ChevronRight
                  size={16}
                  style={{ marginLeft: 'auto', opacity: 0.5 }}
                />
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || 'Admin'}</div>
              <div className="user-role">{user?.role || 'Administrator'}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
