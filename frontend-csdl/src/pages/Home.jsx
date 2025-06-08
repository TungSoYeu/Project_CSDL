import React, { useState } from 'react';
import Sidebar from '../components/sidebar';

function Home() {
  const [activePage, setActivePage] = useState('student');

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="main-content">
        <h1>{activePage.toUpperCase()} PAGE</h1>
        {/* Hiển thị nội dung tương ứng */}
      </div>
    </div>
  );
}

export default Home;
