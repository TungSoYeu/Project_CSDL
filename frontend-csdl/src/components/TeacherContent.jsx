import React, { useState, useEffect } from 'react';
import './TeacherContent.css'; 
import PlusIcon from '../asset/image/top-section/plus.svg';
import DefaultAvatarIcon from '../asset/image/avatar/default-avatar.svg'; 
import AddTeacherModal from './AddTeacherModal.jsx';

// --- COMPONENT THẺ GIÁO VIÊN ---
const TeacherCard = ({ teacherData }) => { 
  return (
    <div className="teacher-card"> 
      <div className="teacher-card-decorator"></div>
      <div className="teacher-card-avatar-section">
        <img src={teacherData.avatar || DefaultAvatarIcon} alt={`${teacherData.FullName}'s Avatar`} className="teacher-avatar" />
      </div>
      <div className="teacher-card-info">
        <div className="info-group teacher-id-group">
            <span className="info-label">Teacher ID</span>
            <span className="info-value teacher-id-value">{teacherData.TeacherID}</span>
        </div>
        <div className="info-group teacher-name-group">
            <span className="info-label">Full Name</span>
            <span className="info-value teacher-name-value">{teacherData.FullName}</span>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const TeacherContent = ({ searchTerm, searchField }) => {
  const [allTeachers, setAllTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // NOTE: State cho AddTeacherModal
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/teachers')
      .then(res => res.json())
      .then(data => setAllTeachers(data))
      .catch(() => setAllTeachers([]));
  }, []);

  useEffect(() => {
    let teachersToProcess = [...allTeachers];
    if (searchTerm && searchField && teachersToProcess.length > 0) {
      const term = String(searchTerm).toLowerCase();
      teachersToProcess = teachersToProcess.filter(tc => {
        let fieldValue = '';
        if (
          searchField === 'Teacher ID' || searchField.toLowerCase() === 'teacherid' || searchField.toLowerCase() === 'teacher id'
        ) {
          fieldValue = tc.TeacherID ? String(tc.TeacherID).toLowerCase() : '';
        } else if (
          searchField === 'Full Name' || searchField.toLowerCase() === 'fullname' || searchField.toLowerCase() === 'full name'
        ) {
          fieldValue = tc.FullName ? String(tc.FullName).toLowerCase() : '';
        } else {
          fieldValue = tc[searchField] ? String(tc[searchField]).toLowerCase() : '';
        }
        // So sánh exact match cho 2 mục, còn lại thì includes
        if (
          searchField === 'Teacher ID' || searchField.toLowerCase() === 'teacherid' || searchField.toLowerCase() === 'teacher id' ||
          searchField === 'Full Name' || searchField.toLowerCase() === 'fullname' || searchField.toLowerCase() === 'full name'
        ) {
          return fieldValue === term;
        } else {
          return fieldValue.includes(term);
        }
      });
    }
    setFilteredTeachers(teachersToProcess);
    setCurrentPage(1);
  }, [allTeachers, searchTerm, searchField]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsToDisplay = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else if (totalPages === 0 || pageNumber < 1) {
      setCurrentPage(1);
    }
  };

  // NOTE: Hàm xử lý khi thêm giáo viên mới
  const handleAddTeacherSubmit = async (newTeacherData) => {
    // Ensure all fields are present
    const newTeacherEntry = {
      TeacherID: newTeacherData.TeacherID || newTeacherData.teacherId || '',
      FullName: newTeacherData.FullName || newTeacherData.fullName || '',
      id: `teacher-${newTeacherData.TeacherID || newTeacherData.teacherId || Date.now()}`,
      avatar: DefaultAvatarIcon,
    };
    try {
      await fetch('http://localhost:3001/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeacherEntry),
      });
      // Fetch latest list from backend
      const res = await fetch('http://localhost:3001/api/teachers');
      const data = await res.json();
      setAllTeachers(data);
      // Set to last page to show the newly added teacher at the end
      const totalPages = Math.ceil(data.length / itemsPerPage);
      setCurrentPage(totalPages);
    } catch (e) {
      console.error('Failed to add teacher to backend:', e);
    }
    setIsAddTeacherModalOpen(false);
  };

  return (
    <div className="teacher-content-container">
      <div className="teacher-header">
        <h1 className="teacher-title">Teacher</h1>
        <button
          className="add-teacher-button"
          onClick={() => setIsAddTeacherModalOpen(true)}
        >
          <img src={PlusIcon} alt="Add" className="add-teacher-icon" />
          Add Teacher
        </button>
      </div>

      <div className="teacher-list">
        {currentItemsToDisplay.length > 0 ? (
          currentItemsToDisplay.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacherData={teacher}
            />
          ))
        ) : (
          <p className="no-items-message">No teachers found.</p>
        )}
      </div>

      {totalPages > 0 && (
        <div className="pagination-controls">
          <button onClick={() => paginate(1)} disabled={currentPage === 1} className="pagination-button" title="First Page">&#171;</button>
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">&larr;</button>
          <span className="pagination-info">
            {filteredTeachers.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredTeachers.length)}` : '0'} of {filteredTeachers.length}
          </span>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || filteredTeachers.length === 0} className="pagination-button">&rarr;</button>
          <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages || filteredTeachers.length === 0} className="pagination-button" title="Last Page">&#187;</button>
        </div>
      )}

      {/* NOTE: Render AddTeacherModal */}
      <AddTeacherModal
        isOpen={isAddTeacherModalOpen}
        onClose={() => setIsAddTeacherModalOpen(false)}
        onAddTeacher={handleAddTeacherSubmit}
      />
    </div>
  );
};

export default TeacherContent;