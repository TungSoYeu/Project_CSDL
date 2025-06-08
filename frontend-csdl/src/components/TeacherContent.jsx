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
        <img src={teacherData.avatar || DefaultAvatarIcon} alt={`${teacherData.FullName || teacherData.fullName}'s Avatar`} className="teacher-avatar" />
      </div>
      <div className="teacher-card-info">
        <div className="info-group teacher-id-group">
            <span className="info-label">Teacher ID</span>
            <span className="info-value teacher-id-value">{teacherData.TeacherID || teacherData.teacherId}</span>
        </div>
        <div className="info-group teacher-name-group">
            <span className="info-label">Full Name</span>
            <span className="info-value teacher-name-value">{teacherData.FullName || teacherData.fullName}</span>
        </div>
        <div className="info-group teacher-avatar-group">
            <span className="info-label">Avatar</span>
            <span className="info-value teacher-avatar-value">{teacherData.avatar ? 'Có' : 'Mặc định'}</span>
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
      const term = searchTerm.toLowerCase();
      teachersToProcess = teachersToProcess.filter(tc => {
        const fieldValue = tc[searchField] ? String(tc[searchField]).toLowerCase() : '';
        return fieldValue.includes(term);
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
  const handleAddTeacherSubmit = (newTeacherData) => {
    const newTeacherEntry = {
      ...newTeacherData, 
      id: `teacher-${newTeacherData.teacherId}-${Date.now()}`,
      avatar: DefaultAvatarIcon,
    };
    setAllTeachers(prevTeachers => [newTeacherEntry, ...prevTeachers]);
    setIsAddTeacherModalOpen(false);
    setCurrentPage(1);
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
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">&larr;</button>
          <span className="pagination-info">
            {filteredTeachers.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredTeachers.length)}` : '0'} of {filteredTeachers.length}
          </span>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || filteredTeachers.length === 0} className="pagination-button">&rarr;</button>
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