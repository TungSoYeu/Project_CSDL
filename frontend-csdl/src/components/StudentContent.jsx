import React, { useState, useEffect } from 'react';
import './StudentContent.css'; 
import AddStudentModal from './AddStudentModal';
import PlusIcon from '../asset/image/top-section/plus.svg';
import DefaultAvatarIcon from '../asset/image/avatar/default-avatar.svg'; 

// --- COMPONENT THẺ SINH VIÊN ---
const StudentCard = ({ studentData, onEdit }) => {
  return (
    <div className="student-card">
      <div className="student-card-decorator"></div>
      <div className="student-card-avatar-section">
        <img src={studentData.avatar} alt={`${studentData.fullName}'s Avatar`} className="student-avatar" />
      </div>
      <div className="student-card-info">
        <div className="info-group student-name-group">
            <span className="info-label">Full Name</span>
            <span className="info-value student-name-value">{studentData.fullName}</span>
        </div>
        <div className="info-group student-id-group">
            <span className="info-label">Student ID</span>
            <span className="info-value student-id-value">{studentData.studentId}</span>
        </div>
        <div className="info-group student-dob-group">
            <span className="info-label">DOB</span>
            <span className="info-value student-dob-value">{studentData.dob}</span>
        </div>
        <div className="info-group student-major-group">
            <span className="info-label">Major</span>
            <span className="info-value student-major-value">{studentData.major}</span>
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
      const term = searchTerm.toLowerCase();
      studentsToProcess = studentsToProcess.filter(stu => {
        const fieldValue = stu[searchField] ? String(stu[searchField]).toLowerCase() : '';
        return fieldValue.includes(term);
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