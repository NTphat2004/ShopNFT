import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios';
const ListDanhHieu = () => {

  const [ThuongHieu,SetThuongHieu]= useState([]);
  const API_ThuongHieu =  async () =>{
    const res = await axios({url:"http://localhost:8080/ThuongHieu/FINDALL",method:'GET'})
    SetThuongHieu(res.data)
  }

  useEffect(()=>{
    console.log("thuong hieu run")
    API_ThuongHieu()
  },[])
  return (
    <div className='row ' style={{
      display: 'flex',
      justifyContent: 'center',
    
     
    }}>

  
    {ThuongHieu.map((thuonghieu)=>{
      return <div  className="card mx-4 text-center " key={thuonghieu.thuong_hieuID}  style={{ width: '90px', height: '90px', borderRadius: '20px',margin:30}} >
      <div className='mx-auto mt-3'>
        <img src={`/images/${thuonghieu.hinh_anh}`}  className='img-fluid' alt="" />

      </div>  
    
    </div>
    })}
     


      

    </div>
  )
}

export default ListDanhHieu