import { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, Users, TrendingUp, Filter } from 'lucide-react';

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedClass, setSelectedClass] = useState('all');

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

  const classes = [...new Set(students.map(s => s.class))].sort();

  const filteredStudents = selectedClass === 'all'
    ? students
    : students.filter(s => s.class === selectedClass);

  // Calculate attendance report
  const getStudentReport = (studentId) => {
    const dates = Object.keys(attendance).filter(date => 
      date >= dateRange.start && date <= dateRange.end
    );
    
    let present = 0;
    let absent = 0;
    
    dates.forEach(date => {
      const status = attendance[date]?.[studentId]?.status;
      if (status === 'present') present++;
      if (status === 'absent') absent++;
    });
    
    const total = dates.length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { present, absent, total, rate };
  };

  const getClassStats = () => {
    const stats = {};
    classes.forEach(cls => {
      const classStudents = students.filter(s => s.class === cls);
      let totalPresent = 0;
      let totalDays = 0;
      
      classStudents.forEach(student => {
        const report = getStudentReport(student.id);
        totalPresent += report.present;
        totalDays += report.total;
      });
      
      stats[cls] = {
        students: classStudents.length,
        attendanceRate: totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0
      };
    });
    return stats;
  };

  const classStats = getClassStats();

  const exportReport = () => {
    const data = filteredStudents.map(student => {
      const report = getStudentReport(student.id);
      return {
        'Roll Number': student.rollNumber,
        'Name': student.name,
        'Class': student.class,
        'Days Present': report.present,
        'Days Absent': report.absent,
        'Total Days': report.total,
        'Attendance %': report.rate + '%'
      };
    });

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${dateRange.start}-to-${dateRange.end}.csv`;
    a.click();
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BarChart3 size={28} color="#4f46e5" />
          <div>
            <h1>Reports</h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              View and export attendance reports
            </p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={exportReport}>
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          alignItems: 'flex-end',
          flexWrap: 'wrap'
        }}>
          <div>
            <label className="form-label">Date Range</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="form-input"
              />
              <span style={{ color: '#6b7280' }}>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          
          <div>
            <label className="form-label">Class Filter</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} color="#6b7280" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="form-input"
                style={{ width: '150px' }}
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon primary">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{filteredStudents.length}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {filteredStudents.length > 0
                ? Math.round(
                    filteredStudents.reduce((acc, s) => acc + getStudentReport(s.id).rate, 0) / 
                    filteredStudents.length
                  )
                : 0}%
            </div>
            <div className="stat-label">Avg Attendance</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {Object.keys(attendance).filter(d => d >= dateRange.start && d <= dateRange.end).length}
            </div>
            <div className="stat-label">Days Recorded</div>
          </div>
        </div>
      </div>

      {/* Class Summary */}
      {selectedClass === 'all' && classes.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Class Summary</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Students</th>
                  <th>Attendance Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(cls => (
                  <tr key={cls}>
                    <td><span className="badge badge-secondary">{cls}</span></td>
                    <td>{classStats[cls].students}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '100px',
                          height: '8px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${classStats[cls].attendanceRate}%`,
                            height: '100%',
                            backgroundColor: classStats[cls].attendanceRate >= 80 ? '#10b981' : 
                                           classStats[cls].attendanceRate >= 60 ? '#f59e0b' : '#ef4444',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                          {classStats[cls].attendanceRate}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${
                        classStats[cls].attendanceRate >= 80 ? 'success' : 
                        classStats[cls].attendanceRate >= 60 ? 'warning' : 'danger'
                      }`}>
                        {classStats[cls].attendanceRate >= 80 ? 'Excellent' : 
                         classStats[cls].attendanceRate >= 60 ? 'Good' : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Report */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>Detailed Attendance Report</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Class</th>
                <th>Days Present</th>
                <th>Days Absent</th>
                <th>Attendance %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                    <BarChart3 size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p style={{ color: '#6b7280' }}>No data available</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#9ca3af' }}>
                      Mark attendance to generate reports
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const report = getStudentReport(student.id);
                  return (
                    <tr key={student.id}>
                      <td><span className="badge badge-secondary">{student.rollNumber}</span></td>
                      <td style={{ fontWeight: 500 }}>{student.name}</td>
                      <td><span className="badge badge-secondary">{student.class}</span></td>
                      <td style={{ color: '#10b981', fontWeight: 500 }}>{report.present}</td>
                      <td style={{ color: '#ef4444', fontWeight: 500 }}>{report.absent}</td>
                      <td style={{ fontWeight: 600 }}>{report.rate}%</td>
                      <td>
                        <span className={`badge badge-${
                          report.rate >= 80 ? 'success' : 
                          report.rate >= 60 ? 'warning' : 'danger'
                        }`}>
                          {report.rate >= 80 ? 'Good Standing' : 
                           report.rate >= 60 ? 'Average' : 'At Risk'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
