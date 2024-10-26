import React from "react";
import { useEffect, useState } from "react";
import { json, NavLink } from "react-router-dom";
import { Checkbox, Button, Modal, Input } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { ClearCart, DecreaseItem, IncreaseItem, RemoveItem, AddSpthanhtoan, Clear, DecreaseSpthanhtoan, DeleteSpthanhtoan, IncreaseSpthanhtoan, RemoveSpthanhtoan, Thanhtoan, CallAPI_Cart, increaseItem, decreaseItem, removeItem } from "../Reducer/cartReducer";


function Cart() {
    const userId = localStorage.getItem('account_id');
    const [change,setchange] = useState(0)
    const [showPopup, setShowPopup] = useState(false);
    const [checkedAll, setCheckedAll] = useState(false);
    const [checkedItems, setCheckedItems] = React.useState([false, false]);
    const [quantity, setQuantity] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalVoucherOpen, setIsModalVoucherOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(Array(6).fill(false)); // Tạo mảng trạng thái
    const [sum, Setsum] = useState(0);
    const [spchecked, setspchecked] = useState([]);
    const handleToggle = (index) => {
        const newChecked = [...isChecked];
        newChecked[index] = !newChecked[index]; // Đảo trạng thái chỉ phần tử được nhấn
        setIsChecked(newChecked); // Cập nhật lại state

    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const showModalAdd = () => {
        setIsModalAddOpen(true);
    };
    const handleOkAdd = () => {
        setIsModalAddOpen(false);
    };
    const handleCancelAdd = () => {
        setIsModalAddOpen(false);
    };
    const showModalVoucher = () => {
        setIsModalVoucherOpen(true);
    };
    const handleOkVoucher = () => {
        setIsModalVoucherOpen(false);
    };
    const handleCancelVoucher = () => {
        setIsModalVoucherOpen(false);
    };


    const handleCheckItemChange = (index, cart) => (e) => {
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = e.target.checked;
        setCheckedItems(newCheckedItems);


        setCheckedAll(newCheckedItems.every((item) => item));
        if (e.target.checked) {
            const api = AddSpthanhtoan(cart);
            dispatch(api)
        
        }
        else {
            const api = DeleteSpthanhtoan(cart);
            dispatch(api)
           

        }
    };



    const ListCart = useSelector(state => state.cart.CartDatabase);
    const ListSPChecked = useSelector(state => state.cart.ListSpthanhtoan) || [];

    const totalAmount = Array.isArray(ListSPChecked)
        ? ListSPChecked.reduce((total, Spthanhtoan) => {
            // Nếu `gia_km` lớn hơn 0, dùng `gia_km`, nếu không dùng `gia_goc`
            const price = Spthanhtoan.sanpham.gia_km > 0 ? Spthanhtoan.sanpham.gia_km : Spthanhtoan.sanpham.gia_goc;
            return total + (Spthanhtoan.so_luong * price);
        }, 0)
        : 0;



    const dispatch = useDispatch();
    dispatch(Thanhtoan(ListSPChecked))

    const handleCheckAllChange = (e) => {
        const isChecked = e.target.checked;
        setCheckedAll(isChecked);
        setCheckedItems(Array(ListCart.length).fill(isChecked));

        if (isChecked) {
            // Nếu tất cả được chọn, dispatch action cho tất cả sản phẩm
            ListCart.forEach(cart => {
                const api = AddSpthanhtoan(cart);
                dispatch(api);

            });

        } else {
            // Nếu không có sản phẩm nào được chọn, dispatch action xóa cho tất cả
            ListCart.forEach(cart => {
                const api = DeleteSpthanhtoan(cart);
                dispatch(api);

            });
        }

    };
   


 
    useEffect(() => {
        console.log('cart run')
        setCheckedItems(Array(ListCart.length).fill(false));
        dispatch(CallAPI_Cart(userId))
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
           

            dispatch(Clear())

        };
    }, []);
   
    const handleInputClick = () => {
        setShowPopup(true);
    };
    return (
        <div className="container-fluid">



            <div className="diachi col-12 mx-auto">
                <div className="thongtin">
                    <div className="hangdautien">
                        <img width={32} height={32} src="https://img.icons8.com/windows/32/user-male-circle.png" alt="user" className="icon" />
                        <p className="tieude" >Thông tin người nhận:</p>
                        <p className="noidung" style={{ paddingLeft: '200px' }}>Thành | 0984762140</p>
                        <button className="thaydoidiachi" onClick={showModal}>Thay đổi địa chỉ</button>
                        <Modal width={1000}
                            title="Địa chỉ giao hàng của tôi" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <Button onClick={showModalAdd}>Thêm địa chỉ giao hàng
                                <PlusOutlined />
                            </Button>
                            <div className="mt-2 py-2 ps-2" style={{ border: '1px solid #d4d7de' }}>
                                <div className="d-flex align-items-center" style={{ height: '40px' }}>
                                    <img width={32} height={32} src="https://img.icons8.com/windows/32/user-male-circle.png" alt="user" className="icon" />
                                    <p style={{ fontWeight: 'bold', margin: '0', paddingRight: '50px' }}>Thông tin người nhận:</p>
                                    <p style={{ margin: '0' }} >Thành | 0984762140</p>
                                </div>
                                <div className="d-flex align-items-center" style={{ height: '40px' }}>
                                    <img width={32} height={32} src="https://img.icons8.com/windows/32/home.png" alt="home" className="icon" />
                                    <p style={{ fontWeight: 'bold', margin: '0', paddingRight: '80px' }}>Địa chỉ giao hàng:</p>
                                    <p style={{ margin: '0' }}>đường số 10, Campuchia, tỉnh Đắc Lắk, làng Nủ</p>
                                </div>
                                <div className="d-flex align-items-center" style={{ height: '40px' }}>
                                    <img width={32} height={32} src="https://img.icons8.com/fluency-systems-regular/50/online-store.png" alt="store" className="icon" />
                                    <p style={{ fontWeight: 'bold', margin: '0', paddingRight: '130px' }}>Cửa hàng:</p>
                                    <p style={{ margin: '0' }}>Quận 7</p>
                                </div>
                            </div>
                        </Modal>
                        <Modal width={1000}
                            title="Thêm địa chỉ mới" open={isModalAddOpen} onOk={handleOkAdd} onCancel={handleCancelAdd}>
                            <div>
                                <div className="mb-3">
                                    <label style={{ fontWeight: 'bold' }} htmlFor="">Tên người nhận <span style={{ color: 'red' }}>*</span></label>
                                    <Input size="large" placeholder="Nhập tên người nhận" prefix={<UserOutlined />} />
                                </div>
                                <div className="mb-3">
                                    <label style={{ fontWeight: 'bold' }} htmlFor="">Số điện thoại <span style={{ color: 'red' }}>*</span></label>
                                    <Input size="large" placeholder="Nhập số điện thoại" prefix={<PhoneOutlined />} />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }} htmlFor="">Địa chỉ giao hàng <span style={{ color: 'red' }}>*</span></label>
                                    <Input size="large" placeholder="Nhập địa chỉ giao hàng" prefix={<HomeOutlined />} />
                                </div>
                            </div>
                        </Modal>
                    </div>

                    <div className="hangthuhai">
                        <img width={32} height={32} src="https://img.icons8.com/windows/32/home.png" alt="home" className="icon" />
                        <p className="tieude">Địa chỉ giao hàng:</p>
                        <p className="noidung" style={{ paddingLeft: '233px' }}>đường số 10, Campuchia, tỉnh Đắc Lắk, làng Nủ</p>
                    </div>

                    <div className="hangthuba">
                        <img width={32} height={32} src="https://img.icons8.com/fluency-systems-regular/50/online-store.png" alt="store" className="icon" />
                        <p className="tieude">Cửa hàng:</p>
                        <p className="noidung" style={{ paddingLeft: '293px' }}>Quận 7</p>
                    </div>
                </div>
            </div>

            <div className="col-12 mx-auto sanphamvakhuyenmai d-flex justify-content-between">
                <div className="sanpham col-7">
                    <div className="tieudesanpham col-12">
                        <p>Tất cả sản phẩm ({ListCart.length})</p>
                    </div>
                    <div className="navsanpham col-12">
                        <div className="navsanphamnd">
                            <Checkbox checked={checkedAll}
                                onChange={handleCheckAllChange} style={{ paddingRight: '10px' }} />
                            Sản phẩm
                        </div>
                        <div className="navsotiennd">
                            Số tiền
                            <DeleteOutlined onClick={() => {
                                const clear = ClearCart();
                                dispatch(clear)
                            }} style={{ paddingLeft: '115px' }} />
                        </div>
                    </div>

                    {ListCart.map((cart, index) => {
                        return <div className="col-12 cardgiohang d-flex align-items-start" key={index}>
                            <Checkbox
                                checked={checkedItems[index]}
                                onChange={handleCheckItemChange(index, cart)}

                                style={{ paddingLeft: '10px', paddingBottom: '140px' }}
                            />
                            <div>
                                <div className="d-flex">
                                    <img width={150} height={150} src={`/images/${cart.sanpham.hinhanh[0].ten_hinh}`} alt="Sản phẩm" />
                                    <p className="text-center" style={{ width: '300px' }}>{cart.sanpham.ten_san_pham}</p>
                                </div>

                            </div>

                            <div className="chitietgiatien d-flex flex-column align-items-center justify-content-center">
                                <p style={{ fontSize: '20px', fontWeight: 'bolder' }}> {(cart.sanpham.gia_km > 0 ? cart.so_luong * cart.sanpham.gia_km : cart.so_luong * cart.sanpham.gia_goc).toLocaleString()}     </p>
                                <div className="d-flex align-items-center">
                                    <Button onClick={() => {
                                        if (ListSPChecked.length > 0) {
                                            const increasesp = DecreaseSpthanhtoan({
                                                productId: cart,
                                                quantity: 1
                                            })
                                            dispatch(increasesp)
                                        }
                                        const increase = decreaseItem({                                          
                                            quantity: cart.so_luong,
                                            userId:userId,
                                            productId: cart.sanpham.san_phamId,
                                            idcart:cart.id
                                        })
                                        dispatch(increase)
                                       
                                       
                                    }} type="default" size="small">-</Button>
                                    <span style={{ margin: '0 10px' }}>{cart.so_luong}</span>
                                    <Button onClick={() => {
                                        const increase = increaseItem({
                                            idcart:cart.id,
                                            userId:userId})
                                        
                                        dispatch(increase)

                                        if (ListSPChecked.length > 0) {
                                            const increasesp = IncreaseSpthanhtoan({
                                                productId: cart,
                                                quantity: 1
                                            })
                                            dispatch(increasesp)
                                        }
                                        
                                        

                                      
                                        
                                    }} type="default" size="small">+</Button>

                                </div>
                                <p style={{ color: '#777e90', margin: '0' }}>Tối đa 127 sản phẩm </p>
                            </div>
                            <DeleteOutlined onClick={() => {
                                const remove = removeItem({ idcart: cart.id, userId });
                                dispatch(remove);

                            }} style={{ paddingTop: '70px', paddingLeft: '65px' }} />
                        </div>
                    })}


                </div>

                <div className="khuyenmai col-4">
                    <div className="tieudekhuyenmai">
                        <p>Khuyến Mãi</p>
                    </div>
                    <div className="noidungkhuyenmai pt-2">
                        <div className="d-flex justify-content-between align-items-center" style={{ height: '45px' }}>
                            <div className="d-flex align-items-center noidungkhuyenmai2" >
                                <p onClick={showModalVoucher} style={{ margin: '0', fontWeight: 'bolder', paddingRight: '10px' }}>Mã giảm giá</p>
                                <img width="32" height="32" src="https://img.icons8.com/dusk/50/discount-ticket.png" alt="discount-ticket" />
                                <Modal
                                    width={1100}
                                    title="Mã giảm giá của tôi"
                                    open={isModalVoucherOpen}
                                    onOk={handleOkVoucher}
                                    onCancel={handleCancelVoucher}
                                >
                                    <div className="voucher-container">
                                        {Array(6)
                                            .fill()
                                            .map((_, index) => (
                                                <div key={index} className="d-flex align-items-center magiamgiacuatoi">
                                                    <img
                                                        style={{ paddingRight: '10px' }}
                                                        width={100}
                                                        height={100}
                                                        src="/images/voucher.png"
                                                        alt="voucher"
                                                    />
                                                    <div
                                                        style={{
                                                            height: '130px',
                                                            width: '0px',
                                                            borderLeft: '2px dashed #d4d7de',
                                                            paddingRight: '10px',
                                                        }}
                                                    ></div>
                                                    <div className="pt-1">
                                                        <p style={{ fontWeight: 'bolder' }}>
                                                            Giảm giá 20k cho đơn hàng từ 150k
                                                        </p>
                                                        <p style={{ color: 'gray' }}>01.10.2024 - 31.10.2024 </p>
                                                        <p style={{ color: 'red', fontWeight: 'bolder' }}>
                                                            Chỉ còn 10 mã giảm giá
                                                        </p>
                                                    </div>
                                                    <div
                                                        className={`icon-container ${isChecked[index] ? 'checked' : ''}`}
                                                        onClick={() => handleToggle(index)}
                                                    >
                                                        <img
                                                            className="plus-icon"
                                                            width="32"
                                                            height="32"
                                                            src="https://img.icons8.com/ios/50/plus--v1.png"
                                                            alt="plus"
                                                            style={{ display: isChecked[index] ? 'none' : 'block' }}
                                                        />
                                                        <img
                                                            className="check-icon"
                                                            width="37"
                                                            height="37"
                                                            src="https://img.icons8.com/color/50/checked.png"
                                                            alt="check"
                                                            style={{ display: isChecked[index] ? 'block' : 'none' }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </Modal>
                            </div>
                            <div className="d-flex align-items-center ">
                                <img width="12" height="12" src="https://img.icons8.com/ios/50/forward--v1.png" alt="forward--v1" />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center noidungkhuyenmai2" style={{ height: '45px' }}>
                            <p style={{ margin: '0', fontWeight: 'bolder' }}>Ưu đãi cho đơn hàng</p>
                            <img width="12" height="12" src="https://img.icons8.com/ios/50/forward--v1.png" alt="forward--v1" />
                        </div>
                        <div className="d-flex justify-content-between align-items-center" style={{ height: '45px' }}>
                            <div className="d-flex align-items-center noidungkhuyenmai2">
                                <p style={{ margin: '0', fontWeight: 'bolder', paddingRight: '10px' }}>Giảm giá sốc !</p>
                                <img width="32" height="32" src="https://img.icons8.com/emoji/48/fire.png" alt="fire" />
                            </div>
                            <div>
                                <img width="12" height="12" src="https://img.icons8.com/ios/50/forward--v1.png" alt="forward--v1" />
                            </div>
                        </div>
                    </div>
                    <div className="tieudekhuyenmai mt-2">
                        <p>Thông tin thanh toán</p>
                    </div>
                    <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center" style={{ height: '45px' }}>
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
                            <NavLink to="/thanhtoan">
                                <button disabled={ListSPChecked.length === 0} style={{
                                    width: '100%', height: '45px',
                                    borderRadius: '5px', border: 'none',
                                    backgroundColor: ListSPChecked.length === 0 ? 'black' : 'red',
                                    color: 'white', fontWeight: 'bolder'

                                }}>Thanh toán</button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Cart;