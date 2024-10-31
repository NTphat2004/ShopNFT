import { Tabs, Select, Table } from "antd"; // Thêm Table từ antd
import "../../styles/Quanlykho.css";
import { DeleteOutlined, EditOutlined, ExportOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

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
    title: "Mã sản phẩm",
    dataIndex: "san_phamId",
    key: "san_phamId",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "ten_san_pham",
    key: "ten_san_pham",
  },
  {
    title: "Ngày tạo",
    dataIndex: "ngay_tao",
    key: "ngay_tao",
  },
  {
    title: "Số lượng",
    dataIndex: "so_luong",
    key: "so_luong",
  },
  {
    title: "Giá bán ra",
    dataIndex: "gia_goc",
    key: "gia_goc",
  },
  {
    title: "Trạng thái kho",
    dataIndex: "trang_thai_kho",
    key: "trang_thai_kho",
  },
  {
    title: "Phê duyệt",
    dataIndex: "phe_duyet",
    key: "phe_duyet",
  },
  {
    title: "Trạng thái xóa",
    dataIndex: "trang_thai_xoa",
    key: "trang_thai_xoa",
  },
  {
    title: "Nhập hàng",
    dataIndex: "nhap_hang",
    key: "nhap_hang",
  },
  {
    title: "Tiền nhập hàng",
    dataIndex: "tien_nhap_hang",
    key: "tien_nhap_hang",
  },
  {
    title: "Chiều cao",
    dataIndex: "chieu_cao",
    key: "chieu_cao",
  },
  {
    title: "Chiều dài",
    dataIndex: "chieu_dai",
    key: "chieu_dai",
  },
  {
    title: "Chiều rộng",
    dataIndex: "chieu_rong",
    key: "chieu_rong",
  },
  {
    title: "Khối lượng",
    dataIndex: "khoi_luong",
    key: "khoi_luong",
  },
  {
    title: "Hành động",
    dataIndex: "hanh_dong",
    key: "hanh_dong",
    render: (_, record) => (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <EditOutlined />
        <DeleteOutlined />
      </div>
    ),
  },
];

const Kho = () => {
  const [khoData, setKhoData] = useState([]);

  useEffect(() => {
    const fetchKhoData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/listSanPham");
        const data = await response.json();
        console.log("Dữ liệu là: ", data);
        const formattedData = data.map((item) => ({
          key: item.san_phamId,
          san_phamId: item.san_phamId,
          ten_san_pham: item.ten_san_pham,
          ngay_tao: item.ngay_tao,
          so_luong: item.so_luong,
          gia_goc: item.gia_goc,
          trang_thai_kho: item.trang_thai_kho,
          phe_duyet: item.phe_duyet ? "Đã phê duyệt" : "Chưa phê duyệt",
          trang_thai_xoa: item.trang_thai_xoa ? "Đã xoá" : "Chưa xoá",
          nhap_hang: item.nhap_hang ? "Đã nhập hàng" : "Chưa nhập hàng",
          tien_nhap_hang: item.tien_nhap_hang,
          chieu_cao: item.chieu_cao,
          chieu_dai: item.chieu_dai,
          chieu_rong: item.chieu_rong,
          khoi_luong: item.khoi_luong,
        }));
        setKhoData(formattedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu voucher:", error);
      }
    };
    fetchKhoData();
  }, []);

  return(
    <Tabs
    className="mx-auto"
    style={{ width: "1170px", margin: "auto" }}
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
                <label htmlFor="productCode">Mã sản phẩm</label>
                <input type="text" id="san_phamId" className="form-control" />
              </div>
              <div className="form-group">
                <label htmlFor="productName">Tên sản phẩm</label>
                <input type="text" id="ten_san_pham" className="form-control" />
              </div>
            </div>

            <div className="input-container">
              <div className="form-group">
                <label htmlFor="createDate">Ngày tạo</label>
                <input
                  type="date"
                  id="ngay_tao"
                  className="form-control"
                  value={getCurrentDate()}
                />
              </div>
              <div className="form-group">
                <label htmlFor="productQuantity">Số lượng</label>
                <input
                  type="number"
                  id="so_luong"
                  className="form-control"
                />
              </div>
            </div>

            <div className="input-container">
              <div className="form-group">
                <label htmlFor="warehouseStatus">Trạng thái kho</label>
                <Select
                  defaultValue="active"
                  style={{ width: "100%", borderRadius: "8px" }}
                  onChange={handleChange}
                  options={[
                    { value: "active", label: "Hoạt động" },
                    { value: "inactive", label: "Ngừng hoạt động" },
                  ]}
                />
              </div>
              <div className="form-group">
                <button className="button">Cập nhật</button>
              </div>
            </div>
          </div>
        ),
      },
      {
        label: `Danh sách kho`,
        key: "2",
        children: (
          <div className="tab-content">
            <h1>Danh sách kho</h1>
            <button
              style={{
                marginBottom: "20px",
                float: "right", 
                display: "flex", 
                alignItems: "center", 
              }}
              className="buttonexcel"
            >
              <ExportOutlined style={{ marginRight: "8px" }} />{" "}
              Xuất file excel
            </button>
            <Table
              dataSource={khoData}
              columns={columns}
              pagination={false}
            />
          </div>
        ),
      },
    ]}
  />
  )
  };

export default Kho;
