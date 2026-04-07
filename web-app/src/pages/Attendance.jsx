import { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Filter,
  Users
} from 'lucide-react';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [loading, setLoading] = useState(false);

  // Load data
  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }

    const savedAttendance = localStorage.getItem('attendance');
    if (savedAttendance) {
      setAttendance(JSON.parse(savedAttendance));
    }
  }, []);

  // Save attendance whenever it changes
  useEffect(() => {
    localStorage.setItem('attendance', JSON.stringify(attendance));
  }, [attendance]);

  const classes = [...new Set(students.map(s => s.class))].sort();

  const filteredStudents = selectedClass === 'all' 
    ? students 
    : students.filter(s => s.class === selectedClass);

  const getAttendanceStatus = (studentId) => {
    return attendance[selectedDate]?.[studentId]?.status || null;
  };

  const markAttendance = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [studentId]: {
          status,
          timestamp: new Date().toISOString()
        }
      }
    }));
  };

  const handleDateChange = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const getStats = () => {
    const todayAttendance = attendance[selectedDate] || {};
    const present = Object.values(todayAttendance).filter(a => a.status === 'present').length;
    const absent = Object.values(todayAttendance).filter(a => a.status === 'absent').length;
    const total = filteredStudents.length;
    const unmarked = total - present - absent;
    return { present, absent, total, unmarked };
  };

  const stats = getStats();

  const exportAttendance = () => {
    const data = filteredStudents.map(student => ({
      'Roll Number': student.rollNumber,
      'Name': student.name,
      'Class': student.class,
      'Status': getAttendanceStatus(student.id) || 'Not marked'
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedDate}.csv`;
    a.click();
  };

  const markAllPresent = () => {
    const newAttendance = {};
    filteredStudents.forEach(student => {
      newAttendance[student.id] = {
        status: 'present',
        timestamp: new Date().toISOString()
      };
    });
    
    setAttendance(prev => ({
      ...prev,
      [selectedDate]: newAttendance
    }));
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CalendarCheck size={28} color="#4f46e5" />
          <div>
            <h1>Attendance</h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Mark and track student attendance
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={exportAttendance}>
            <Download size={18} />
            Export
          </button>
          <button className="btn btn-primary" onClick={markAllPresent}>
            <Check size={18} />
            Mark All Present
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Date Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              className="btn-icon" 
              onClick={() => handleDateChange(-1)}
            >
              <ChevronLeft size={20} />
            </button>
            <div style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '0.5rem',
              fontWeight: 500,
              minWidth: '140px',
              textAlign: 'center'
            }}>
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <button 
              className="btn-icon" 
              onClick={() => handleDateChange(1)}
            >
              <ChevronRight size={20} />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input"
              style={{ width: 'auto', marginLeft: '0.5rem' }}
            />
          </div>

          {/* Class Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} color="#6b7280" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-input"
              style={{ width: 'auto' }}
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: 12, 
              height: 12, 
              backgroundColor: '#10b981', 
              borderRadius: '50%' 
            }} />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              Present: <strong>{stats.present}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: 12, 
              height: 12, 
              backgroundColor: '#ef4444', 
              borderRadius: '50%' 
            }} />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              Absent: <strong>{stats.absent}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: 12, 
              height: 12, 
              backgroundColor: '#d1d5db', 
              borderRadius: '50%' 
            }} />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              Unmarked: <strong>{stats.unmarked}</strong>
            </span>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '0.875rem', color: '#6b7280' }}>
            Total: <strong>{stats.total}</strong> students
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Class</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p style={{ color: '#6b7280' }}>No students found</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#9ca3af' }}>
                      Add students from the Students page
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const status = getAttendanceStatus(student.id);
                  return (
                    <tr key={student.id}>
                      <td>
                        <span className="badge badge-secondary">
                          {student.rollNumber}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{student.name}</td>
                      <td>
                        <span className="badge badge-secondary">
                          {student.class}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {status === 'present' && (
                          <span className="badge badge-success">
                            <Check size={12} />
                            Present
                          </span>
                        )}
                        {status === 'absent' && (
                          <span className="badge badge-danger">
                            <X size={12} />
                            Absent
                          </span>
                        )}
                        {!status && (
                          <span className="badge badge-secondary">Not marked</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                          <button
                            className="btn-icon"
                            onClick={() => markAttendance(student.id, 'present')}
                            style={{
                              backgroundColor: status === 'present' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                              color: status === 'present' ? '#10b981' : '#6b7280'
                            }}
                            title="Mark Present"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => markAttendance(student.id, 'absent')}
                            style={{
                              backgroundColor: status === 'absent' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                              color: status === 'absent' ? '#ef4444' : '#6b7280'
                            }}
                            title="Mark Absent"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Cards */}
      {filteredStudents.length > 0 && (
        <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
          <div className="stat-card">
            <div className="stat-icon success">
              <Check size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.present}</div>
              <div className="stat-label">Present Today</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon danger">
              <X size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.absent}</div>
              <div className="stat-label">Absent Today</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon warning">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%</div>
              <div className="stat-label">Attendance Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
