import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PasswordChangeForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('account_id');
    setUserId(storedUserId);
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      setMessage('Bạn phải nhập mật khẩu hiện tại.');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage('Mật khẩu mới không khớp.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8080/auth/users/${userId}/changePassword`, {
        currentPassword,
        newPassword,
      });
      setMessage(response.data);
    } catch (error) {
      setMessage(error.response?.data || 'Không thể thay đổi mật khẩu.');
    }
  };

  return (
    <div style={containerStyle}>
       <aside style={sidebarStyle}>
        <Link to="/" style={linkStyle}>
          <h3>Quản Lý Cá Nhân</h3>
        </Link>
        <ul style={menuStyle}>
        {['Thông tin cá nhân', 'Lịch sử đặt hàng', 'Đổi mật khẩu', 'Feedback', 'Yêu Thích', 'Mã giảm giá',
                        "Địa chỉ của bạn",
                        "Ví đã liên kết",].map((item, index) => (
            <li key={index}>
              <Link to={`/${item.replace(/ /g, '-').toLowerCase()}?userId=${userId}`} style={linkStyle}>
                <button style={buttonStyle}>{item}</button>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <main style={mainContentStyle}>
        <form onSubmit={handlePasswordChange} style={formStyle}>
          <h2 style={formHeaderStyle}>Đổi mật khẩu</h2>
          {message && <p style={messageStyle}>{message}</p>}

          <div style={formGroupStyle}>
            <label style={labelStyle}>Mật khẩu hiện tại:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Mật khẩu mới:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                if (currentPassword) setNewPassword(e.target.value);
                else setMessage('Bạn phải nhập mật khẩu hiện tại trước.');
              }}
              style={inputStyle}
            
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Xác nhận mật khẩu mới:</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              style={inputStyle}
          
            />
          </div>

          <button type="submit" style={submitButtonStyle}>Lưu mật khẩu</button>
        </form>
      </main>
    </div>
  );
};

// Styles from PersonalInfo and adjustments for the PasswordChangeForm
const containerStyle = {
  display: 'flex',
  height: '100vh',
  fontFamily: 'Arial, sans-serif',
};

const sidebarStyle = {
  width: '250px',
  backgroundColor: '#2c3e50',
  color: '#fff',
  padding: '20px',
  boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
};

const linkStyle = {
  textDecoration: 'none',
  color: 'white',
};

const menuStyle = {
  listStyleType: 'none',
  padding: '0',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#34495e',
  color: 'white',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '16px',
  marginBottom: '10px',
  borderRadius: '5px',
  transition: 'background-color 0.3s',
};

const mainContentStyle = {
  flex: 1,
  padding: '40px',
  backgroundColor: '#ecf0f1',
};

const formStyle = {
  backgroundColor: 'white',
  borderRadius: '5px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
};

const formHeaderStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#34495e',
  textAlign: 'center',
};

const messageStyle = {
  color: 'red',
  marginBottom: '10px',
  textAlign: 'center',
};

const formGroupStyle = {
  marginBottom: '15px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #bdc3c7',
  fontSize: '16px',
  outline: 'none',
  transition: 'border 0.3s',
};

const submitButtonStyle = {
  padding: '12px',
  width: '100%',
  backgroundColor: '#27ae60',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '18px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

export default PasswordChangeForm;
