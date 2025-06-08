import React, { useState, useEffect } from 'react';
import './ClassContent.css';
import PlusIcon from '../asset/image/top-section/plus.svg';
import AddClassModal from './AddClassModal';

// --- COMPONENT THẺ LỚP HỌC ---
const ClassCard = ({ classData }) => {
  return (
    <div className="class-card"> 
      <div className="class-card-decorator"></div> 
      {/* Không có avatar cho Class */}
      <div className="class-card-info">
        <div className="info-group class-id-group">
            <span className="info-label">Class ID</span>
            <span className="info-value class-id-value">{classData.ClassID || classData.classId}</span>
        </div>
        <div className="info-group subject-id-group">
            <span className="info-label">Subject</span>
            <span className="info-value subject-id-value">{classData.SubjectName || classData.subjectId}</span>
        </div>
        <div className="info-group teacher-id-group-class">
            <span className="info-label">Teacher</span>
            <span className="info-value teacher-id-value-class">{classData.TeacherName || classData.teacherId}</span>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const ClassContent = ({ searchTerm, searchField }) => {
  const [allClasses, setAllClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/classes')
      .then(res => res.json())
      .then(data => setAllClasses(data))
      .catch(() => setAllClasses([]));
  }, []);

  useEffect(() => {
    let classesToProcess = [...allClasses];
    if (searchTerm && searchField && classesToProcess.length > 0) {
        const term = searchTerm.toLowerCase();
        classesToProcess = classesToProcess.filter(cls => { 
            const fieldValue = cls[searchField] ? String(cls[searchField]).toLowerCase() : '';
            return fieldValue.includes(term);
        });
    }
    setFilteredClasses(classesToProcess);
    setCurrentPage(1);
  }, [allClasses, searchTerm, searchField]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsToDisplay = filteredClasses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else if (totalPages === 0 || pageNumber < 1) {
      setCurrentPage(1);
    }
  };

  // NOTE: Hàm xử lý khi thêm lớp học mới
  const handleAddClassSubmit = (newClassData) => {
    const newClassEntry = {
      ...newClassData, 
      id: `class-${newClassData.classId}-${Date.now()}`,
    };
    setAllClasses(prevClasses => [newClassEntry, ...prevClasses]);
    setIsAddClassModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="class-content-container">
      <div className="class-header">
        <h1 className="class-title">Class</h1>
        <button
          className="add-class-button"
          onClick={() => setIsAddClassModalOpen(true)}
        >
          <img src={PlusIcon} alt="Add" className="add-class-icon" />
          Add Class
        </button>
      </div>

      <div className="class-list">
        {currentItemsToDisplay.length > 0 ? (
          currentItemsToDisplay.map((cls) => ( 
            <ClassCard
              key={cls.id}
              classData={cls}
            />
          ))
        ) : (
          <p className="no-items-message">No classes found.</p>
        )}
      </div>

      {totalPages > 0 && (
        <div className="pagination-controls">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">&larr;</button>
          <span className="pagination-info">
            {filteredClasses.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredClasses.length)}` : '0'} of {filteredClasses.length}
          </span>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || filteredClasses.length === 0} className="pagination-button">&rarr;</button>
        </div>
      )}

      {/* NOTE: Render AddClassModal */}
      <AddClassModal
        isOpen={isAddClassModalOpen}
        onClose={() => setIsAddClassModalOpen(false)}
        onAddClass={handleAddClassSubmit}
      />
    </div>
  );
};

export default ClassContent;