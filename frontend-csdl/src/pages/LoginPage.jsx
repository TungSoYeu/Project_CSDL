import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'tung.tv235868@sis.hust.edu.vn' && password === '12345678') {
      localStorage.setItem('token', 'mock-token');
      window.location.reload();
    } else {
      alert('Sai email hoặc mật khẩu!');
    }
  };

  return (
    <div className="loginpage-container">
      <form className="loginpage-form" onSubmit={handleLogin}>
        <h2>Đăng nhập hệ thống</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}

export default LoginPage;
