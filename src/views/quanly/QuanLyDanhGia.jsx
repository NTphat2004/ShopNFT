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

const DanhGia = () => {
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
        "http://localhost:8080/api/kho/addSanPham",
        khoChung,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Đảm bảo thiết lập đúng Content-Type
          },
        }
      );
      console.log("Sản phẩm đã được thêm:", response.data);
      setKhoData((prevKhoData) => [...prevKhoData, response.data]);
      fetchNewProductId(); // Lấy mã sản phẩm mới
      setSelectedKho({
        san_phamId: "",
        ten_san_pham: "",
        ngay_tao: getCurrentDate(),
        so_luong: 0,
      }); // Reset form
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
          label: `Đánh giá chưa phản hồi`,
          key: "1",
          children: (
            <div className="tab-content">
              <h1>Danh sách đánh giá</h1>
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
          label: `Đánh giá đã phản hồi`,
          key: "2",
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
export default DanhGia;
