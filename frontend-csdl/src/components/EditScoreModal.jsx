import React, { useState, useEffect } from 'react';
import './EditScoreModal.css';
import CloseIcon from '../asset/image/popup/x-icon.svg'; 

function EditScoreModal({ isOpen, onClose, scoreData, onUpdateScore, onDeleteScore }) {
  // State cho các trường input, khởi tạo với dữ liệu hiện tại nếu có
  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [classId, setClassId] = useState('');
  const [scoreValue, setScoreValue] = useState('');
  const [error, setError] = useState('');

  // Cập nhật form khi scoreData thay đổi (khi mở modal cho một điểm khác)
  useEffect(() => {
    console.log('[EditScoreModal] useEffect for scoreData. scoreData:', scoreData, 'isOpen:', isOpen); // DEBUG
    if (scoreData) {
      setStudentId(scoreData.studentId || '');
      setSubjectId(scoreData.subjectId || '');
      setClassId(scoreData.classId || '');
      setScoreValue(scoreData.score !== undefined ? String(scoreData.score) : '');
      setError('');
    }
  }, [scoreData, isOpen]); // Thêm isOpen để reset khi mở lại

  if (!isOpen || !scoreData) { // Nếu không mở hoặc không có dữ liệu điểm, không render gì cả
    console.log('[EditScoreModal] Not rendering because isOpen is false or no scoreData.'); // DEBUG
    return null;
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!studentId || !subjectId || !classId || scoreValue === '') {
      setError('All fields are required for update.');
      return;
    }
    const newScore = parseFloat(scoreValue);
    if (isNaN(newScore) || newScore < 0 || newScore > 10) {
      setError('Score must be a number between 0 and 10.');
      return;
    }
    onUpdateScore(scoreData.id, { // Truyền ID của điểm gốc và dữ liệu mới
      studentId,
      subjectId,
      classId,
      score: newScore,
    });
  };

  const handleDelete = () => {
    // Thêm một bước xác nhận trước khi xóa (tùy chọn)
    // if (window.confirm(`Are you sure you want to delete the score for Student ID ${scoreData.studentId}?`)) {
    onDeleteScore(scoreData.id); // Truyền ID của điểm cần xóa
    // }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content edit-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-custom">
          <h2>Edit Score</h2>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <img src={CloseIcon} alt="Close" className="modal-close-icon-svg" />
          </button>
        </div>

        {error && <p className="modal-error">{error}</p>}

        <form onSubmit={handleUpdate}>
          <div className="edit-score-grid">
            {/* Cột trái: Input fields */}
            <div className="edit-form-column">
              <div className="form-group">
                <label htmlFor="editStudentId">Student ID</label>
                <input type="text" id="editStudentId" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="editSubjectId">Subject ID</label>
                <input type="text" id="editSubjectId" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="editClassId">Class ID</label>
                <input type="text" id="editClassId" value={classId} onChange={(e) => setClassId(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="editScoreValue">Score</label>
                <input type="number" id="editScoreValue" value={scoreValue} onChange={(e) => setScoreValue(e.target.value)} step="0.01" min="0" max="10" />
              </div>
            </div>

            {/* Cột phải: Dữ liệu hiện tại */}
            <div className="current-data-column">
              <div className="data-display-group">
                <span className="data-label">Current Student ID</span>
                <span className="data-value">{scoreData.studentId}</span>
              </div>
              <div className="data-display-group">
                <span className="data-label">Current Subject ID</span>
                <span className="data-value">{scoreData.subjectId}</span>
              </div>
              <div className="data-display-group">
                <span className="data-label">Current Class ID</span>
                <span className="data-value">{scoreData.classId}</span>
              </div>
              <div className="data-display-group">
                <span className="data-label">Current Score</span>
                <span className="data-value score-highlight">{scoreData.score.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="modal-actions edit-modal-actions">
            <button type="button" onClick={handleDelete} className="btn-delete">
              Delete Score
            </button>
            <button type="submit" className="btn-update">
              Update Score
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditScoreModal;