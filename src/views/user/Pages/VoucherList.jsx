import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const VoucherList = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userId = localStorage.getItem('account_id'); // Retrieve userId here

    useEffect(() => {
        if (userId) {
            axios
                .get(`http://localhost:8080/api/vouchers/user/${userId}`)
                .then((response) => {
                    setVouchers(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError('Failed to fetch vouchers: ' + error.message);
                    setLoading(false);
                });
        } else {
            setError('No user ID found in localStorage');
            setLoading(false);
        }
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={containerStyle}>
            {/* Sidebar */}
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
                                <button
                                    style={buttonStyle}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
                                >
                                    {item}
                                </button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Voucher List */}
            <div style={voucherListContainerStyle}>
                <h2>Mã giảm giá của bạn</h2>
                {vouchers.length > 0 ? (
                    <div className="voucher-cards">
                        {vouchers.map((voucher) => (
                            <div className="voucher-card" key={voucher.voucherID}>
                                <img
                                    src={`http://localhost:8080/images/uploads/${voucher.hinh_anh}`}
                                    alt="Voucher"
                                    className="voucher-image"
                                />
                                <div className="voucher-info">
                                    <h3>{voucher.so_tien_giam}</h3>
                                    <p className="expiry-date">Ngày hết hạn: {voucher.han_su_dung}</p>
                                    <p className="conditions">Điều kiện: {voucher.dieu_kien}</p>
                                    <p className="status">Trạng thái: {voucher.hoat_dong}</p>
                                    <p className="usage-left">Số lần sử dụng còn lại: {voucher.so_luong}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-vouchers">No vouchers available.</p>
                )}
            </div>
            <style>{`
    .voucher-list-container {
        padding: 20px;
        text-align: center;
        font-family: 'Arial', sans-serif;
    }

    .voucher-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }

    .voucher-card {
        background-color: #fff; /* Màu nền trắng cho thẻ */
        border: 1px solid #ddd; /* Viền mỏng màu xám nhạt */
        border-radius: 8px; /* Bo góc thẻ */
        overflow: hidden; 
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Bóng đổ nhẹ */
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .voucher-card:hover {
        transform: translateY(-5px); /* Thẻ nâng lên khi hover */
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15); /* Bóng đổ mạnh hơn */
    }

    .voucher-image {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-bottom: 1px solid #ddd; /* Viền dưới ảnh */
    }

    .voucher-info {
        padding: 15px;
        text-align: left;
    }

    .voucher-info h3 {
        margin: 10px 0;
        font-size: 1.2em;
        font-weight: bold;
        color: #333;
    }

    .voucher-info p {
        margin: 5px 0;
        color: #555;
    }

    .expiry-date,
    .conditions,
    .status,
    .usage-left {
        font-size: 0.9em;
    }

    .expiry-date {
        color: #f44336;
    }

    .status {
        font-weight: bold;
        color: #4caf50;
    }

    .usage-left {
        font-weight: bold;
        color: #2196f3;
    }

    .no-vouchers {
        font-size: 1.2em;
        color: #888;
    }
`}</style>


        </div>
    );
};

// Styles
const containerStyle = {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
};

const sidebarStyle = {
    width: '250px',
    background: 'linear-gradient(135deg, #2c3e50, #34495e)',
    color: '#fff',
    padding: '20px',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    height: '100%',
    overflowY: 'auto',
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
    backgroundColor: '#34495e',
    border: 'none',
    color: 'white',
    width: '100%',
    padding: '12px',
    textAlign: 'left',
    fontSize: '16px',
    borderRadius: '4px',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
};

const buttonHoverStyle = {
    backgroundColor: '#2c3e50',
};

const voucherListContainerStyle = {
    marginLeft: '270px',
    padding: '20px',
    width: 'calc(100% - 270px)',
};

export default VoucherList;