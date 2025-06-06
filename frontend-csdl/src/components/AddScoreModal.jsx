import React, { useState, useEffect } from 'react';
import './AddScoreModal.css'; // File CSS riêng cho Modal
import CloseIcon from '../asset/image/popup/x-icon.svg'; // ĐIỀU CHỈNH ĐƯỜNG DẪN NÀY

function AddScoreModal({ isOpen, onClose, onAddScore }) {
  // DEBUG: Log trạng thái isOpen mỗi khi AddScoreModal render
  console.log('[AddScoreModal] Rendering. isOpen:', isOpen);
  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [classId, setClassId] = useState('');
  const [scoreValue, setScoreValue] = useState('');
  const [error, setError] = useState('');

  // Reset form khi modal được mở lại
  useEffect(() => {
    if (isOpen) {
      setStudentId('');
      setSubjectId('');
      setClassId('');
      setScoreValue('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) {
    // DEBUG: Log khi modal không được render vì isOpen là false
    console.log('[AddScoreModal] Not rendering because isOpen is false.');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !subjectId || !classId || scoreValue === '') {
      setError('All fields are required.');
      return;
    }
    const score = parseFloat(scoreValue);
    if (isNaN(score) || score < 0 || score > 10) {
      setError('Score must be a number between 0 and 10.');
      return;
    }

    onAddScore({
      studentId,
      subjectId,
      classId,
      score, // scoreValue đã được parse thành số
    });
    // onClose(); // Đã được gọi trong onAddScore ở ScoreContent để đảm bảo data được thêm trước
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          {/* NOTE: Sử dụng icon SVG đã import */}
          <img src={CloseIcon} alt="Close" className="modal-close-icon-svg" />
        </button>
        <h2>Add Score</h2>
        {error && <p className="modal-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subjectId">Subject ID</label>
            <input
              type="text"
              id="subjectId"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="classId">Class ID</label>
            <input
              type="text"
              id="classId"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="scoreValue">Score</label>
            <input
              type="number"
              id="scoreValue"
              value={scoreValue}
              onChange={(e) => setScoreValue(e.target.value)}
              step="0.01" // Cho phép điểm thập phân
              min="0"
              max="10"
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-add">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddScoreModal;
