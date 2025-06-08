import React, { useEffect } from 'react';

function Welcome() {
  useEffect(() => {
    // Khi vào trang Welcome, chuyển hướng sang trang đăng nhập riêng ngay lập tức
    window.location.href = "/login-page";
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff'
    }}>
      {/* Có thể để trống hoặc hiển thị thông báo chuyển hướng */}
    </div>
  );
}

export default Welcome;
