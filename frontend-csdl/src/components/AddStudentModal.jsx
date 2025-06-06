import React, { useState, useEffect } from 'react';
import './AddStudentModal.css'; 
import CloseIcon from '../asset/image/popup/x-icon.svg'; 

function AddStudentModal({ isOpen, onClose, onAddStudent }) {
  // NOTE: State cho các trường thông tin sinh viên
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState(''); 
  const [major, setMajor] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStudentId('');
      setFullName('');
      setDob('');
      setMajor('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !fullName || !dob || !major) {
      setError('All fields are required.');
      return;
    }

    onAddStudent({
      studentId,
      fullName,
      dob,
      major,
    });
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content add-student-modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn-corner" onClick={onClose} aria-label="Close modal">
          <img src={CloseIcon} alt="Close" className="modal-close-icon-svg" />
        </button>
        <h2>Add Student</h2>
        {error && <p className="modal-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="addStudentId">Student ID</label>
            <input
              type="text"
              id="addStudentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="addFullName">Full Name</label>
            <input
              type="text"
              id="addFullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="addDob">DOB</label>
            <input
              type="text"
              id="addDob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="addMajor">Major</label>
            <input
              type="text"
              id="addMajor"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
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

export default AddStudentModal;