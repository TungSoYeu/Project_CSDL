import React, { useState, useEffect } from 'react';

import './ScoreContent.css';
import PlusIcon from '../asset/image/top-section/plus.svg';
import AddScoreModal from './AddScoreModal'; 
import EditScoreModal from './EditScoreModal';

// --- COMPONENT THẺ ĐIỂM ---
const ScoreCard = ({ scoreData, onEdit }) => {
  return (
    <div className="score-card">
      <div className="score-card-info">
        <div className="info-group score-student-id-group">
          <span className="info-label">Student ID</span>
          <span className="info-value score-student-id-value">{scoreData.StudentID}</span>
        </div>
        <div className="info-group score-student-name-group">
          <span className="info-label">Full Name</span>
          <span className="info-value score-student-name-value">{scoreData.FullName}</span>
        </div>
        <div className="info-group score-class-id-group">
          <span className="info-label">Class ID</span>
          <span className="info-value score-class-id-value">{scoreData.ClassID}</span>
        </div>
        <div className="info-group score-subject-id-group">
          <span className="info-label">Subject ID</span>
          <span className="info-value score-subject-id-value">{scoreData.SubjectID}</span>
        </div>
        <div className="info-group score-subject-name-group">
          <span className="info-label">Subject Name</span>
          <span className="info-value score-subject-name-value">{scoreData.SubjectName}</span>
        </div>
        <div className="info-group score-score-group">
          <span className="info-label">Score</span>
          <span className="info-value score-score-value">{scoreData.Score}</span>
        </div>
      </div>
      <button className="edit-score-btn" onClick={() => onEdit(scoreData)}>
        Edit
      </button>
    </div>
  );
};


