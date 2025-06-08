import React, { useState, useEffect } from 'react';
import './SubjectContent.css';
import PlusIcon from '../asset/image/top-section/plus.svg';
import AddSubjectModal from './AddSubjectModal';

// --- COMPONENT THẺ MÔN HỌC ---
const SubjectCard = ({ subjectData }) => {
  return (
    <div className="subject-card">
      <div className="subject-card-info">
        <span className="subject-name-main">{subjectData.subjectName}</span>
        <span className="subject-id-sub">Subject ID: {subjectData.subjectId}</span>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const SubjectContent = ({ searchTerm, searchField }) => {
  const [allSubjects, setAllSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/subjects')
      .then(res => res.json())
      .then(data => setAllSubjects(data))
      .catch(() => setAllSubjects([]));
  }, []);

  useEffect(() => {
    let subjectsToProcess = [...allSubjects];
    if (searchTerm && searchField && subjectsToProcess.length > 0) {
      const term = searchTerm.toLowerCase();
      subjectsToProcess = subjectsToProcess.filter(sb => {
        const fieldValue = sb[searchField] ? String(sb[searchField]).toLowerCase() : '';
        return fieldValue.includes(term);
      });
    }
    setFilteredSubjects(subjectsToProcess);
    setCurrentPage(1);
  }, [allSubjects, searchTerm, searchField]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsToDisplay = filteredSubjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else if (totalPages === 0 || pageNumber < 1) {
      setCurrentPage(1);
    }
  };

  const handleAddSubjectSubmit = (newSubjectData) => {
    const newSubjectEntry = {
      ...newSubjectData,
      id: `subject-${newSubjectData.subjectId}-${Date.now()}`,
    };
    setAllSubjects(prevSubjects => [newSubjectEntry, ...prevSubjects]);
    setIsAddSubjectModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="subject-content-container">
      <div className="subject-header">
        <h1 className="subject-title">Subject</h1>
        <button
          className="add-subject-button"
          onClick={() => setIsAddSubjectModalOpen(true)}
        >
          <img src={PlusIcon} alt="Add" className="add-subject-icon" />
          Add Subject
        </button>
      </div>
      <div className="subject-list">
        {currentItemsToDisplay.length > 0 ? (
          currentItemsToDisplay.map((subject) => (
            <SubjectCard
              key={subject.id}
              subjectData={subject}
            />
          ))
        ) : (
          <p className="no-items-message">No subjects found.</p>
        )}
      </div>

      {totalPages > 0 && (
        <div className="pagination-controls">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">&larr;</button>
          <span className="pagination-info">
            {filteredSubjects.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredSubjects.length)}` : '0'} of {filteredSubjects.length}
          </span>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || filteredSubjects.length === 0} className="pagination-button">&rarr;</button>
        </div>
      )}

      <AddSubjectModal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        onAddSubject={handleAddSubjectSubmit}
      />
    </div>
  );
};

export default SubjectContent;