import React, { useState, useEffect } from 'react';
import './SubjectContent.css';
import PlusIcon from '../asset/image/top-section/plus.svg';
import AddSubjectModal from './AddSubjectModal';

// --- COMPONENT THẺ MÔN HỌC ---
const SubjectCard = ({ subjectData }) => {
  return (
    <div className="subject-card">
      <div className="subject-card-info">
        <div className="info-group subject-id-group">
          <span className="info-label">Subject ID</span>
          <span className="info-value subject-id-value">{subjectData.SubjectID}</span>
        </div>
        <div className="info-group subject-name-group">
          <span className="info-label">Subject Name</span>
          <span className="info-value subject-name-value">{subjectData.SubjectName}</span>
        </div>
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
      const term = String(searchTerm).toLowerCase();
      subjectsToProcess = subjectsToProcess.filter(sub => {
        let fieldValue = '';
        if (
          searchField === 'Subject ID' || searchField.toLowerCase() === 'subjectid' || searchField.toLowerCase() === 'subject id'
        ) {
          fieldValue = sub.SubjectID ? String(sub.SubjectID).toLowerCase() : '';
        } else if (
          searchField === 'Subject Name' || searchField.toLowerCase() === 'subjectname' || searchField.toLowerCase() === 'subject name'
        ) {
          fieldValue = sub.SubjectName ? String(sub.SubjectName).toLowerCase() : '';
        } else {
          fieldValue = sub[searchField] ? String(sub[searchField]).toLowerCase() : '';
        }
        // So sánh exact match cho 2 mục, còn lại thì includes
        if (
          searchField === 'Subject ID' || searchField.toLowerCase() === 'subjectid' || searchField.toLowerCase() === 'subject id' ||
          searchField === 'Subject Name' || searchField.toLowerCase() === 'subjectname' || searchField.toLowerCase() === 'subject name'
        ) {
          return fieldValue === term;
        } else {
          return fieldValue.includes(term);
        }
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

  const handleAddSubjectSubmit = async (newSubjectData) => {
    // Ensure all fields are present
    const newSubjectEntry = {
      SubjectID: newSubjectData.SubjectID || newSubjectData.subjectId || '',
      SubjectName: newSubjectData.SubjectName || newSubjectData.subjectName || '',
      id: `subject-${newSubjectData.SubjectID || newSubjectData.subjectId || Date.now()}`,
    };
    try {
      await fetch('http://localhost:3001/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubjectEntry),
      });
      // Fetch latest list from backend
      const res = await fetch('http://localhost:3001/api/subjects');
      const data = await res.json();
      setAllSubjects(data);
      // Set to last page to show the newly added subject at the end
      const totalPages = Math.ceil(data.length / itemsPerPage);
      setCurrentPage(totalPages);
    } catch (e) {
      console.error('Failed to add subject to backend:', e);
    }
    setIsAddSubjectModalOpen(false);
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
          <button onClick={() => paginate(1)} disabled={currentPage === 1} className="pagination-button" title="First Page">&#171;</button>
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">&larr;</button>
          <span className="pagination-info">
            {filteredSubjects.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredSubjects.length)}` : '0'} of {filteredSubjects.length}
          </span>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || filteredSubjects.length === 0} className="pagination-button">&rarr;</button>
          <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages || filteredSubjects.length === 0} className="pagination-button" title="Last Page">&#187;</button>
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