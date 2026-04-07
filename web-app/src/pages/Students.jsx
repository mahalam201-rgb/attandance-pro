import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check, Users, Filter } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    class: '',
    phone: ''
  });

  // Load students from localStorage on mount
  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      // Default mock data
      const defaultStudents = [
        { id: '1', name: 'John Doe', email: 'john@example.com', rollNumber: '001', class: '10A', phone: '1234567890' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', rollNumber: '002', class: '10A', phone: '1234567891' },
        { id: '3', name: 'Mike Johnson', email: 'mike@example.com', rollNumber: '003', class: '10B', phone: '1234567892' },
        { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', rollNumber: '004', class: '10B', phone: '1234567893' },
        { id: '5', name: 'David Brown', email: 'david@example.com', rollNumber: '005', class: '10A', phone: '1234567894' }
      ];
      setStudents(defaultStudents);
      localStorage.setItem('students', JSON.stringify(defaultStudents));
    }
  }, []);

  // Save to localStorage whenever students change
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('students', JSON.stringify(students));
    }
  }, [students]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.includes(searchTerm) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormData({ name: '', email: '', rollNumber: '', class: '', phone: '' });
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setShowModal(true);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingStudent) {
      // Update existing student
      setStudents(students.map(s => 
        s.id === editingStudent.id ? { ...formData, id: s.id } : s
      ));
    } else {
      // Add new student
      const newStudent = {
        ...formData,
        id: Date.now().toString()
      };
      setStudents([...students, newStudent]);
    }
    
    setShowModal(false);
    setFormData({ name: '', email: '', rollNumber: '', class: '', phone: '' });
  };

  const classes = [...new Set(students.map(s => s.class))].sort();

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users size={28} color="#4f46e5" />
          <div>
            <h1>Students</h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Manage student records and information
            </p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleAddStudent}>
          <Plus size={18} />
          Add Student
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <Search size={18} color="#6b7280" />
        <input
          type="text"
          placeholder="Search by name, email, roll number or class..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn-icon" style={{ marginLeft: 'auto' }}>
          <Filter size={18} />
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon primary">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{students.length}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">
            <Filter size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{classes.length}</div>
            <div className="stat-label">Classes</div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Class</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ color: '#6b7280' }}>
                      <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                      <p>No students found</p>
                      <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        {searchTerm ? 'Try adjusting your search' : 'Add your first student to get started'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
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
                    <td style={{ color: '#6b7280' }}>{student.email}</td>
                    <td style={{ color: '#6b7280' }}>{student.phone}</td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="btn-icon edit"
                          onClick={() => handleEditStudent(student)}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon delete"
                          onClick={() => handleDeleteStudent(student.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter student name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Roll Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 001"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Class</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 10A"
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="1234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={18} />
                  {editingStudent ? 'Update' : 'Add'} Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