// --- COMPONENT CHÍNH ---
const ScoreContent = ({ searchTerm, searchField }) => {
  const [allScores, setAllScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [scoreFrom, setScoreFrom] = useState('');
  const [scoreTo, setScoreTo] = useState('');
  const [currentSort, setCurrentSort] = useState('original');

  // NOTE: State để quản lý việc mở/đóng modal
  const [isAddScoreModalOpen, setIsAddScoreModalOpen] = useState(false);
  const [isEditScoreModalOpen, setIsEditScoreModalOpen] = useState(false);
  const [editingScore, setEditingScore] = useState(null); // Lưu dữ liệu điểm đang sửa


  useEffect(() => {
    fetch('http://localhost:3001/api/scores')
      .then(res => res.json())
      .then(data => setAllScores(data))
      .catch(() => setAllScores([]));
  }, []);

  useEffect(() => {
    let scoresToProcess = [...allScores];
    // Lọc theo tìm kiếm
    if (searchTerm && searchField && scoresToProcess.length > 0) {
      const term = searchTerm.toLowerCase();
      scoresToProcess = scoresToProcess.filter(sc => {
        let fieldValue = '';
        // So sánh chính xác label searchField
        if (searchField === 'Student ID' || searchField.toLowerCase() === 'studentid' || searchField.toLowerCase() === 'student id') {
          fieldValue = sc.StudentID ? String(sc.StudentID).toLowerCase() : '';
        } else if (searchField === 'Subject ID' || searchField.toLowerCase() === 'subjectid' || searchField.toLowerCase() === 'subject id') {
          fieldValue = sc.SubjectID ? String(sc.SubjectID).toLowerCase() : '';
        } else if (searchField === 'Class ID' || searchField.toLowerCase() === 'classid' || searchField.toLowerCase() === 'class id') {
          fieldValue = sc.ClassID ? String(sc.ClassID).toLowerCase() : '';
        } else {
          fieldValue = sc[searchField] ? String(sc[searchField]).toLowerCase() : '';
        }
        return fieldValue === term;
      });
    }
    // Sắp xếp theo currentSort
    if (currentSort === 'highest') {
      scoresToProcess.sort((a, b) => b.Score - a.Score);
    } else if (currentSort === 'lowest') {
      scoresToProcess.sort((a, b) => a.Score - b.Score);
    }
    setFilteredScores(scoresToProcess);
    setCurrentPage(1);
  }, [allScores, searchTerm, searchField, currentSort]);

  // Lọc theo khoảng điểm và sắp xếp khi nhấn Apply hoặc đổi sort
  const handleApplyFilter = () => {
    let scoresToProcess = [...allScores];
    // 1. Lọc theo tìm kiếm (StudentID, SubjectID, ClassID...)
    if (searchTerm && searchField && scoresToProcess.length > 0) {
      const term = searchTerm.toLowerCase();
      scoresToProcess = scoresToProcess.filter(sc => {
        let fieldValue = '';
        // So sánh chính xác label searchField
        if (searchField === 'Student ID' || searchField.toLowerCase() === 'studentid' || searchField.toLowerCase() === 'student id') {
          fieldValue = sc.StudentID ? String(sc.StudentID).toLowerCase() : '';
        } else if (searchField === 'Subject ID' || searchField.toLowerCase() === 'subjectid' || searchField.toLowerCase() === 'subject id') {
          fieldValue = sc.SubjectID ? String(sc.SubjectID).toLowerCase() : '';
        } else if (searchField === 'Class ID' || searchField.toLowerCase() === 'classid' || searchField.toLowerCase() === 'class id') {
          fieldValue = sc.ClassID ? String(sc.ClassID).toLowerCase() : '';
        } else {
          fieldValue = sc[searchField] ? String(sc[searchField]).toLowerCase() : '';
        }
        return fieldValue === term;
      });
    }
    // 2. Lọc theo khoảng điểm
    if (scoreFrom !== '' || scoreTo !== '') {
      const from = scoreFrom === '' ? -Infinity : parseFloat(scoreFrom);
      const to = scoreTo === '' ? Infinity : parseFloat(scoreTo);
      scoresToProcess = scoresToProcess.filter(
        (score) => score.Score >= from && score.Score <= to
      );
    }
    // 3. Sắp xếp
    if (currentSort === 'highest') {
      scoresToProcess.sort((a, b) => b.Score - a.Score);
    } else if (currentSort === 'lowest') {
      scoresToProcess.sort((a, b) => a.Score - b.Score);
    }
    setFilteredScores(scoresToProcess);
    setCurrentPage(1);
  };

  // Luôn sắp xếp lại filteredScores khi đổi sort, nhưng chỉ trong phạm vi đã lọc
  useEffect(() => {
    // Chỉ sort lại nếu đã có filter (filteredScores.length > 0)
    if (filteredScores.length > 0) {
      let sorted = [...filteredScores];
      if (currentSort === 'highest') {
        sorted.sort((a, b) => b.Score - a.Score);
      } else if (currentSort === 'lowest') {
        sorted.sort((a, b) => a.Score - b.Score);
      }
      setFilteredScores(sorted);
    }
    // eslint-disable-next-line
  }, [currentSort]);

  const indexOfLastScore = currentPage * itemsPerPage;
  const indexOfFirstScore = indexOfLastScore - itemsPerPage;
  const currentScoresToDisplay = filteredScores.slice(indexOfFirstScore, indexOfLastScore);
  const totalPages = Math.ceil(filteredScores.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
    else if (totalPages === 0 || pageNumber < 1) {
      setCurrentPage(1);
    }
  };

  // NOTE: Hàm xử lý khi submit form từ modal
  const handleAddScoreSubmit = async (newScoreData) => {
    const newScoreEntry = {
      StudentID: newScoreData.StudentID || newScoreData.studentId || '',
      SubjectID: newScoreData.SubjectID || newScoreData.subjectId || '',
      ClassID: newScoreData.ClassID || newScoreData.classId || '',
      Score: newScoreData.Score || newScoreData.score || '',
      id: `score-${newScoreData.StudentID || newScoreData.studentId || Date.now()}`,
    };
    try {
      await fetch('http://localhost:3001/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newScoreEntry),
      });
      // Fetch latest list from backend
      const res = await fetch('http://localhost:3001/api/scores');
      const data = await res.json();
      setAllScores(data);
      setFilteredScores(data); // Ensure filteredScores is updated
      setCurrentPage(1); // Chuyển về trang đầu để score mới hiển thị lên đầu
    } catch (e) {
      console.error('Failed to add score to backend:', e);
    }
    setIsAddScoreModalOpen(false);
  };

  // NOTE: 4. Thêm Hàm Xử Lý cho Edit Modal
  const handleOpenEditModal = (scoreToEdit) => {
    console.log('[ScoreContent] handleOpenEditModal called. Current isAddScoreModalOpen:', isAddScoreModalOpen, 'Current isEditScoreModalOpen:', isEditScoreModalOpen);
    console.log('[ScoreContent] handleOpenEditModal - scoreToEdit:', scoreToEdit);
    setIsAddScoreModalOpen(false); 
    setEditingScore(scoreToEdit);
    setIsEditScoreModalOpen(true);
    console.log('[ScoreContent] Set isEditScoreModalOpen to true, isAddScoreModalOpen to false.');
  };

  const handleUpdateScoreSubmit = (scoreId, updatedData) => {
    // console.log("Updating score:", scoreId, updatedData); // Bỏ comment nếu cần debug
    setAllScores(prevScores =>
      prevScores.map(score =>
        score.id === scoreId ? { ...score, ...updatedData, id: score.id } : score // Giữ lại ID gốc
      )
    );
    setIsEditScoreModalOpen(false);
    setEditingScore(null);
  };

  const handleDeleteScoreSubmit = (scoreIdToDelete) => {
    // console.log("Deleting score:", scoreIdToDelete); // Bỏ comment nếu cần debug
    setAllScores(prevScores =>
      prevScores.filter(score => score.id !== scoreIdToDelete)
    );
    setIsEditScoreModalOpen(false);
    setEditingScore(null);
  };

  // DEBUG: Log trạng thái của isAddScoreModalOpen mỗi khi component render lại
  console.log('[ScoreContent] Rendering. isAddScoreModalOpen:', isAddScoreModalOpen, 'isEditScoreModalOpen:', isEditScoreModalOpen);

  // Thêm hàm xử lý Enter trên search box
  const handleSearchBoxKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilter();
    }
  };

  return (
    <div className="score-content-container">
      <div className="score-header">
        <h1 className="score-title">Score</h1>
        <button 
          className="add-score-button"
          onClick={() => {
            console.log('[ScoreContent] Add Score button clicked. Current isAddScoreModalOpen:', isAddScoreModalOpen);
            setIsEditScoreModalOpen(false);
            setEditingScore(null);     
            setIsAddScoreModalOpen(true);
            console.log('[ScoreContent] Set isAddScoreModalOpen to true.');
          }}
        >
          <img src={PlusIcon} alt="Add" className="add-score-icon" />
          Add Score
        </button>
      </div>

      <div className="controls-row">
        {/* Chỉ giữ lại filter theo điểm và sort, xóa dropdown + search box ở đây */}
        <div className="filter-container">
          <span className="filter-label">Filter:</span>
          <input
            type="number"
            placeholder="Score"
            className="score-input"
            aria-label="From score"
            value={scoreFrom}
            onChange={(e) => setScoreFrom(e.target.value)}
          />
          <span className="filter-separator">To</span>
          <input
            type="number"
            placeholder="Score"
            className="score-input"
            aria-label="To score"
            value={scoreTo}
            onChange={(e) => setScoreTo(e.target.value)}
          />
          <button className="apply-button" onClick={handleApplyFilter}>Apply</button>
        </div>
        <div className="sort-container">
          <span className="sort-label">Sort:</span>
          <button className={`sort-button original ${currentSort === 'original' ? 'active' : ''}`} onClick={() => setCurrentSort('original')}>Original</button>
          <button className={`sort-button highest ${currentSort === 'highest' ? 'active' : ''}`} onClick={() => setCurrentSort('highest')}>Highest to Lowest</button>
          <button className={`sort-button lowest ${currentSort === 'lowest' ? 'active' : ''}`} onClick={() => setCurrentSort('lowest')}>Lowest to Highest</button>
        </div>
      </div>

      <div className="score-list">
        {currentScoresToDisplay.length > 0 ? (
          currentScoresToDisplay.map((score) => (
            <ScoreCard 
              key={score.id} 
              scoreData={score}
              onEdit={handleOpenEditModal}
            />
          ))
        ) : (
          <p className="no-scores-message">No scores found matching your criteria.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className="pagination-button"
            title="First Page"
          >
            &#171;
          </button>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
            title="Previous Page"
          >
            &larr;
          </button>
          <span className="pagination-info">
            {filteredScores.length > 0 ? `${indexOfFirstScore + 1}-${Math.min(indexOfLastScore, filteredScores.length)}` : '0'} of {filteredScores.length}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || filteredScores.length === 0}
            className="pagination-button"
            title="Next Page"
          >
            &rarr;
          </button>
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages || filteredScores.length === 0}
            className="pagination-button"
            title="Last Page"
          >
            &#187;
          </button>
        </div>
      )}

      {/* NOTE: Render Modal */}
      <AddScoreModal
        isOpen={isAddScoreModalOpen}
        onClose={() => {
          console.log('[ScoreContent] AddScoreModal onClose called. Setting isAddScoreModalOpen to false.'); // DEBUG
          setIsAddScoreModalOpen(false)
        }}
        onAddScore={handleAddScoreSubmit}
      />

      {/* NOTE: 5. Render EditScoreModal */}
      <EditScoreModal
        isOpen={isEditScoreModalOpen}
        onClose={() => {
          setIsEditScoreModalOpen(false);
          setEditingScore(null); // Reset điểm đang sửa khi đóng
          console.log('[ScoreContent] EditModal onClose called'); // DEBUG
        }}
        scoreData={editingScore} // Truyền dữ liệu điểm đang sửa
        onUpdateScore={handleUpdateScoreSubmit}
        onDeleteScore={handleDeleteScoreSubmit}
      />
    </div>
  );
};

export default ScoreContent;