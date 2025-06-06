import React, { useState, useEffect } from 'react';
import './AddTeacherModal.css'; 
import CloseIcon from '../asset/image/popup/x-icon.svg';

function AddTeacherModal({ isOpen, onClose, onAddTeacher }) {
  const [teacherId, setTeacherId] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTeacherId('');
      setFullName('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!teacherId || !fullName) {
      setError('All fields are required.');
      return;
    }
    onAddTeacher({ teacherId, fullName });
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content add-teacher-modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn-corner" onClick={onClose} aria-label="Close modal">
          <img src={CloseIcon} alt="Close" className="modal-close-icon-svg" />
        </button>
        <h2>Add Teacher</h2>
        {error && <p className="modal-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="addTeacherId">Teacher ID</label>
            <input
              type="text"
              id="addTeacherId"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="addTeacherFullName">Full Name</label>
            <input
              type="text"
              id="addTeacherFullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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

export default AddTeacherModal;
