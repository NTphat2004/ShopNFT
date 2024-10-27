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
    title: "Giá bán ra",
    dataIndex: "gia_goc",
    key: "gia_goc",
  },
  {
    title: "Giá khuyến mãi",
    dataIndex: "gia_km",
    key: "gia_km",
  },
  {
    title: "Mô tả",
    dataIndex: "mo_ta",
    key: "mo_ta",
  },
  {
    title: "Lượt mua",
    dataIndex: "luot_mua",
    key: "luot_mua",
  },
  {
    title: "Phần trăm giảm giá",
    dataIndex: "phantram_GG",
    key: "phantram_GG",
  },
  {
    title: "Hạn giảm giá",
    dataIndex: "han_gg",
    key: "han_gg",
  },
  {
    title: "Hoạt động",
    dataIndex: "hoat_dong",
    key: "hoat_dong",
  },
  {
    title: "Hành động",
    dataIndex: "hang_dong",
    key: "hanh_dong",
    render: (text, record) => (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <EditOutlined />
        <DeleteOutlined />
      </div>
    ),
  },
];

const Sanpham = () => {
  const [sanphamData, setSanphamData] = useState([]);

  useEffect(() => {
    const fetchsanphamData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/listSanPham");
        const data = await response.json();
        console.log("Dữ liệu là: ", data);
        const formattedData = data.map((item) => ({
          key: item.san_phamId,
          san_phamId: item.san_phamId,
          ten_san_pham: item.ten_san_pham,
          gia_goc: item.gia_goc,
          gia_km: item.gia_km,
          mo_ta: item.mo_ta,
          luot_mua: item.luot_mua,
          phantram_GG: item.phantram_GG,
          han_gg: item.han_gg,
          hoat_dong: item.hoat_dong ? "Hoạt động" : "Ngừng hoạt động",
        }));
        setSanphamData(formattedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu voucher:", error);
      }
    };
    fetchsanphamData();
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
                  <label htmlFor="productCode">Mã sản phẩm</label>
                  <input
                    type="text"
                    id="san_phamId"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productName">Tên sản phẩm</label>
                  <input
                    type="text"
                    id="ten_san_pham"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="createDate">Giá bán ra</label>
                  <input
                    type="number"
                    id="gia_goc"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="input-container">
                <div className="form-group">
                  <label htmlFor="productQuantity">Giá khuyến mãi</label>
                  <input
                    type="number"
                    id="gia_km"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productQuantity">Mô tả</label>
                  <input
                    type="number"
                    id="mo_ta"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productQuantity">Phần trăm giảm giá</label>
                  <input
                    type="number"
                    id="phantram_GG"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="input-container">
              <div className="form-group">
                  <label htmlFor="productQuantity">Hạn giảm giá</label>
                  <input
                    type="number"
                    id="han_gg"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="warehouseStatus">Hoạt động</label>
                  <Select
                    defaultValue="active"
                    style={{ width: "100%", borderRadius: "8px", height: "40px" }}
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
          label: `Danh sách sản phẩm`,
          key: "2",
          children: (
            <div className="tab-content">
              <h1>Danh sách sản phẩm</h1>
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
                dataSource={sanphamData}
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

export default Sanpham;
