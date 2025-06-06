import React, { useState } from 'react';

import './style.css';
import Sidebar from './components/sidebar';
import Header from './components/header';
import ScoreContent from './components/ScoreContent';
import StudentContent from './components/StudentContent';
import TeacherContent from './components/TeacherContent';
import ClassContent from './components/ClassContent';
import SubjectContent from './components/SubjectContent';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState(''); 
  const [activePage, setActivePage] = useState('score'); 

  // NOTE: Hàm để Header cập nhật searchTerm
  const handleSearchTermChange = (newTerm) => {
    setSearchTerm(newTerm);
  };

  // NOTE: Hàm để Header (thông qua StudentIdDropdown) cập nhật searchField
  const handleSearchFieldChange = (newField) => {
    setSearchField(newField);
  }
  
    // NOTE: Hàm để Sidebar gọi khi một mục được chọn
  const handleNavigation = (page) => {
    console.log('Navigating to:', page); // Debug
    setActivePage(page);
    setSearchTerm('');

    // NOTE: Cập nhật searchField dựa trên trang được chọn
    if (page === 'score') {
      setSearchField('studentId'); 
    } else if (page === 'student') {
      setSearchField('fullName'); 
    } else if (page === 'teacher') { 
      setSearchField('fullName'); 
    } else if (page === 'subject') {
      setSearchField('subjectName');
    } else if (page === 'class') {
      setSearchField('classId');
    } else {
      setSearchField('');
    }
  };

  // NOTE: Hàm render nội dung chính dựa trên activePage
  const renderMainContent = () => {
    switch (activePage) {
      case 'score':
        return <ScoreContent searchTerm={searchTerm} searchField={searchField} />;
      case 'student':
        return <StudentContent searchTerm={searchTerm} searchField={searchField} />;
      case 'teacher':
        return <TeacherContent searchTerm={searchTerm} searchField={searchField} />;
      case 'subject':
        return <SubjectContent searchTerm={searchTerm} searchField={searchField}/>; 
      case 'class':
        return <ClassContent searchTerm={searchTerm} searchField={searchField}/>; 
      default:
        return <ScoreContent searchTerm={searchTerm} searchField={searchField} />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage={activePage} onNavigate={handleNavigation}/>

      <div className="main-content-wrapper">
        <Header
          searchTerm={searchTerm}
          searchField={searchField} 
          onSearchChange={handleSearchTermChange}
          onSearchFieldChange={handleSearchFieldChange} 
          activePage={activePage} 
        />
        <main className="content-wrapper">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default App;