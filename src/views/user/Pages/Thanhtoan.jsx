import React from "react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Select } from 'antd';
import { DeleteOutlined, EditOutlined, CreditCardOutlined, WalletOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

const options = [
    {
        label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img style={{ marginRight: '8px' }} width="24" height="24" src="https://img.icons8.com/office/40/wallet.png" alt="wallet" /> Thanh toán trực tiếp
            </div>
        ),
        value: 'Thanh toán trực tiếp',
    },
    {
        label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img width={24} height={24} src="/images/vnpay.png" alt="" /> Ví Vnpay
            </div>
        ),
        value: 'Ví Vnpay',
    }
];
const labelRender = (props) => {



    const { label, value } = props;
    if (label) {
        return value;
    }
    return (
        <span>
            <img style={{ marginRight: '8px' }} width="24" height="24" src="https://img.icons8.com/office/40/wallet.png" alt="wallet" />
            Phương thức thanh toán
        </span>);
};
function Thanhtoan() {
    const ListSPChecked = useSelector(state => state.cart.ListSpthanhtoan2) || [];
    const AddressCurrent = localStorage.getItem('addressCurent') ? JSON.parse(localStorage.getItem('addressCurent')) : null;
    const totalAmount = Array.isArray(ListSPChecked)
        ? ListSPChecked.reduce((total, Spthanhtoan) => {
           
            const price = Spthanhtoan.sanPham.gia_km > 0 ? Spthanhtoan.sanPham.gia_km : Spthanhtoan.sanPham.gia_goc;
            return total + (Spthanhtoan.soLuong * price);
        }, 0)
        : 0;
    const [showPopup, setShowPopup] = useState(false);

   
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.search-container') || !event.target.closest('.popup')) {
                setShowPopup(false);
            }
        };

        const handleScroll = () => {
            setShowPopup(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);

        };
    }, []);

    const handleInputClick = () => {
        setShowPopup(true);
    };
    return (
        <>
            

            <nav className="breaddesign col-11 mx-auto" aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <NavLink to={'/'} className={"trangchu"}>Trang chủ</NavLink>
                    </li>
                    <li className="mx-2"><span> | </span></li>
                    <li className="breadcrumb-item trangchu" aria-current="page">Giỏ hàng</li>
                    <li className="mx-2"><span> | </span></li>
                    <li className="breadcrumb-item giohang" aria-current="page">Thanh toán</li>
                </ol>
            </nav>

            <div className="diachi col-11 mx-auto">
                <div className="thongtin">
                    <div className="hangdautien">
                        <img width={32} height={32} src="https://img.icons8.com/windows/32/user-male-circle.png" alt="user" className="icon" />
                        <p className="tieude" >Thông tin người nhận:</p>
                        <p className="noidung" style={{ paddingLeft: '200px' }}>{AddressCurrent?.users?.hovaten} | {AddressCurrent?.users?.so_dien_thoai}</p>
                    </div>

                    <div className="hangthuhai">
                        <img width={32} height={32} src="https://img.icons8.com/windows/32/home.png" alt="home" className="icon" />
                        <p className="tieude">Địa chỉ giao hàng:</p>
                        <p className="noidung" style={{ paddingLeft: '233px' }}>{AddressCurrent?.dia_chi ? AddressCurrent?.dia_chi : <span className="text-danger fw-bold">Chưa nhập địa chỉ</span>}</p>
                    </div>

                    <div className="hangthuba">
                        <img width={32} height={32} src="https://img.icons8.com/fluency-systems-regular/50/online-store.png" alt="store" className="icon" />
                        <p className="tieude">Cửa hàng:</p>
                        <p className="noidung" style={{ paddingLeft: '293px' }}>Quận 7</p>
                    </div>
                </div>
            </div>

            <div className="col-11 mx-auto sanphamvakhuyenmai d-flex justify-content-between">
                <div className="sanpham col-7">
                    <div className="navsanpham col-12">
                        <div className="navsanphamnd">
                            Sản phẩm
                        </div>
                        <div className="navsotiennd" style={{ paddingRight: '165px' }}>
                            Số tiền
                        </div>
                    </div>
                    {ListSPChecked.map((sp, index) => {
                        return <div className="col-12 cardgiohang d-flex align-items-start" key={index}>
                            <div>
                                <div className="d-flex">
                                    <img width={150} height={150} src={`/images/${sp.sanPham.hinhanh[0].ten_hinh}`} alt="Sản phẩm" />
                                    <p style={{ width: '300px' }}>{sp.sanPham.ten_san_pham}</p>
                                </div>
                                <div className="d-flex ps-4 align-items-center">
                                    <EditOutlined />
                                    <input type="text" className="no-outline" placeholder="Thêm ghi chú" />
                                </div>
                            </div>

                            <div className="chitietgiatien d-flex flex-column align-items-center justify-content-center">
                                <p style={{ fontSize: '20px', fontWeight: 'bolder' }}> {sp.sanPham.gia_km >0 ? sp.soLuong * sp.sanPham.gia_km : sp.soLuong * sp.sanPham.gia_goc} </p>
                                <p style={{ color: '#777e90', margin: '0' }}>Số lượng: {sp.soLuong}</p>
                            </div>
                        </div>
                    })}

                </div>

                <div className="khuyenmai col-4">
                    <div className="tieudekhuyenmai">
                        <p>Thông tin thanh toán</p>
                    </div>
                    <div className="mt-4">
                        <div>
                            <p style={{ margin: '0', fontWeight: 'bold' }}>Bạn có lưu ý gì cho chúng tôi không ?</p>
                        </div>
                        <div className="d-flex align-items-center" style={{ marginTop: '0' }}>
                            <EditOutlined />
                            <input type="text" className="no-outline" placeholder="Thêm ghi chú" />
                        </div>
                        <div className="mt-4">
                            <p style={{ fontWeight: 'bolder' }}>Phương thức thanh toán</p>
                            <Select
                                labelRender={labelRender}
                                defaultValue="1"
                                style={{
                                    width: '100%',
                                }}
                                options={options}
                            />
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-4" style={{ height: '45px' }}>
                            <div>
                                <p style={{ margin: '0', color: '#777e90' }}>Tổng giá trị đơn hàng</p>
                            </div>
                            <div className="fw-bolder">
                                100.000 ₫
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center" style={{ height: '45px' }}>
                            <div>
                                <p style={{ margin: '0', color: '#777e90' }}>Phí vận chuyển</p>
                            </div>
                            <div className="fw-bolder">
                                0 ₫
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center" style={{ height: '45px' }}>
                            <div>
                                <p style={{ margin: '0', fontWeight: 'bolder' }}>Thành tiền</p>
                            </div>
                            <div className="fw-bolder" style={{ color: 'red' }}>
                            {totalAmount.toLocaleString()} ₫
                            </div>
                        </div>
                        <div className="col-12 mt-2 thanhtoan" >
                            <button style={{
                                width: '100%', height: '45px',
                                borderRadius: '5px', border: 'none', backgroundColor: 'red',
                                color: 'white', fontWeight: 'bolder'
                            }}>Đặt hàng</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Thanhtoan;