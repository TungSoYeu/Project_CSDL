import React from 'react';

function Entry() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f6fa'
    }}>
      <h1>Welcome</h1>
      <p>This is the entry page. You can view this page without logging in.</p>
      <a
        href="/login"
        style={{
          marginTop: 24,
          padding: '10px 24px',
          background: '#1976d2',
          color: '#fff',
          borderRadius: 6,
          textDecoration: 'none',
          fontWeight: 600
        }}
      >
        Go to Main Login
      </a>
    </div>
  );
}

export default Entry;
