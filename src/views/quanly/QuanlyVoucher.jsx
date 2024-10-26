import { Tabs, Select, Table } from "antd"; // Thêm Table từ antd
import "../../styles/QuanLyVoucher.css";
import { ExportOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

const onChange = (key) => {
  console.log(key);
};

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Cấu hình cột cho bảng
const columns = [
  {
    title: "Mã voucher",
    dataIndex: "voucherID",
    key: "voucherID",
  },
  {
    title: "Điều kiện",
    dataIndex: "dieu_kien",
    key: "dieu_kien",
  },
  {
    title: "Đơn hàng tối thiểu",
    dataIndex: "don_hang_toi_thieu",
    key: "don_hang_toi_thieu",
  },
  {
    title: "Hạn sử dụng",
    dataIndex: "han_su_dung",
    key: "han_su_dung",
  },
  {
    title: "Hoạt động",
    dataIndex: "hoat_dong",
    key: "hoat_dong",
  },
  {
    title: "Số lượng",
    dataIndex: "so_luong",
    key: "so_luong",
  },
  {
    title: "Số lượng sử dụng",
    dataIndex: "so_luot_SD",
    key: "so_luot_SD",
  },
  {
    title: "Số tiền giảm giá",
    dataIndex: "so_tien_giam",
    key: "so_tien_giam",
  },
  {
    title: "Hình ảnh",
    dataIndex: "hinh_anh",
    key: "hinh_anh",
    render: (text) => (
      <img src={text} alt="Voucher" style={{ width: 50, height: 50 }} />
    ),
  },
  {
    title: "Hành động",
    dataIndex: "hanhdong",
    key: "hanhdong",  
    render: (text, record) => (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <EditOutlined />
        <DeleteOutlined />
      </div>
    ),
  },
];
 
const Voucher = () => {
  const [voucherData, setVoucherData] = useState([]);

  useEffect(() => {
    const fetchVoucherData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/listVoucher");
        const data = await response.json();
        console.log("Dữ liệu là: ", data);
        const formattedData = data.map((item) => ({
          key: item.voucherID,
          voucherID: item.voucherID,
          dieu_kien: item.dieu_kien,
          don_hang_toi_thieu: item.don_hang_toi_thieu,
          han_su_dung: item.han_su_dung,
          hoat_dong: item.hoat_dong ? "Hoạt động" : "Ngừng hoạt động",
          so_luong: item.so_luong,
          so_luot_SD: item.so_luot_SD,
          so_tien_giam: item.so_tien_giam,
          hinh_anh: item.hinh_anh,
        }));
        setVoucherData(formattedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu voucher:", error);
      }
    };
    fetchVoucherData();
  }, []);

  return (
    <Tabs
      className="mx-auto"
      style={{ width: "1100px", margin: "auto" }}
      onChange={onChange}
      type="card"
      items={[
        {
          label: `Thông tin chung`,
          key: "1",
          children: (
            <div className="tab-content">
              <h1>Thông tin chung</h1>
              <div className="input-container">
                <div className="form-group">
                  <label htmlFor="productCode">Mã voucher</label>
                  <input type="text" id="mavoucher" className="form-control" />
                </div>
                <div className="form-group">
                  <label htmlFor="productName">Điều kiện</label>
                  <input type="text" id="dieukien" className="form-control" />
                </div>
                <div className="form-group">
                  <label htmlFor="productName">Đơn hàng tối thiểu</label>
                  <input
                    type="number"
                    id="donhangtoithieu"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="input-container">
                <div className="form-group">
                  <label htmlFor="createDate">Hạn sử dụng</label>
                  <input type="date" id="hansudung" className="form-control" />
                </div>

                <div className="form-group">
                  <label htmlFor="warehouseStatus">Hoạt động</label>
                  <Select
                    defaultValue="active"
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      height: "40px",
                    }}
                    onChange={handleChange}
                    options={[
                      { value: "active", label: "Hoạt động" },
                      { value: "inactive", label: "Ngừng hoạt động" },
                    ]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="soluong">Số lượng</label>
                  <input type="number" id="soluong" className="form-control" />
                </div>
              </div>

              <div className="input-container">
                <div className="form-group">
                  <label htmlFor="soluotsudung">Số lượt sử dụng</label>
                  <input
                    type="number"
                    id="soluotsudung"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productQuantity">Số tiền giảm giá</label>
                  <input
                    type="number"
                    id="sotiengiamgia"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="productQuantity">Hình ảnh</label>
                <input type="file" id="hinhanh" className="form-control" />
              </div>

              <div className="input-container">
                <div className="form-group">
                  <button className="button">Thêm</button>
                </div>
                <div className="form-group">
                  <button className="button">Xóa</button>
                </div>
                <div className="form-group">
                  <button className="button">Cập nhật</button>
                </div>
                <div className="form-group">
                  <button className="button">Làm mới</button>
                </div>
              </div>
            </div>
          ),
        },
        {
          label: `Danh sách voucher`,
          key: "2",
          children: (
            <div className="tab-content">
              <h1>Danh sách voucher</h1>
              <button
                style={{
                  marginBottom: "20px",
                  float: "right",
                  display: "flex",
                  alignItems: "center",
                }}
                className="buttonexcel"
              >
                <ExportOutlined style={{ marginRight: "8px" }} /> Xuất file
                excel
              </button>
              <Table
                dataSource={voucherData}
                columns={columns}
                pagination={false}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default Voucher;
