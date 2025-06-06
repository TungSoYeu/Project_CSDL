import React, { useState, useEffect } from 'react';
import './ClassContent.css';
import PlusIcon from '../asset/image/top-section/plus.svg';
import AddClassModal from './AddClassModal';

// --- DỮ LIỆU MẪU CHO LỚP HỌC ---
const generateMockClasses = (count = 20) => {
  const mockClasses = [];
  const subjectIdPrefixes = ["IT", "MI", "PH", "EE", "SSH", "EM"];
  const teacherIdPrefixes = ["GV"];

  const usedClassIds = new Set();

  for (let i = 1; i <= count; i++) {
    let classId;
    do {
      classId = `CL${String(10000 + Math.floor(Math.random() * 9000)).padStart(5, '0')}`;
    } while (usedClassIds.has(classId));
    usedClassIds.add(classId);

    const subjectId = subjectIdPrefixes[Math.floor(Math.random() * subjectIdPrefixes.length)] + String(Math.floor(Math.random() * 3000) + 1000).padStart(4, '0');
    const teacherId = teacherIdPrefixes[Math.floor(Math.random() * teacherIdPrefixes.length)] + String(1000 + Math.floor(Math.random() * 900)).padStart(4, '0');


    mockClasses.push({
      id: `class-${classId}-${Date.now()}-${i}`, // ID duy nhất
      classId,
      subjectId,
      teacherId,
    });
  }
  return mockClasses;
};

// --- COMPONENT THẺ LỚP HỌC ---
const ClassCard = ({ classData /*, onEdit */ }) => {
  return (
    <div className="class-card"> 
      <div className="class-card-decorator"></div> 
      {/* Không có avatar cho Class */}
      <div className="class-card-info">
        <div className="info-group class-id-group">
            <span className="info-label">Class ID</span>
            <span className="info-value class-id-value">{classData.classId}</span>
        </div>
        <div className="info-group subject-id-group">
            <span className="info-label">Subject ID</span>
            <span className="info-value subject-id-value">{classData.subjectId}</span>
        </div>
        <div className="info-group teacher-id-group-class"> {/* Đổi tên class để tránh xung đột */}
            <span className="info-label">Teacher ID</span>
            <span className="info-value teacher-id-value-class">{classData.teacherId}</span>
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

  // NOTE: State cho AddClassModal
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);

  useEffect(() => {
    const generatedClasses = generateMockClasses(20);
    setAllClasses(generatedClasses);
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