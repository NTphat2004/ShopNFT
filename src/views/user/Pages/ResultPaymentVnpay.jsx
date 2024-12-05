
import React, { Component, useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useSearchParams } from "react-router-dom";


const ResultPayment = () => {
    const token = localStorage.getItem('paypal_token');
    const [iserror, setiserror] = useState(false);
    const userId = localStorage.getItem('account_id');
    const paypal_order_id = localStorage.getItem('paypal_order_id');
    let donhangid = localStorage.getItem('donhangidvnpay');
    console.log(paypal_order_id);
    const [searchParams] = useSearchParams();

    const vnpTxnRef = searchParams.get("vnp_TxnRef");
    const vnpTransactionNo = searchParams.get("vnp_TransactionNo");
    const vnpResponseCode = searchParams.get("vnp_ResponseCode");
    const vnpTransactionStatus = searchParams.get("vnp_TransactionStatus");

    // const getdonangid = async (id,responecode) => {
    //     const res = await axios({
    //         url: `http://localhost:8080/api/donhang/getbypaymentid?id=${id}`,
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         }, data: {
    //         }
    //     }); 
    //     console.log(res.data);
    //     updateStatus(res.data,responecode);
    // }

    const updateStatus = async (id, responecode) => {
        if (responecode == "00") {
            const res = await axios({ url: `http://localhost:8080/updatastatusvnpay?id=${id}`, method: 'PUT' });
        }
    }



    const [message, setmessage] = useState('');
    const error_returnFormVNpay = (vnpResponseCode) => {
        if (vnpResponseCode == '00') {
            setmessage("Giao dịch thành công");
        }
        else if (vnpResponseCode == '07') {
            setmessage("Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường");
            setiserror(true);
        }
        else if (vnpResponseCode == '09') {
            setmessage("Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.");
            setiserror(true);
        }
        else if (vnpResponseCode == '10') {
            setmessage("  Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ / tài khoản không đúng quá 3 lần");
            setiserror(true);
        }
        else if (vnpResponseCode == '11') {
            setmessage("  Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.");
            setiserror(true);
        }
        else if (vnpResponseCode == '13') {
            setmessage(" Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.");
            setiserror(true);
        }
        else if (vnpResponseCode == '24') {
            setmessage(" Giao dịch không thành công do: Khách hàng hủy giao dịch.");
            setiserror(true);
        }
        else if (vnpResponseCode == '79') {
            setmessage(" Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch");
            setiserror(true);
        }
    }


    useEffect(() => {
        error_returnFormVNpay(vnpResponseCode);
        donhangid = localStorage.getItem('donhangidvnpay');
        updateStatus(donhangid, vnpResponseCode);
        console.log(vnpTxnRef);
        console.log(vnpTransactionNo);
        console.log(message);
    }, [iserror, vnpTransactionNo])

    return (
        <>
            <div className='container' >
                <div className='' style={{
                    'display': 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    'height': '70dvh',
                }}>
                    <div className='col-7 offset-5 '>
                        <div className="card_button">
                            <button className="dismiss_button" type="button">×</button>
                            <div className="header_button">
                                <div className="image_button">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M20 7L9.00004 18L3.99994 13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </g></svg>
                                </div>
                                <div className="content_button">
                                    <span className="title_button">  <div>{message}</div></span>
                                    <p className="message_button">Thank you for your purchase. you package will be delivered within 2 days of your purchase</p>
                                </div>
                                <div className="actions_button">
                                    <button className="history_button" type="button"><Link style={{ textDecoration: 'none' }} to={`/`} >
                                        Trang chủ
                                    </Link></button>
                                    <button className="track_button" type="button"> <Link style={{ textDecoration: 'none' }} to={`/lịch-sử-đặt-hàng`} >
                                        Theo dõi đơn hàng
                                    </Link></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResultPayment