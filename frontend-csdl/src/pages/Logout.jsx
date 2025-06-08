import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Xóa token / session nếu có
    try {
      localStorage.removeItem('token');
      sessionStorage.clear();
    } catch (e) {
      // ignore errors
    }
    // Chuyển hướng sau khi logout sang trang đăng nhập riêng
    window.location.href = '/login-page';
  }, []);

  return <div>Logging out...</div>;
}

export default Logout;
