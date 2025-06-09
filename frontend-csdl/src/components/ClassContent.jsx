import React, { useState, useEffect } from 'react';
import './ClassContent.css';
import PlusIcon from '../asset/image/top-section/plus.svg';
import AddClassModal from './AddClassModal';

// --- COMPONENT THẺ LỚP HỌC ---
const ClassCard = ({ classData }) => {
  return (
    <div className="class-card"> 
      <div className="class-card-decorator"></div> 
      <div className="class-card-info">
        <div className="info-group class-id-group">
            <span className="info-label">Class ID</span>
            <span className="info-value class-id-value">{classData.ClassID}</span>
        </div>
        <div className="info-group subject-id-group">
            <span className="info-label">Subject</span>
            <span className="info-value subject-id-value">{classData.SubjectName} ({classData.SubjectID})</span>
        </div>
        <div className="info-group teacher-id-group-class">
            <span className="info-label">Teacher</span>
            <span className="info-value teacher-id-value-class">{classData.TeacherName} ({classData.TeacherID})</span>
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
      const term = String(searchTerm).toLowerCase();
      classesToProcess = classesToProcess.filter(cls => {
        let fieldValue = '';
        if (
          searchField === 'Class ID' || searchField.toLowerCase() === 'classid' || searchField.toLowerCase() === 'class id'
        ) {
          fieldValue = cls.ClassID ? String(cls.ClassID).toLowerCase() : '';
        } else if (
          searchField === 'Subject ID' || searchField.toLowerCase() === 'subjectid' || searchField.toLowerCase() === 'subject id'
        ) {
          fieldValue = cls.SubjectID ? String(cls.SubjectID).toLowerCase() : '';
        } else if (
          searchField === 'Teacher ID' || searchField.toLowerCase() === 'teacherid' || searchField.toLowerCase() === 'teacher id'
        ) {
          fieldValue = cls.TeacherID ? String(cls.TeacherID).toLowerCase() : '';
        } else {
          fieldValue = cls[searchField] ? String(cls[searchField]).toLowerCase() : '';
        }
        // So sánh exact match cho 3 mục, còn lại thì includes
        if (
          searchField === 'Class ID' || searchField.toLowerCase() === 'classid' || searchField.toLowerCase() === 'class id' ||
          searchField === 'Subject ID' || searchField.toLowerCase() === 'subjectid' || searchField.toLowerCase() === 'subject id' ||
          searchField === 'Teacher ID' || searchField.toLowerCase() === 'teacherid' || searchField.toLowerCase() === 'teacher id'
        ) {
          return fieldValue === term;
        } else {
          return fieldValue.includes(term);
        }
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
  const handleAddClassSubmit = async (newClassData) => {
    // Ensure all fields are present
    const newClassEntry = {
      ClassID: newClassData.ClassID || newClassData.classId || '',
      SubjectID: newClassData.SubjectID || newClassData.subjectId || '',
      TeacherID: newClassData.TeacherID || newClassData.teacherId || '',
      id: `class-${newClassData.ClassID || newClassData.classId || Date.now()}`,
    };
    try {
      await fetch('http://localhost:3001/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClassEntry),
      });
      // Fetch latest list from backend
      const res = await fetch('http://localhost:3001/api/classes');
      const data = await res.json();
      setAllClasses(data);
      // Set to last page to show the newly added class at the end
      const totalPages = Math.ceil(data.length / itemsPerPage);
      setCurrentPage(totalPages);
    } catch (e) {
      console.error('Failed to add class to backend:', e);
    }
    setIsAddClassModalOpen(false);
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
          <button onClick={() => paginate(1)} disabled={currentPage === 1} className="pagination-button" title="First Page">&#171;</button>
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">&larr;</button>
          <span className="pagination-info">
            {filteredClasses.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredClasses.length)}` : '0'} of {filteredClasses.length}
          </span>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || filteredClasses.length === 0} className="pagination-button">&rarr;</button>
          <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages || filteredClasses.length === 0} className="pagination-button" title="Last Page">&#187;</button>
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