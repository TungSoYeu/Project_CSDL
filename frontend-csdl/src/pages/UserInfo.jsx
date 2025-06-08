import React from 'react';
import './UserInfo.css';
import avatar from '../asset/image/header/profile-picture.svg';

function UserInfo() {
  return (
    <div className="user-info-page-container">
      <div className="user-info-card">
        <img src={avatar} alt="Avatar" className="user-info-avatar" />
        <div className="user-info-title">Thông tin sinh viên</div>
        <div className="user-info-detail"><b>Họ và tên:</b> Trần Văn Tùng</div>
        <div className="user-info-detail"><b>MSSV:</b> 20235868</div>
        <div className="user-info-detail"><b>Trường:</b> Công nghệ thông tin và Truyền thông</div>
        <div className="user-info-detail"><b>Lớp:</b> Việt Nhật 01-K68</div>
      </div>
    </div>
  );
}

export default UserInfo;
