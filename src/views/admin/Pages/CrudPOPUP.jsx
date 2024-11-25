import React, { useEffect, useState } from 'react'
import { Table, Space } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { render } from '@testing-library/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ColumnGroup from 'antd/es/table/ColumnGroup';

// Popup
// PopupID (PK)
// Ten_san_pham
// Gia_cu
// Gia_moi
// Phan_tramGG
// Thoi_gian_BD
// Thoi_gian_KT
// San_phamID (FK)
// AccountID (FK)






const CrudPOPUP = () => {
  const userId = localStorage.getItem('account_id');
  const [createorupdate, setcreateorupdate] = useState(false);
  const [product_discount, setproduct_discount] = useState([]);
  const [product_discount2, setproduct_discount2] = useState([]);
  const [datahanhdong, setdatahanhdong] = useState([]);
  const [selected, setSelected] = useState(false);
  const [change, setchange] = useState(0);
  const [tabledata, settabledata] = useState([]);
  let listtemp = [];
  let newid = '';
  const getnewestid = async () => {
    const res = await axios({
      url: 'http://localhost:8080/getnewestID',
      headers: { 'Content-type': 'application/json' },
    })
    newid = res.data;
    formik.setFieldValue('popupID', newid);
  }

  const formik = useFormik({
    initialValues: {
      popupID: '',
      han_su_dung: '',
      ngay_tao: '',
      hoat_dong: 'Đang hoạt động',
      users: userId,
      sanpham: '',
    }, validationSchema: Yup.object({
      han_su_dung: Yup.string().required('Hãy Nhập Chọn Banner'),
      ngay_tao: Yup.date().required('Hãy Nhập Ngày Tạo'),
      sanpham: Yup.array().required('Hãy Nhập Chọn Chọn ảnh')
    }),
    onSubmit: values => {
      alert(JSON.stringify(values));
      if (createorupdate) {
        alert('cap nhat');
        updatePopUp(values);
        // api(values);
        setchange(change + 1);
      } else {

        alert('them');
        api(values);
        setchange(change + 1);
      }
    }
  });


  const api = async (values) => {
    console.log('value', values);
    const res = await axios({
      url: 'http://localhost:8080/createnewPopup',
      method: 'POST',
      data: {
        'popupID': values.popupID,
        'ngay_tao': values.ngay_tao,
        'han_su_dung': values.han_su_dung,
        'trang_thai_xoa': values.trang_thai_xoa,
        'hoat_dong': values.hoat_dong,
        'users': {
          'accountID': values.users
        },
        'sanpham': personName.map((item) => ({ 'san_phamId': item }))
      },
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(res.data);
  }

  const updatePopUp = async (values) => {
    console.log('value', values);
    const res = await axios({
      url: 'http://localhost:8080/updatePopup',
      method: 'POST',
      data: {
        'popupID': values.popupID,
        'ngay_tao': values.ngay_tao,
        'han_su_dung': values.han_su_dung,
        'trang_thai_xoa': values.trang_thai_xoa,
        'hoat_dong': values.hoat_dong,
        'users': {
          'accountID': values.users
        },
        'sanpham': personName.map((item) => ({ 'san_phamId': item }))
      },
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(res.data);
  }




  const deletepopup = async (id) => {
    const res = await axios({
      url: 'http://localhost:8080/changeStatus',
      method: 'POST',
      data: {
        'popupID': id.popupID
      },
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(res.data);
  }

  const getdeletedrecord = async () => {
    const res = await axios({
      url: 'http://localhost:8080/getallpopuphasdeletedstatus',
      headers: { 'Content-type': 'application/json' },
    })
    const formattedData = res.data.map((item, index) => ({
      key: index,
      popupID: item.popupID,
      hansudung: item.han_su_dung,
      hanhdong: item.hanh_dong,
      hoatdong: item.hoat_dong,
      ngaytao: item.ngay_tao,
      trangthaixoa: item?.trang_thai_xoa,
      accountid: item?.users?.accountID,
      sanpham: item?.sanpham
    }));
    settabledata(formattedData);
  }

  const columns = [
    {
      title: 'PopupID',
      dataIndex: 'popupID',
      key: 'popupID',
    },
    {
      title: 'Hạn sử dụng',
      dataIndex: 'hansudung',
      key: 'hansudung',
    },
    {
      title: 'Hành động',
      dataIndex: 'hanhdong',
      key: 'hanhdong',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngaytao',
      key: 'ngaytao',
    },
    {

      dataIndex: 'trangthaixoa',
      key: 'trangthaixoa',
    },
    {
      title: 'AccountID',
      dataIndex: 'accountid',
      key: 'accountid',
    },
    {
      title: 'Nút',
      key: 'nut',
      render: (_, record) => (
        <div>
          <button className='btn btn-danger me-2' onClick={() => {

            deletepopup(record); getData()
          }} >Xóa</button>

          <button className='btn btn-danger' onClick={() => {
            formik.setValues(
              {
                popupID: record.popupID,
                han_su_dung: record.hansudung,
                ngay_tao: record.ngaytao,
                hoat_dong: record.hoatdong,
                trang_thai_xoa: record.trangthaixoa,
                users: record.accountid,
                sanpham: record.sanpham
              }
            );

            let product = [];
            listtemp = [...product_discount];

            for (let i = 0; i < record.sanpham.length; i++) {
              listtemp.push(record.sanpham[i]);
              product.push(
                record.sanpham[i].san_phamId
              )
            }


            console.log('listtemp', listtemp);
            console.log('option', options);
            console.log('product_discount', product_discount);
            setPersonName(product);
            setSelected(true);
            setproduct_discount2(listtemp);
            const tab2 = document.querySelector("#form-tab")
            tab2.click();
          }} >Edit</button>
        </div>
      )
    },

  ];

  const columnHanhdongs = [
    {
      title: 'PopupID',
      dataIndex: 'popupID',
      key: 'popupID',
    },
    {
      title: 'Hạn sử dụng',
      dataIndex: 'hansudung',
      key: 'hansudung',
    },
    {
      title: 'Hành động',
      dataIndex: 'hanhdong',
      key: 'hanhdong',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngaytao',
      key: 'ngaytao',
    },
    {

      dataIndex: 'trangthaixoa',
      key: 'trangthaixoa',
    },
    {
      title: 'AccountID',
      dataIndex: 'accountid',
      key: 'accountid',
    },
    {
      title: 'hanhdong',
      dataIndex: 'hanhdong',
      key: 'hanhdong',
    },
  ];


  const columns2 = [
    {
      title: 'PopupID',
      dataIndex: 'popupID',
      key: 'popupID',
    },
    {
      title: 'Hạn sử dụng',
      dataIndex: 'hansudung',
      key: 'hansudung',
    },
    {
      title: 'Hành động',
      dataIndex: 'hanhdong',
      key: 'hanhdong',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngaytao',
      key: 'ngaytao',
    },
    {

      dataIndex: 'trangthaixoa',
      key: 'trangthaixoa',
    },
    {
      title: 'AccountID',
      dataIndex: 'accountid',
      key: 'accountid',
    },
    {
      title: 'Nút',
      key: 'nut',
      render: (_, record) => (
        <div>
          <button className='btn btn-danger me-2' onClick={() => {
            undodelete(record); setchange(change + 1);

          }}>Khôi phục</button>
          {/* 
          <button className='btn btn-danger' onClick={() => {
            formik.setValues(
              {
                popupID: record.popupID,
                han_su_dung: record.hansudung,
                ngay_tao: record.ngaytao,
                hoat_dong: record.hoatdong,
                trang_thai_xoa: record.trangthaixoa,
                users: record.accountid,
                sanpham: record.sanpham
              }
            );

            let product = [];
            listtemp = [...product_discount];

            for (let i = 0; i < record.sanpham.length; i++) {
              listtemp.push(record.sanpham[i]);
              product.push(
                record.sanpham[i].san_phamId
              )
            }


            console.log('listtemp', listtemp);
            console.log('option', options);
            console.log('product_discount', product_discount);
            setPersonName(product);
            setSelected(true);
            setproduct_discount2(listtemp);
            const tab2 = document.querySelector("#form-tab")
            tab2.click();
          }} >Edit</button> */}
        </div>
      )
    },

  ];

  const undodelete = async (id) => {
    const res = await axios({
      url: 'http://localhost:8080/undodelete',
      method: 'POST',
      data: {
        'popupID': id.popupID
      },
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(res.data);
  }

  //handle change select
  // const handleChange = (value) => {
  //   console.log(`selected ${value}`);
  //   setSelectedRowKeys(value);
  //   console.log('dasd', selectedItems);
  // };



  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [selectedItems, setSelectedItems] = useState([

  // ]);
  const [dataSource, setdataSource] = useState([]);

  // data select box

  const options = product_discount.map((item) => ({
    value: item.san_phamId,
    label: item.ten_san_pham
  }))
  let options2 = product_discount2.map((item) => ({
    value: item.san_phamId,
    label: item.ten_san_pham
  }))


  const onSelectChange = (value) => {
    console.log(`selected ${value}`);
  };
  const fetchProductHasDiscount = async () => {
    try {
      const res = await axios({ url: 'http://localhost:8080/FindProducthaspopupid', method: 'GET' })
      setproduct_discount(res.data);
      console.log('fetch data', res.data);
    } catch (error) {
      console.error(error);
    }

  }


  const fetchDataHanhDong = async () => {
    try {
      const response = await axios.get('http://localhost:8080/FindAllPopUpwithDTO'); // Replace with actual API endpoint
      const formattedData = response.data.map((item, index) => ({
        key: index,
        popupID: item.popup.popupID,
        hansudung: item.popup.han_su_dung,
        hoatdong: item.popup.hoat_dong,
        ngaytao: item.popup.ngay_tao,
        trangthaixoa: item?.popup.trang_thai_xoa,
        accountid: item?.popup.users?.accountID,
        sanpham: item?.popup.sanpham,
        hanhdong: item?.tenHanhDong
      }));
      setdatahanhdong(formattedData)
      console.log('dataaaaaaa', formattedData)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getData = async () => {
    try {
      const res = await axios({ url: 'http://localhost:8080/getallpopupnotdeleted', method: 'GET' })
      const formattedData = res.data.map((item, index) => ({
        key: index,
        popupID: item.popupID,
        hansudung: item.han_su_dung,
        hanhdong: item.hanh_dong,
        hoatdong: item.hoat_dong,
        ngaytao: item.ngay_tao,
        trangthaixoa: item?.trang_thai_xoa,
        accountid: item?.users?.accountID,
        sanpham: item?.sanpham
      }));
      setdataSource(formattedData);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };




  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };



  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    var temparray = [];
    temparray.push({ 'san_phamId': value });
    formik.setFieldValue('sanpham', value);
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );


  };



  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  const rowSelection2 = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  useEffect(() => {
    getnewestid()
    getdeletedrecord()
    getData()
    fetchProductHasDiscount()
    fetchDataHanhDong()
  }, [])
  useEffect(() => {
    getData()
    getdeletedrecord()
    fetchProductHasDiscount()
    console.log('change :', change);
  }, [change])

  useEffect(() => {
    console.log('options2', options2);
  }, [personName, listtemp, options2]);

  return (
    <div className='container'>
      <div>
        <ul className="nav nav-pills nav-fill" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active fw-bold" id="table-tab" data-bs-toggle="tab" data-bs-target="#table-tab-pane" type="button" role="tab" aria-controls="table-tab-pane" aria-selected="true">DANH SÁCH</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link fw-bold" id="form-tab" data-bs-toggle="tab" data-bs-target="#form-tab-pane" type="button" role="tab" aria-controls="form-tab-pane" aria-selected="false">BIỂU MẨU</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link fw-bold" id="form-tab" data-bs-toggle="tab" data-bs-target="#table-tab-pane2" type="button" role="tab" aria-controls="form-tab-pane" aria-selected="false">Đã xóa</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link fw-bold" id="form-tab" data-bs-toggle="tab" data-bs-target="#table-tab-pane3" type="button" role="tab" aria-controls="form-tab-pane" aria-selected="false">Hành động</button>
          </li>
        </ul>
        {/* Tab content */}
        <div className="tab-content mt-3" id="myTabContent">
          {/* Table content */}
          <div className="tab-pane fade show active" id="table-tab-pane" role="tabpanel" aria-labelledby="table-tab">
            <h3>QUẢN LÍ POPUP</h3>
            <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} />
          </div>
          {/* Form content */}
          <div className="tab-pane fade" id="form-tab-pane" role="tabpanel" aria-labelledby="form-tab">
            <form onSubmit={formik.handleSubmit} className="row mt-5">
              <div className="col-md-6 my-2">
                <div className="form-floating mb-3">
                  <input type="pasword" className="form-control" value={formik.values.popupID} id="floatingPassword" placeholder="Password" />
                  <label htmlFor="floatingPassword" className='text-primary fw-bold'>POPUP ID</label>

                </div>
                <FormControl sx={{ m: 1, width: 600 }}>
                  <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={personName}
                    onChange={handleChange

                    }
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                    {options2.length == 0 ? options.map((name) => (
                      <MenuItem key={name.label} value={name.value}>
                        <Checkbox checked={personName.includes(name.value)} />
                        <ListItemText primary={name.label} />
                      </MenuItem>
                    )) : options2.map((name) => (
                      <MenuItem key={name.label} value={name.value}>
                        <Checkbox checked={personName.includes(name.value)} />
                        <ListItemText primary={name.label} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formik.errors.sanpham && <div className="text-danger ms-1 fw-bold">{formik.errors.sanpham}</div>}
              </div>
              <div className="col-md-6 my-2">
                <div className="form-floating ">
                  <input value={formik.values.ngay_tao} type="date" onChange={(e) => {
                    formik.setFieldValue("ngay_tao", e.target.value);
                  }} className="form-control" id="floatingPassword" placeholder="Ngày tạo" />
                  <label htmlFor="floatingPassword" className='text-primary fw-bold'>NGÀY TẠO</label>
                  {formik.errors.ngay_tao && <div className="text-danger ms-1 fw-bold">{formik.errors.ngay_tao}</div>}
                </div>
                <div className="form-floating mt-3 ">
                  <input value={formik.values.han_su_dung} type="date" onChange={(e) => {
                    formik.setFieldValue("han_su_dung", e.target.value);
                  }} className="form-control" id="floatingPassword" placeholder="Ngày hết hạn" />
                  <label htmlFor="floatingPassword" className='text-primary fw-bold'>HẠN SỬ DỤNG</label>
                  {formik.errors.han_su_dung && <div className="text-danger ms-1 fw-bold">{formik.errors.han_su_dung}</div>}
                </div>
                <div className="form-check form-check-inline mt-4">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="options"
                    id="option1"
                    value="Đang hoạt động"
                    onChange={(e) => {
                      formik.setFieldValue("hoatdong", e.target.value);
                    }}
                    checked={formik.values.hoat_dong == "Đang hoạt động"}
                  />
                  <label className="form-check-label fw-bold text-primary" htmlFor="option1">
                    Hoạt động
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="options"
                    id="option2"
                    value="Không hoạt động"
                    onChange={(e) => {
                      formik.setFieldValue("hoatdong", e.target.value);
                    }}
                    checked={formik.values.hoat_dong == "Không hoạt động"}
                  />
                  <label className="form-check-label fw-bold text-primary" htmlFor="option2">
                    Không hoạt động
                  </label>
                </div>
              </div>
              <div className="col-md-4 my-2">
              </div>
              <div className="col-md-12 text-center mt-3">

                {selected ? <button className='btn btn-outline-warning fw-bold ms-2 mt-2'
                  onClick={() => setcreateorupdate(true)} type='submit' style={{ minWidth: 120 }}> Cập nhật Danh Mục</button> :
                  <button className='btn btn-outline-primary fw-bold ms-2 mt-2' onClick={() => setcreateorupdate(false)} type='submit' style={{ minWidth: 120 }} > Thêm Danh Mục</button>}
                <button className='btn btn-outline-success fw-bold ms-2 mt-2' type='button' onClick={() => {
                  formik.resetForm();
                  getnewestid();
                  setPersonName([]);
                  setSelected(false);
                  setproduct_discount2([]);
                  options2 = [];

                }} style={{ minWidth: 120 }}> Làm mới</button>

              </div>
            </form>
          </div>
          <div className="tab-pane fade " id="table-tab-pane2" role="tabpanel" aria-labelledby="table-tab">
            <h3>QUẢN LÍ POPUP3</h3>
            <Table rowSelection={rowSelection2} columns={columns2} dataSource={tabledata} />
          </div>
          <div className="tab-pane fade " id="table-tab-pane3" role="tabpanel" aria-labelledby="table-tab">
            <h3>QUẢN LÍ POPUP4</h3>
            <Table rowSelection={rowSelection} columns={columnHanhdongs} dataSource={datahanhdong} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CrudPOPUP