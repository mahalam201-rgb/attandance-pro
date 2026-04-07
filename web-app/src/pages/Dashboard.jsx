import { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    attendanceRate: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Load data from localStorage or use mock data
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');

    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance[today] || {};

    const present = Object.values(todayAttendance).filter(a => a.status === 'present').length;
    const absent = Object.values(todayAttendance).filter(a => a.status === 'absent').length;
    const total = students.length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    setStats({
      totalStudents: total || 156, // Mock default
      presentToday: present || 142,
      absentToday: absent || 14,
      attendanceRate: rate || 91
    });

    // Mock recent activity
    setRecentActivity([
      { id: 1, action: 'Student checked in', name: 'John Doe', time: '10:30 AM', type: 'present' },
      { id: 2, action: 'Student marked absent', name: 'Jane Smith', time: '10:15 AM', type: 'absent' },
      { id: 3, action: 'New student added', name: 'Mike Johnson', time: '9:45 AM', type: 'info' },
      { id: 4, action: 'Student checked in', name: 'Sarah Williams', time: '9:30 AM', type: 'present' },
      { id: 5, action: 'Attendance report generated', name: 'System', time: '9:00 AM', type: 'info' }
    ]);
  }, []);

  const statCards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'primary',
      change: '+12%',
      changeUp: true
    },
    {
      label: 'Present Today',
      value: stats.presentToday,
      icon: UserCheck,
      color: 'success',
      change: '+5%',
      changeUp: true
    },
    {
      label: 'Absent Today',
      value: stats.absentToday,
      icon: UserX,
      color: 'danger',
      change: '-3%',
      changeUp: true
    },
    {
      label: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      icon: TrendingUp,
      color: 'warning',
      change: '+2%',
      changeUp: true
    }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
          <Calendar size={18} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className={`stat-icon ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: stat.changeUp ? '#10b981' : '#ef4444',
                fontSize: '0.875rem',
                fontWeight: 500
              }}>
                {stat.changeUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              View All
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <tbody>
                {recentActivity.map((activity) => (
                  <tr key={activity.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          className={`badge badge-${
                            activity.type === 'present' ? 'success' : 
                            activity.type === 'absent' ? 'danger' : 'secondary'
                          }`}
                        >
                          {activity.type === 'present' && <UserCheck size={14} />}
                          {activity.type === 'absent' && <UserX size={14} />}
                          {activity.type === 'info' && <TrendingUp size={14} />}
                          {activity.action}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{activity.name}</td>
                    <td style={{ color: '#6b7280' }}>{activity.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-primary" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
              <UserCheck size={18} />
              Mark Attendance
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
              <Users size={18} />
              Add Student
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
              <BarChart3 size={18} />
              Generate Report
            </button>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Today's Summary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#6b7280' }}>Check-ins</span>
                <span style={{ fontWeight: 500 }}>142</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#6b7280' }}>Late arrivals</span>
                <span style={{ fontWeight: 500 }}>8</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#6b7280' }}>Early departures</span>
                <span style={{ fontWeight: 500 }}>3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
