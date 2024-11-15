import React from "react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { Select } from 'antd';
import { DeleteOutlined, EditOutlined, CreditCardOutlined, WalletOutlined } from '@ant-design/icons';
import axios from "axios";
import { Formik, useFormik } from 'formik';
import { useSelector } from "react-redux";

const userId = localStorage.getItem('account_id');
let shipfee = localStorage.getItem('shippingfee');
let total = localStorage.getItem('totalamount');
let totalafterdiscount = localStorage.getItem('total_after');
let discount = localStorage.getItem('discount');



const AddressCurrent = localStorage.getItem('addressCurent') ? JSON.parse(localStorage.getItem('addressCurent')) : null;

console.log('test', (((parseInt(total) + parseInt(shipfee)) * 0.00003951).toString()));
console.log(Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(
    ((parseInt(total) + parseInt(shipfee)) * 0.00003951)).toString());
const options = [
    {
        label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img style={{ marginRight: '8px' }} width="24" height="24" src="https://img.icons8.com/office/40/wallet.png" alt="wallet" /> Thanh toán trực tiếp
            </div>
        ),
        value: '1',
    },
    {
        label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img width={24} height={24} src="/images/vnpay.png" alt="" /> Ví Vnpay
            </div>
        ),
        value: '2',
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
    const [donhangid, setdonhangid] = useState('');
    const [token, settoken] = useState("");
    const [leadtime, setleadtime] = useState(0);
    const ListSPChecked = useSelector(state => state.cart.ListSpthanhtoan2) || [];
    console.log(ListSPChecked);
    const product_id_params = ListSPChecked.map(item => item.sanPham.san_phamId);
    const product_quantity_params = ListSPChecked.map(item => item.soLuong);
    console.log(product_id_params);
    console.log(ListSPChecked.map(item => item.soLuong));
    const totalAmount = Array.isArray(ListSPChecked)
        ? ListSPChecked.reduce((total, Spthanhtoan) => {
            const price = Spthanhtoan.sanPham.gia_km > 0 ? Spthanhtoan.sanPham.gia_km : Spthanhtoan.sanPham.gia_goc;
            return total + (Spthanhtoan.soLuong * price);
        }, 0)
        : 0;


    const [showPopup, setShowPopup] = useState(false);
    const [listprovince, setlistprovince] = useState([]);

    const api = async () => {
        const res = await axios({
            url: 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', method: 'GET',
            headers: {
                "Token": "b20158be-5619-11ef-8e53-0a00184fe694",
            }
        });
        setlistprovince(res.data.data);
    }

    const diachi = React.useRef(null);
    const shippingfee = React.useRef(null);
    const sodt = React.useRef(null);
    const btn = React.useRef(null);
    const btn3 = React.useRef(null);
    const [diachivalue, setdiachivalue] = useState("");
    const [diachivalue2, setdiachivalue2] = useState("");
    const [shipvalue, setshipvalue] = useState("");
    const [method, setmethod] = useState(1);
    const redirect = useNavigate();

    const btn3click = () => {
        redirect('/');
    }

    const data = {
        token: "b20158be-5619-11ef-8e53-0a00184fe694",
        shop_id: 193308,
        service_type_id: null,
        service_id: 53320,
        insurance_value: 100000,
        coupon: null,
        cod_failed_amount: 2000,
        from_district_id: 1454,
        from_ward_code: "21211",
        to_district_id: 1452,
        to_ward_code: "21012",
        weight: parseInt(15),
        length: parseInt(50),
        width: parseInt(50),
        height: parseInt(50),
        cod_value: parseInt(0),
    };
    const apishippingfee = async () => {
        const res = await axios({
            url: 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', method: 'POST',
            headers: {
                'Token': data.token,
                'Content-Type': 'application/json',
            }, data: JSON.stringify(data),

        }); setshipvalue(res.data.data.total);
        setdiachivalue(diachi.current.innerHTML);
        let firstindex = diachivalue.indexOf("tinh");
        console.log(firstindex);
        let diachitemp = diachivalue.substring(firstindex, diachivalue.lastIndexOf(','));
        let diachitemp2 = diachitemp.substring(diachitemp.indexOf(' ')).trim();
        console.log(diachitemp);
        console.log(diachitemp2);
        for (let i = 0; i < listprovince.length; i++) {
            if (listprovince[i].ProvinceName === diachitemp2) {
                console.log("tỉnh id", listprovince[i].ProvinceID);
                setdiachivalue2(listprovince[i].ProvinceID);
            }
        }
        let formatnumber = res.data.data.total.format(2, 3, '.', ',');;
    };




    const apipayment = async (id) => {
        console.log('run save');
        console.log("method :", method);
        const res = await axios({
            url: `http://localhost:8080/createpayment?userid=${userId}&spid=${product_id_params}&quantity=${product_quantity_params}&total=${parseInt(totalAmount) + parseInt(shipfee)}&method=${method}&paypalid=${id}`, method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }, data: {
                'don_hangid': null,
                'trang_thai': method == "1" ? "Nhận đơn" : "chờ thanh toán",
                'ngay_tao': new Date(),
                'thoi_gianXN': null,
                'dia_chi': AddressCurrent.dia_chi,
                'so_dien_thoai': AddressCurrent.users.so_dien_thoai,
                'ghi_chu': null,
                'phi_ship': shipfee,
                'tong_tien': parseInt(totalAmount) + parseInt(shipfee),
                'thoi_gian_du_kien': leadtime.toString(),
                'users': {
                    'accountID': AddressCurrent.users.accountID,
                },
                'diachi': {
                    'dia_chiID': AddressCurrent.dia_chiID
                },
                'phuongthuctt': {
                    'phuong_thucTTID': method == '1' ? "ptt01" : "ptt02"
                }
            }
        });
        console.log("Response tao don hang: ", res.data);
        setdonhangid(res.data.don_hangid);
    }


    Number.prototype.format = function (n, x, s, c) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
            num = this.toFixed(Math.max(0, ~~n));

        return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    };

    const getPaypalAccessToken = async () => {
        const res = await axios({
            method: 'post',
            url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
            data: 'grant_type=client_credentials', // => this is mandatory x-www-form-urlencoded. DO NOT USE json format for this
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',// => needed to handle data parameter
                'Accept-Language': 'en_US',
            },
            auth: {
                username: "AUuoahug326XM8PupIWATfSZph2ulLyvj714hnfx7DV-Z9MNjC9hSehpDh4VqE6mvtS6ExGgNSkhML2K",
                password: "EBRxibct4O7BsLjLUR0iAELmNHPVzI0UCU5HQ-LOzW-w3EUVOWRYhiLP4bZK4zM0YNX-IkWs_blvqV8c"
            },

        });

        localStorage.setItem('paypal_token', res.data.access_token);
        console.log('paypal access token', res.data.access_token);
        settoken(res.data.access_token);
    }

    const capturepayment = async (orderid) => {
        const res = await axios({
            url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/69S924224Y991290R/capture`,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }, data: {

            }
        });
    }

    const Calculate_the_expected_delivery_time = async () => {
        const res = await axios({
            url: `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime`,
            method: 'POST',
            headers: {
                'Token': "b20158be-5619-11ef-8e53-0a00184fe694",
                'Content-Type': 'application/json',
            },
            data: {
                "from_district_id": 1454,
                "from_ward_code": "21211",
                "to_district_id": parseInt((AddressCurrent.quan).substring(AddressCurrent.quan.indexOf('-') + 1, AddressCurrent.quan.length)),
                "to_ward_code": (AddressCurrent.phuong).substring(AddressCurrent.phuong.indexOf('-') + 1, AddressCurrent.phuong.length),
                "service_id": 53320
            }


        });
        console.log(res.data);
        setleadtime(res.data.data.leadtime);
    }


    const paypal_CreateOrder = async () => {
        console.log("create paypal order");
        console.log(getPaypalAccessToken());
        const res = await axios({
            url: `https://api-m.sandbox.paypal.com/v2/checkout/orders `, method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }, data: {
                "intent": "AUTHORIZE",
                "purchase_units": [
                    {
                        "amount": {
                            "currency_code": "USD",
                            "value": Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(
                                ((parseInt(total) + parseInt(shipfee)) * 0.00003951)).toString()
                        }
                    }
                ],
                "application_context": {
                    "return_url": "http://localhost:3000/paymentreturn",
                    "cancel_url": "http://localhost:3000/paymentreturn",
                    "shipping_preference": "NO_SHIPPING",
                    "user_action": "PAY_NOW"
                }
            }

        });
        apipayment(res.data.id);
        console.log('paypal', res.data.links.find(link => link.rel === "approve").href);
        if (method === "2") {
            console.log('run paypal');
            window.open(res.data.links.find(link => link.rel === "approve").href, "_blank");
            localStorage.setItem('paypal_order_id', res.data.id);
        }
    }







    useEffect(() => {

    }, [donhangid]);


    useEffect(() => {
        api();
        // apishippingfee();
        getPaypalAccessToken();
        Calculate_the_expected_delivery_time();
        shipfee = localStorage.getItem('shippingfee');
        total = localStorage.getItem('totalamount');
        totalafterdiscount = localStorage.getItem('total_after');
        discount = localStorage.getItem('discount');
        console.log('method', method);

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
    }, [method, discount]);


    const handleInputClick = () => {
        setShowPopup(true);
    };

    return (
        <>
            <header className="bg-white border-bottom">
                <div className="container-fluid py-1">
                    <div className="row align-items-center">
                        <div className="col-3 col-md-3 d-flex align-items-center mt-2 ps-3">
                            <NavLink to="/">
                                <img src="/images/logo-removebg-preview.png" className="me-3 img-fluid" width={80} alt="" />
                            </NavLink>
                        </div>
                        <div className="col-6 col-md-6 mt-2 mt-md-0 d-flex justify-content-center mt-2 px-2">
                            <input type="text" className="form-control me-2" style={{ width: '500px' }} placeholder="Tìm kiếm" onClick={handleInputClick} />
                            <button className="btn btn-outline-secondary" type="submit">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                        <div className="col-3 col-md-3 d-flex justify-content-end align-items-center mt-2">
                            <NavLink className="me-4 d-flex align-items-center" to="#">
                                <i className="bi bi-person-circle text-dark fs-4"></i>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </header>

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
                        <p className="noidung" style={{ paddingLeft: '200px' }}>Thành | <span ref={sodt} className="sodt">0984762140</span> </p>
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
                                <p style={{ fontSize: '20px', fontWeight: 'bolder' }}> {sp.sanPham.gia_km > 0 ? sp.soLuong * sp.sanPham.gia_km : sp.soLuong * sp.sanPham.gia_goc} </p>
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
                                onChange={(value) => {
                                    setmethod(value)
                                }}
                            />
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-4" style={{ height: '45px' }}>
                            <div>
                                <p style={{ margin: '0', color: '#777e90' }}>Tổng giá trị đơn hàng</p>
                            </div>
                            <div className="fw-bolder">
                                {(total).toLocaleString()} ₫
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center" style={{ height: '45px' }}>
                            <div>
                                <p style={{ margin: '0', color: '#777e90' }}>Phí vận chuyển</p>
                            </div>
                            <div className="fw-bolder">
                                {(shipfee).toLocaleString()} đ
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center" style={{ height: '45px' }}>
                            <div>
                                <p style={{ margin: '0', fontWeight: 'bolder' }}>Thành tiền</p>
                            </div>
                            <div className="fw-bolder" style={{ color: 'red' }}>
                                <span className="text-decoration-line-through me-2"> {(parseInt(total) + parseInt(shipfee)).toLocaleString()}</span>
                                {discount > 0 ? (totalafterdiscount).toLocaleString() : (parseInt(total) + parseInt(shipfee)).toLocaleString()} ₫
                            </div>
                        </div>
                        <div className="col-12 mt-2 thanhtoan" >
                            <button data-bs-toggle="modal" data-bs-target="#exampleModal2" ref={btn} onClick={() => {
                                paypal_CreateOrder()

                            }} style={{
                                width: '100%', height: '45px',
                                borderRadius: '5px', border: 'none', backgroundColor: 'red',
                                color: 'white', fontWeight: 'bolder'
                            }}>Đặt hàng</button>
                        </div>
                        {/* <div className="col-12 mt-2 thanhtoan" >
                            <button onClick={paypal_CreateOrder} style={{
                                width: '100%', height: '45px',
                                borderRadius: '5px', border: 'none', backgroundColor: 'red',
                                color: 'white', fontWeight: 'bolder'
                            }}>Đặt hàng</button>
                        </div> */}


                        <div>
                            <div className="modal fade" id="exampleModal2" tabIndex={-1} >
                                <div className="modal-dialog modal-dialog-centered" >
                                    <div className="modal-content">
                                        <div className="modal-header" style={{ borderBottom: 'none' }}>
                                            <div className='h2'>Đặt hàng thành công</div>
                                        </div>
                                        <div className="modal-footer text-center    ">
                                            <button ref={btn3} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                                <Link to={`/lịch-sử-đặt-hàng/`} >
                                                    Xem Chi Tiết
                                                </Link>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Thanhtoan;