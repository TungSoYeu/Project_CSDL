import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StudentIdDropdown from './StudentIdDropdown.jsx'; 
import searchIcon from '../asset/image/header/search-icon.svg';
import notiIcon from '../asset/image/header/noti-icon.svg';
import profilePicture from '../asset/image/header/profile-picture.svg';
import dropdownIcon from '../asset/image/header/dropdown-icon.svg'; // Icon dùng chung

function Header({ searchTerm, searchField, onSearchChange, onSearchFieldChange, activePage }) {
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

  // Thêm state cho popup thông tin user
  const [showUserInfo, setShowUserInfo] = useState(false);
  const navigate = useNavigate();

  const handleUserBoxClick = () => {
    setShowUserInfo((prev) => !prev);
  };

  // Hàm toggle popup
  const handleAvatarClick = () => {
    navigate('/user-info');
  };

  // Khi click vào profile picture, chuyển sang trang thông tin user
  const handleProfileClick = () => {
    navigate('/user-info');
  };

  return (
    <header className="main-header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
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
          <div
            className="user-box"
            onClick={() => navigate('/user-info')}
            style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img src={profilePicture} alt="User Avatar" className="avatar" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;