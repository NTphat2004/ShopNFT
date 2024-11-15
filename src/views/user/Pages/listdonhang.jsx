import React, { useEffect, useState } from 'react'
import axios from 'axios'




function Listdonhang() {

  const [donhang, setdonhang] = useState([]);
  const [token, settoken] = useState("");
  const getdonhang = async () => {
    const res = await axios({ url: `http://localhost:8080/getalldonhang`, method: 'GET' })
    setdonhang(res.data)
  }
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

  const Show_order_details = async (id) => {
    let idauthorization = id.split("-")[1];
    const res = await axios({
      url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${idauthorization}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    console.log('order details',res.data);
    Show_details_for_authorized_payment(res.data.purchase_units[0].payments.authorizations[0].id);
   
    Show_captured_payment_details(res.data.purchase_units[0].payments.captures[0].id);
 
  }
  const Refund_captured_payment = async (url) => {
    const res = await axios({
      url: `${url}`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      data: {}
    })
  console.log(res.data);
  }

  const Show_details_for_authorized_payment = async (id) => {

    const res = await axios({
      url: `https://api-m.sandbox.paypal.com/v2/payments/authorizations/${id}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    console.log('authorization details', res.data);
 
  }
  const Show_captured_payment_details = async (id) => {
    const res = await axios({
      url: `https://api-m.sandbox.paypal.com/v2/payments/captures/${id} `,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    console.log('capture  payment  details', res.data);
    console.log(res.data.links.find(link => link.rel === "refund").href);  
    Refund_captured_payment(res.data.links.find(link => link.rel === "refund").href);
  }



  useEffect(() => {
    getPaypalAccessToken();
    getdonhang();

  }, [])

  return (
    <>
      <div>
        {donhang.map((item, index) => {
          return (
            <button onClick={() => Show_order_details(item.don_hangid)
            } className='btn btn-primary'>hủy đơn {item.don_hangid}</button>)
        })}
      </div>
    </>
  )
}

export default Listdonhang