import React, { useState, useEffect } from 'react';
import Login from '/Login';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const App = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
  };

  if (!role) return <Login onLogin={setRole} />;
  return (
    <div>
      <button onClick={handleLogout}>Đăng xuất</button>
      {role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
};

export default App;
