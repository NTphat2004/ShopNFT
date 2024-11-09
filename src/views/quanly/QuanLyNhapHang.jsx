import { Tabs, Select, Table } from "antd"; // Thêm Table từ antd
import "../../styles/Quanlykho.css";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";

const onChange = (key) => {
  console.log(key);
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

const NhapHang = () => {
  const [khoData, setKhoData] = useState([]);
  const [sanPhamId, setSanPhamId] = useState("");
  const [selectedKho, setSelectedKho] = useState({
    san_phamId: "",
    ten_san_pham: "",
    ngay_tao: "",
    so_luong: parseInt(0),
  });

  let khoNewData = {};
  const KhoInput = () => {
    khoNewData = {
      san_phamId: sanPhamId,
      ten_san_pham: document.getElementById("ten_san_pham").value,
      chieu_cao: document.getElementById("chieu_cao").value,
      chieu_dai: document.getElementById("chieu_dai").value,
      chieu_rong: document.getElementById("chieu_rong").value,
      khoi_luong: document.getElementById("khoi_luong").value,
      gia_goc: document.getElementById("gia_goc").value,
      so_luong: parseInt(document.getElementById("so_luong").value) || 0,
      ngay_tao: getCurrentDate(),
    };
    return khoNewData;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedKho((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const fetchNewProductId = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/kho/newProductId"
      );
      setSanPhamId(response.data); // Cập nhật mã sản phẩm mới
      setSelectedKho((prev) => ({ ...prev, san_phamId: response.data }));
      console.log("New id", response.data);
    } catch (error) {
      console.error("Lỗi khi lấy mã sản phẩm mới:", error);
    }
  };
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
    fetchNewProductId();
  }, []);

  const handleAddProduct = async () => {
    try {
      const khoChung = KhoInput();
      console.log("Kho chung:", khoChung);
      const response = await axios.post(
        "http://localhost:8080/api/nhaphang/addSanPham",
        khoChung,
        {
          headers: {
            "Content-Type": "application/json", // Đảm bảo thiết lập đúng Content-Type
          },
        }
      );
      console.log("Sản phẩm đã được thêm:", response.data);
      setKhoData((prevKhoData) => [...prevKhoData, response.data]);
      fetchNewProductId(); // Lấy mã sản phẩm mới
    } catch (error) {
      console.error(
        "Lỗi khi thêm sản phẩm:",
        error.response ? error.response.data : error
      );
    }
  };

  return (
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
                  <input
                    type="text"
                    id="san_phamId"
                    name="san_phamId"
                    className="form-control"
                    value={selectedKho.san_phamId}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productName">Tên sản phẩm</label>
                  <input
                    type="text"
                    id="ten_san_pham"
                    name="ten_san_pham"
                    className="form-control"
                    value={selectedKho.ten_san_pham}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="createDate">Ngày tạo</label>
                  <input
                    type="date"
                    id="ngay_tao"
                    name="ngay_tao"
                    className="form-control"
                    value={selectedKho.ngay_tao || getCurrentDate()}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productQuantity">Số lượng</label>
                  <input
                    type="number"
                    id="so_luong"
                    name="so_luong"
                    className="form-control"
                    value={selectedKho.so_luong}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-container">
                <div className="form-group">
                  <label htmlFor="createDate">Chiều cao</label>
                  <input
                    type="number"
                    id="chieu_cao"
                    name="chieu_cao"
                    className="form-control"
                    value={selectedKho.chieu_cao}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productQuantity">Chiều dài</label>
                  <input
                    type="number"
                    id="chieu_dai"
                    name="chieu_dai"
                    className="form-control"
                    value={selectedKho.chieu_dai}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productQuantity">Chiều rộng</label>
                  <input
                    type="number"
                    id="chieu_rong"
                    name="chieu_rong"
                    className="form-control"
                    value={selectedKho.chieu_rong}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productQuantity">Khối lượng</label>
                  <input
                    type="number"
                    id="khoi_luong"
                    name="Khoi_luong"
                    className="form-control"
                    value={selectedKho.khoi_luong}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-container">
                <div className="form-group">
                  <label htmlFor="createDate">Giá bán ra</label>
                  <input
                    type="number"
                    id="gia_goc"
                    name="gia_goc"
                    className="form-control"
                    value={selectedKho.gia_goc}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productQuantity">Danh mục</label>
                  <Select
                    options={[
                      { value: "Hoạt động", label: "Hoạt động" },
                      { value: "Ngừng hoạt động", label: "Ngừng hoạt động" },
                    ]}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "100%",
                        borderRadius: "8px",
                        height: "40px",
                      }),
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productQuantity">Thương hiệu</label>
                  <Select
                    options={[
                      { value: "Hoạt động", label: "Hoạt động" },
                      { value: "Ngừng hoạt động", label: "Ngừng hoạt động" },
                    ]}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "100%",
                        borderRadius: "8px",
                        height: "40px",
                      }),
                    }}
                  />
                </div>
              </div>

              <div className="input-container">
                <div className="form-group">
                  <button
                    className="button"
                    id="themvoucher"
                    onClick={handleAddProduct}
                  >
                    Thêm
                  </button>
                </div>
                <div className="form-group">
                  <button className="button">Cập nhật</button>
                </div>
                <div className="form-group">
                  <button className="button">Xóa</button>
                </div>
                <div className="form-group">
                  <button className="button">Làm mới</button>
                </div>
              </div>
            </div>
          ),
        },
        {
          label: `Hàng mới nhập`,
          key: "2",
          children: (
            <div className="tab-content">
              <h1>Danh sách nhập hàng</h1>
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
                dataSource={khoData}
                columns={columns}
                pagination={false}
              />
            </div>
          ),
        },
        {
          label: `Nhật ký hoạt động`,
          key: "3",
          children: (
            <div className="tab-content">
              <h1>Nhật ký hoạt động</h1>
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
  );
};
export default NhapHang;
