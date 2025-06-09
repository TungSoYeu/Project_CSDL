import React, { useState, useEffect } from 'react';
import './StudentContent.css'; 
import AddStudentModal from './AddStudentModal';
import PlusIcon from '../asset/image/top-section/plus.svg';
import DefaultAvatarIcon from '../asset/image/avatar/default-avatar.svg'; 

// --- COMPONENT THẺ SINH VIÊN ---
const StudentCard = ({ studentData }) => {
  // Show DOB as date only (YYYY-MM-DD), never time
  let dobDisplay = studentData.DOB || studentData.BirthDate || '';
  if (typeof dobDisplay === 'string' && dobDisplay.length >= 10) {
    dobDisplay = dobDisplay.slice(0, 10);
  }
  return (
    <div className="student-card">
      <div className="student-card-info">
        <div className="info-group student-id-group">
          <span className="info-label">Student ID</span>
          <span className="info-value student-id-value">{studentData.StudentID || studentData.studentId || ''}</span>
        </div>
        <div className="info-group student-name-group">
          <span className="info-label">Full Name</span>
          <span className="info-value student-name-value">{studentData.FullName || studentData.fullName || ''}</span>
        </div>
        <div className="info-group student-dob-group">
          <span className="info-label">DOB</span>
          <span className="info-value student-dob-value">{dobDisplay}</span>
        </div>
        <div className="info-group student-major-group">
          <span className="info-label">Major</span>
          <span className="info-value student-major-value">{studentData.Major || studentData.major || ''}</span>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const StudentContent = ({ searchTerm, searchField }) => {
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterName, setFilterName] = useState(''); // State cho filter box
  const [filterField, setFilterField] = useState('Full Name'); // State cho dropdown filter

  // NOTE: 2. Thêm state cho AddStudentModal
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/students')
      .then(res => res.json())
      .then(data => setAllStudents(data))
      .catch(() => setAllStudents([]));
  }, []);

  useEffect(() => {
    let studentsToProcess = [...allStudents];
    // Lọc theo filterName và filterField trước (nếu có)
    if (filterName) {
      studentsToProcess = studentsToProcess.filter(stu => {
        let value = '';
        if (filterField === 'Full Name') value = stu.FullName || '';
        else if (filterField === 'Student ID') value = stu.StudentID || '';
        else if (filterField === 'DOB') value = stu.BirthDate || '';
        else if (filterField === 'Major') value = stu.Major || '';
        else value = '';
        return value.toLowerCase().includes(filterName.toLowerCase());
      });
    }
    if (searchTerm && searchField && studentsToProcess.length > 0) {
      const term = String(searchTerm).toLowerCase();
      studentsToProcess = studentsToProcess.filter(stu => {
        let fieldValue = '';
        if (
          searchField === 'Student ID' || searchField.toLowerCase() === 'studentid' || searchField.toLowerCase() === 'student id'
        ) {
          fieldValue = stu.StudentID ? String(stu.StudentID).toLowerCase() : '';
        } else if (
          searchField === 'Full Name' || searchField.toLowerCase() === 'fullname' || searchField.toLowerCase() === 'full name'
        ) {
          fieldValue = stu.FullName ? String(stu.FullName).toLowerCase() : '';
        } else if (
          searchField === 'DOB' || searchField.toLowerCase() === 'dob' || searchField.toLowerCase() === 'birth date' || searchField.toLowerCase() === 'birthdate'
        ) {
          fieldValue = stu.BirthDate ? String(stu.BirthDate).toLowerCase() : '';
        } else if (
          searchField === 'Major' || searchField.toLowerCase() === 'major'
        ) {
          fieldValue = stu.Major ? String(stu.Major).toLowerCase() : '';
        } else {
          fieldValue = stu[searchField] ? String(stu[searchField]).toLowerCase() : '';
        }
        // So sánh exact match cho 4 mục, còn lại thì includes
        if (
          searchField === 'Student ID' || searchField.toLowerCase() === 'studentid' || searchField.toLowerCase() === 'student id' ||
          searchField === 'Full Name' || searchField.toLowerCase() === 'fullname' || searchField.toLowerCase() === 'full name' ||
          searchField === 'DOB' || searchField.toLowerCase() === 'dob' || searchField.toLowerCase() === 'birth date' || searchField.toLowerCase() === 'birthdate' ||
          searchField === 'Major' || searchField.toLowerCase() === 'major'
        ) {
          return fieldValue === term;
        } else {
          return fieldValue.includes(term);
        }
      });
    }
    setFilteredStudents(studentsToProcess);
    setCurrentPage(1);
  }, [allStudents, searchTerm, searchField, filterName, filterField]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsToDisplay = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else if (totalPages === 0 || pageNumber < 1) {
      setCurrentPage(1);
    }
  };

  // NOTE: 4. Thêm hàm xử lý khi thêm sinh viên mới
  const handleAddStudentSubmit = async (newStudentData) => {
    // Ensure all fields are present
    const newStudentEntry = {
      StudentID: newStudentData.StudentID || newStudentData.studentId || '',
      FullName: newStudentData.FullName || newStudentData.fullName || '',
      DOB: newStudentData.DOB || newStudentData.dob || newStudentData.BirthDate || '',
      Major: newStudentData.Major || newStudentData.major || '',
      id: `student-${newStudentData.StudentID || newStudentData.studentId || Date.now()}`,
      avatar: DefaultAvatarIcon,
    };
    try {
      await fetch('http://localhost:3001/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudentEntry),
      });
      // Fetch latest list from backend
      const res = await fetch('http://localhost:3001/api/students');
      const data = await res.json();
      setAllStudents(data);
      // Set to last page to show the newly added student at the end
      const totalPages = Math.ceil(data.length / itemsPerPage);
      setCurrentPage(totalPages);
    } catch (e) {
      console.error('Failed to add student to backend:', e);
    }
    setIsAddStudentModalOpen(false);
  };

  return (
    <div className="student-content-container">
      <div className="student-header">
        <h1 className="student-title">Student</h1>
        <button
          className="add-student-button"
          onClick={() => {
            console.log('Add Student Clicked')
            setIsAddStudentModalOpen(true);
          }}
        >
          <img src={PlusIcon} alt="Add" className="add-student-icon" />
          Add Student
        </button>
      </div>
      {/* Filter box + dropdown */}
      <div style={{ margin: '16px 0', display: 'flex', gap: 8 }}>
        <select
          value={filterField}
          onChange={e => setFilterField(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="Full Name">Full Name</option>
          <option value="Student ID">Student ID</option>
          <option value="DOB">DOB</option>
          <option value="Major">Major</option>
        </select>
        <input
          type="text"
          placeholder={`Filter by ${filterField}...`}
          value={filterName}
          onChange={e => setFilterName(e.target.value)}
          style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div className="student-list">
        {currentItemsToDisplay.length > 0 ? (
          currentItemsToDisplay.map((student) => (
            <StudentCard
              key={student.id}
              studentData={student}
              // onEdit={handleOpenEditModal} // Sẽ dùng sau
            />
          ))
        ) : (
          <p className="no-items-message">No students found.</p>
        )}
      </div>

      {totalPages > 0 && (
        <div className="pagination-controls">
          <button onClick={() => paginate(1)} disabled={currentPage === 1} className="pagination-button" title="First Page">&#171;</button>
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">&larr;</button>
          <span className="pagination-info">
            {filteredStudents.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredStudents.length)}` : '0'} of {filteredStudents.length}
          </span>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || filteredStudents.length === 0} className="pagination-button">&rarr;</button>
          <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages || filteredStudents.length === 0} className="pagination-button" title="Last Page">&#187;</button>
        </div>
      )}

      {/* NOTE: 5. Render AddStudentModal */}
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => {
            console.log('Closing AddStudentModal.');
            setIsAddStudentModalOpen(false);
        }}
        onAddStudent={handleAddStudentSubmit}
      />
    </div>
  );
};

export default StudentContent;
