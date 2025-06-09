import React, { useState, useEffect } from 'react';
import './StudentContent.css'; 
import AddStudentModal from './AddStudentModal';
import PlusIcon from '../asset/image/top-section/plus.svg';
import DefaultAvatarIcon from '../asset/image/avatar/default-avatar.svg'; 

// --- COMPONENT THẺ SINH VIÊN ---
const StudentCard = ({ studentData }) => {
  return (
    <div className="student-card">
      <div className="student-card-info">
        <div className="info-group student-id-group">
          <span className="info-label">Student ID</span>
          <span className="info-value student-id-value">{studentData.StudentID}</span>
        </div>
        <div className="info-group student-name-group">
          <span className="info-label">Full Name</span>
          <span className="info-value student-name-value">{studentData.FullName}</span>
        </div>
        <div className="info-group student-birthdate-group">
          <span className="info-label">Birth Date</span>
          <span className="info-value student-birthdate-value">{studentData.BirthDate}</span>
        </div>
        <div className="info-group student-major-group">
          <span className="info-label">Major</span>
          <span className="info-value student-major-value">{studentData.Major}</span>
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
  }, [allStudents, searchTerm, searchField]);

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
  const handleAddStudentSubmit = (newStudentData) => {
    console.log('Adding new student from modal:', newStudentData);
    const newStudentEntry = {
      ...newStudentData, // studentId, fullName, dob, major từ form
      id: `student-${newStudentData.studentId}-${Date.now()}`, // Tạo ID duy nhất
      avatar: DefaultAvatarIcon, // Gán avatar mặc định
    };
    setAllStudents(prevStudents => [newStudentEntry, ...prevStudents]); // Thêm vào đầu danh sách
    setIsAddStudentModalOpen(false); // Đóng modal
    setCurrentPage(1); // Chuyển về trang đầu để thấy sinh viên mới (hoặc trang cuối)
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
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">&larr;</button>
          <span className="pagination-info">
            {filteredStudents.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredStudents.length)}` : '0'} of {filteredStudents.length}
          </span>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || filteredStudents.length === 0} className="pagination-button">&rarr;</button>
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