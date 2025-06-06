import React, { useState, useEffect } from 'react';
import './AddClassModal.css'; // Sẽ tạo file CSS này
import CloseIcon from '../asset/image/popup/x-icon.svg';

function AddClassModal({ isOpen, onClose, onAddClass }) {
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setClassId('');
      setSubjectId('');
      setTeacherId('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!classId || !subjectId || !teacherId) {
      setError('All fields are required.');
      return;
    }
    // TODO: Thêm validation cho các ID nếu cần
    onAddClass({ classId, subjectId, teacherId });
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content add-class-modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn-corner" onClick={onClose} aria-label="Close modal">
          <img src={CloseIcon} alt="Close" className="modal-close-icon-svg" />
        </button>
        <h2>Add Class</h2>
        {error && <p className="modal-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="addClassId">Class ID</label>
            <input
              type="text"
              id="addClassId"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="addSubjectId">Subject ID</label>
            <input
              type="text"
              id="addSubjectId"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="addTeacherId_class">Teacher ID</label> {/* Thêm _class để tránh trùng ID với modal khác */}
            <input
              type="text"
              id="addTeacherId_class"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
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

export default AddClassModal;