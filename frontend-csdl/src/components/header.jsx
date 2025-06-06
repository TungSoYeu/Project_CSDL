import React from 'react';

import StudentIdDropdown from './StudentIdDropdown.jsx'; 
import searchIcon from '../asset/image/header/search-icon.svg';
import notiIcon from '../asset/image/header/noti-icon.svg';
import profilePicture from '../asset/image/header/profile-picture.svg';
import dropdownIcon from '../asset/image/header/dropdown-icon.svg'; // Icon dùng chung

function Header({ searchTerm, searchField, onSearchChange, onSearchFieldChange, activePage }) { // Đổi tên thành Header nếu muốn (PascalCase)
  // Định nghĩa các options cho từng trang
  const scoreSearchOptions = [
    { value: 'studentId', label: 'Student ID' },
    { value: 'subjectId', label: 'Subject ID' },
    { value: 'classId', label: 'Class ID' },
  ];

  const studentSearchOptions = [
    { value: 'fullName', label: 'Full Name' },
    { value: 'studentId', label: 'Student ID' },
    { value: 'dob', label: 'DOB' },
    { value: 'major', label: 'Major' },
  ];

  const teacherSearchOptions = [
    { value: 'fullName', label: 'Full Name' },
    { value: 'teacherId', label: 'Teacher ID' },
  ];

  const subjectSearchOptions = [
    { value: 'subjectName', label: 'Subject Name' },
    { value: 'subjectId', label: 'Subject ID' }
  ]

  const classSearchOptions = [
    { value: 'classId', label: 'Class ID' },
    { value: 'subjectId', label: 'Subject ID' },
    { value: 'teacherId', label: 'Teacher ID'},
  ];

  // Chọn options dựa trên activePage
  let currentSearchOptions;
  if (activePage === 'student') {
    currentSearchOptions = studentSearchOptions;
  } else if (activePage === 'score') {
    currentSearchOptions = scoreSearchOptions;
  } else if (activePage === 'teacher') { 
    currentSearchOptions = teacherSearchOptions;
  } else if (activePage === 'subject') {
    currentSearchOptions = subjectSearchOptions;
  } else if (activePage === 'class') {
    currentSearchOptions = classSearchOptions;
  } else {
    currentSearchOptions = [{ value: '', label: 'Select Field' }]; 
  }

  return (
    <header className="main-header">
      <div className="header-item search-box">
        <form onSubmit={e => e.preventDefault()}>
          <img src={searchIcon} alt="Search" className="header-icon search-icon" />
          <input 
            type="search" 
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)} // Gọi hàm từ App.jsx
            />
        </form>
      </div>

      <div className="header-actions">
        {/* Render component Dropdown và truyền icon vào */}
        <StudentIdDropdown 
          dropdownIconSrc={dropdownIcon}
          options={currentSearchOptions}
          initialValue={searchField} // searchField từ App.jsx làm giá trị ban đầu
          onChange={onSearchFieldChange} // onSearchFieldChange từ App.jsx
        />

        <div className="header-item action-box notification-box">
          <button className="notification-btn" aria-label="Notifications">
            <img src={notiIcon} alt="Notifications" className="header-icon" />
          </button>
        </div>

        <div className="header-item action-box user-box">
          <button aria-label="User Menu">
            <img src={profilePicture} alt="User Avatar" className="avatar" />
            <span className="user-name">Evan Yates</span>
            <img src={dropdownIcon} alt="Dropdown" className="header-icon dropdown-icon" />
          </button>
          {/* Dropdown menu cho user sẽ nằm ở đây */}
        </div>
      </div>
    </header>
  );
}

export default Header; 