import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logoSvg from '../asset/image/sidebar/logo.svg';
import scoreIcon from '../asset/image/sidebar/score-icon.svg';
import studentIcon from '../asset/image/sidebar/student-icon-active.svg';
import teacherIcon from '../asset/image/sidebar/teacher-icon-active.svg';
import subjectIcon from '../asset/image/sidebar/subject-icon-active.svg';
import classIcon from '../asset/image/sidebar/class-icon-active.svg';
import illustratorSvg from '../asset/image/sidebar/sidebar-illustrator.svg';
import logoutIcon from '../asset/image/sidebar/logout.svg';
import './sidebar.css'; 

function Sidebar({ activePage, onNavigate }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = [
    { key: 'score', label: 'Score', iconSrc: scoreIcon },
    { key: 'student', label: 'Student', iconSrc: studentIcon },
    { key: 'teacher', label: 'Teacher', iconSrc: teacherIcon },
    { key: 'subject', label: 'Subject', iconSrc: subjectIcon },
    { key: 'class', label: 'Class', iconSrc: classIcon },
  ];

  const handleItemClick = (itemKey) => {
    console.log('Sidebar item clicked:', itemKey);
    onNavigate(itemKey);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      localStorage.removeItem('token');
      sessionStorage.clear();
      window.location.reload(); // Reload để App kiểm tra lại token và hiển thị LoginPage
    } catch (err) {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <a href="#" className="logo">
          <img src={logoSvg} alt="Logo" />
        </a>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li 
              key={item.key} 
              className={activePage === item.key ? 'active' : ''}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item.key);
                }}
              >
                <img src={item.iconSrc} alt="" className="nav-icon" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="illustration-container">
          <img src={illustratorSvg} alt="Illustration" />
        </div>
        <a
          href="/login-page"
          className="logout-link"
          onClick={handleLogout}
          style={loggingOut ? { pointerEvents: 'none', opacity: 0.6 } : {}}
        >
          <img src={logoutIcon} alt="" className="nav-icon" />
          <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;
