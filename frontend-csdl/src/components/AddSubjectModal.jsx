import React, { useState, useEffect } from 'react';
import './AddSubjectModal.css'; 
import CloseIcon from '../asset/image/popup/x-icon.svg';

function AddSubjectModal({ isOpen, onClose, onAddSubject }) {
  const [subjectName, setSubjectName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSubjectName('');
      setSubjectId('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subjectName || !subjectId) {
      setError('All fields are required.');
      return;
    }
    onAddSubject({ subjectName, subjectId });
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content add-subject-modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn-corner" onClick={onClose} aria-label="Close modal">
          <img src={CloseIcon} alt="Close" className="modal-close-icon-svg" />
        </button>
        <h2>Add Subject</h2>
        {error && <p className="modal-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="addSubjectName">Subject Name</label>
            <input
              type="text"
              id="addSubjectName"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="addSubjectId_subject">Subject ID</label>
            <input
              type="text"
              id="addSubjectId_subject"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
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

export default AddSubjectModal;