
import React, { Component, useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";

const ResultPayment = () => {
    const token = localStorage.getItem('paypal_token');
    const [iserror, setiserror] = useState(false);
    const userId = localStorage.getItem('account_id');
    const paypal_order_id = localStorage.getItem('paypal_order_id');
    console.log(paypal_order_id);
    const capturepaymentfororder = async (orderid) => {
        console.log('run authorize');
        const res = await axios({
            url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypal_order_id}/authorize `,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }, data: {

            }
        }).catch((err) => {
            console.log('error', err);
            if (err.status != 201) {
                setiserror(true);
            }

        });
        console.log(res.data.purchase_units[0].payments.authorizations[0].id);
        if (res.status == 201) {
            let id = "dh-" + res.data.id;
            updateStatus(id);
            localStorage.setItem('paypal_order_id', null);
        }
        details_for_authorized_payment(res.data.purchase_units[0].payments.authorizations[0].id);


    }

    const Show_details_order = async () => {

        const res = await axios({
            url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypal_order_id}`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }, data: {

            }
        })
        saveuserwalletinfo(res.data.payment_source.paypal.account_id);
    }



    const saveuserwalletinfo = async (walletid,) => {
        const res = await axios({
            url: `http://localhost:8080/saveuserwallet?userid=${userId}&walletid=${walletid}`,
            method: 'POST',
            data: {
             
            }
        });
        console.log(res.data);
    }

    const updateStatus = async (id) => {
        const res = await axios({ url: `http://localhost:8080/updatestatus?id=${paypal_order_id}`, method: 'PUT' });
    }
    const details_for_authorized_payment = async (id) => {
        console.log("run get details");
        const res = await axios({
            url: `https://api-m.sandbox.paypal.com/v2/payments/authorizations/${id}`,
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        console.log(res.data.links.find(link => link.rel === "capture").href)
        Capture_authorized_payment(res.data.links.find(link => link.rel === "capture").href);
    }



    const Capture_authorized_payment = async (url) => {
        console.log('run capture');
        const res = await axios({
            url: `${url}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            data: {
            }
        });
        console.log(res.data);
    }

    useEffect(() => {
        capturepaymentfororder();
        Show_details_order();
    }, [iserror])

    return (
     
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
                                    <span className="title_button">  <div>{iserror ? 'Thanh toán thất bại' : 'thanh toán thành công'}</div></span>
                                    <p className="message_button">Thank you for your purchase. you package will be delivered within 2 days of your purchase</p>
                                </div>
                                <div className="actions_button">
                                    <button className="history_button" type="button"><Link style={{ textDecoration: 'none' }} to={`/`} >
                                        Trang chủ
                                    </Link></button>
                                    <button className="track_button" type="button"> <Link style={{ textDecoration: 'none' }} to={`/order-history`} >
                                        Theo dõi đơn hàng
                                    </Link></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
  
    )
}

export default ResultPayment