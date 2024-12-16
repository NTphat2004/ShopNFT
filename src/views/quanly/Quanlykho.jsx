import { Tabs, Select, Table, Button } from "antd"; // Thêm Table từ antd
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

const Kho = () => {
  const [khoData, setKhoData] = useState([]);
  const [sanPhamId, setSanPhamId] = useState("");
  const [selectedKho, setSelectedKho] = useState({
    san_phamId: "",
    ten_san_pham: "",
    ngay_tao: "",
    so_luong: parseInt(0),
    khoi_luong: "",
  });
  const [listTonDong, setListTonDong] = useState([]);
  const [listSapHetHang, setListSapHetHang] = useState([]);
  const [listSapHetHan, setListSapHetHan] = useState([]);
  const [listSanPhamNhap, setListSanPhamNhap] = useState([]);
  const [listSanPhamXuat, setlistSanPhamXuat] = useState([]);
  const [listSanPhamHetHang, setlistSanPhamHetHang] = useState([]);
  const [listSanPhamQuaHan, setlistSanPhamQuaHan] = useState([]);
  const [listNhatKy, setListNhatKy] = useState([]);
  const [activeKey, setActiveKey] = useState("1");
  const chiTietSanPham = async (record) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/edit/QLK/sanpham/${record}`
      );
      setSelectedKho(response.data[0]);
      setActiveKey("1");
    } catch {}
  };

  const danhSachNhatKy = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/sanPham/QLKho/nhatKy"
      );
      setListNhatKy(response.data);
      console.log("Danh sách nhật ký nè: ", response.data);
    } catch {}
  };
  const danhSachTonDong = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/listSanPham/tonDong"
      );
      setListTonDong(response.data);
    } catch {}
  };

  const danhSachSapHetHang = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/listSanPham/sapHetHang"
      );
      console.log("Danh sách sắp hết hàng: ", response.data);
      setListSapHetHang(response.data);
    } catch {}
  };
  const danhSachSapHetHan = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/listSanPham/sapHetHan"
      );
      setListSapHetHan(response.data);
    } catch {}
  };

  const danhSanPhamNhap = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/listSanPham/nhapHang"
      );
      setListSanPhamNhap(response.data);
    } catch {}
  };

  const danhSanPhamXuat = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/listSanPham/xuatHang"
      );
      setlistSanPhamXuat(response.data);
    } catch {}
  };

  const danhSanPhamHetHang = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/listSanPham/hetHang"
      );
      setlistSanPhamHetHang(response.data);
    } catch {}
  };

  const danhSanPhamQuaHan = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/listSanPham/quaHan"
      );
      setlistSanPhamQuaHan(response.data);
    } catch {}
  };

  let khoNewData = {};
  const KhoInput = () => {
    console.log("selectedSanPhamId nè:", selectedKho.san_phamId);
    console.log("Tên nè:", selectedKho.ten_san_pham);
    console.log("Chiều cao nè:", selectedKho.chieu_cao);
    console.log("Chiều dài nè:", selectedKho.chieu_dai);
    console.log("Chiều rộng nè:", selectedKho.chieu_rong);
    console.log("Khối lượng nè:", selectedKho.khoi_luong);
    console.log("Giá góc nè:", selectedKho.gia_goc);
    console.log(
      "AccountID nè: ",
      JSON.parse(localStorage.getItem("data")).accountID
    );
    khoNewData = {
      san_phamId: selectedKho.san_phamId,
      ten_san_pham: selectedKho.ten_san_pham,
      chieu_cao: selectedKho.chieu_cao,
      chieu_dai: selectedKho.chieu_dai,
      chieu_rong: selectedKho.chieu_rong,
      khoi_luong: selectedKho.khoi_luong,
      gia_goc: selectedKho.gia_goc,
      accountID: JSON.parse(localStorage.getItem("data")).accountID,
    };
    console.log("Kho chung nè: ", khoNewData);
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
        phe_duyet: item.phe_duyet,
        trang_thai_xoa: item.trang_thai_xoa,
        nhap_hang: item.nhap_hang,
        tien_nhap_hang: item.tien_nhap_hang,
        chieu_cao: item.chieu_cao,
        chieu_dai: item.chieu_dai,
        chieu_rong: item.chieu_rong,
        khoi_luong: item.khoi_luong,
        han_su_dung: item.han_su_dung,
      }));
      setKhoData(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu voucher:", error);
    }
  };

  useEffect(() => {
    fetchKhoData();
    fetchNewProductId();
    danhSachTonDong();
    danhSachSapHetHang();
    danhSachSapHetHan();
    danhSanPhamNhap();
    danhSanPhamXuat();
    danhSanPhamHetHang();
    danhSanPhamQuaHan();
    danhSachNhatKy();
  }, []);

  const updateCanNhapHang = async (record) => {
    const accountID = JSON.parse(localStorage.getItem("data"));
    const accountIDNe = accountID.accountID;

    // Hiển thị alert xác nhận
    const confirmUpdate = window.confirm(
      "Bạn có chắc chắn muốn cập nhật trạng thái nhập hàng không?"
    );
    if (!confirmUpdate) {
      // Nếu người dùng nhấn Cancel, thoát khỏi hàm
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/update/QLKho/canNhapHang/${record}`,
        null, // Không có body request
        {
          params: {
            accountID: accountIDNe, // Truyền accountID qua query parameter
          },
        }
      );

      // Thông báo thành công
      alert("Cập nhật trạng thái nhập hàng thành công!");
      fetchKhoData();
      danhSachTonDong();
      danhSachSapHetHang();
      danhSachSapHetHan();
      danhSanPhamNhap();
      danhSanPhamXuat();
      danhSanPhamHetHang();
      danhSanPhamQuaHan();
      console.log("Cập nhật thành công:", response.data);
    } catch (error) {
      // Thông báo lỗi
      alert("Đã xảy ra lỗi khi cập nhật trạng thái nhập hàng.");
      console.error(
        "Lỗi khi cập nhật trạng thái sản phẩm:",
        error.response || error
      );
    }
  };

  const updateCanNhapHangQuaHan = async (record) => {
    const accountID = JSON.parse(localStorage.getItem("data"));
    const accountIDNe = accountID.accountID;

    // Hiển thị alert xác nhận
    const confirmUpdate = window.confirm(
      "Bạn có chắc chắn muốn cập nhật trạng thái nhập hàng không?"
    );
    if (!confirmUpdate) {
      // Nếu người dùng nhấn Cancel, thoát khỏi hàm
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/sanPham/QLKho/update/quaHan/${record}`,
        null, // Không có body request
        {
          params: {
            accountID: accountIDNe,
          },
        }
      );

      // Thông báo thành công
      alert("Cập nhật trạng thái nhập hàng thành công!");
      fetchKhoData();
      danhSachTonDong();
      danhSachSapHetHang();
      danhSachSapHetHan();
      danhSanPhamNhap();
      danhSanPhamXuat();
      danhSanPhamHetHang();
      danhSanPhamQuaHan();
      console.log("Cập nhật thành công:", response.data);
    } catch (error) {
      // Thông báo lỗi
      alert("Đã xảy ra lỗi khi cập nhật trạng thái nhập hàng.");
      console.error(
        "Lỗi khi cập nhật trạng thái sản phẩm:",
        error.response || error
      );
    }
  };

  const capNhatSanPham = async () => {
    const khoChung = KhoInput();
    try {
      const response = await axios.put(
        `http://localhost:8080/api/update/QLKho/sanPham/${khoChung.san_phamId}`,
        khoChung, // Dữ liệu được gửi đi
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Đúng định dạng
          },
        }
      );
      fetchKhoData();
      danhSachTonDong();
      danhSachSapHetHang();
      danhSachSapHetHan();
      danhSanPhamNhap();
      danhSanPhamXuat();
      danhSanPhamHetHang();
      danhSanPhamQuaHan();
      alert("Cập nhật sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
  };

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
      title: "Hạn sử dụng",
      dataIndex: "han_su_dung",
      key: "han_su_dung",
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
          <EditOutlined onClick={() => chiTietSanPham(record.san_phamId)} />
          <DeleteOutlined />
          {(record.trang_thai_kho === "Hết hàng" ||
            record.trang_thai_kho === "Sắp hết hàng") &&
            record.nhap_hang !== "Cần nhập hàng" && (
              <Button onClick={() => updateCanNhapHang(record.san_phamId)}>
                Nhập hàng
              </Button>
            )}
          {record.trang_thai_kho === "Quá hạn" && (
            <Button onClick={() => updateCanNhapHangQuaHan(record.san_phamId)}>
              Nhập lại hàng
            </Button>
          )}
        </div>
      ),
    },
  ];

  const columnsNhapXuat = [
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
      title: "Trạng thái nhập",
      dataIndex: "trang_thai_nhap",
      key: "trang_thai_nhap",
    },
    {
      title: "Trạng thái xuất",
      dataIndex: "trang_thai_xuat",
      key: "trang_thai_xuat",
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong",
      key: "so_luong",
    },
    {
      title: "Tiền nhập hàng",
      dataIndex: "tien_nhap_hang",
      key: "tien_nhap_hang",
    },
    {
      title: "Giá bán ra",
      dataIndex: "gia_goc",
      key: "gia_goc",
    },
    {
      title: "Ngày nhập xuất",
      dataIndex: "ngay_nhap_xuat",
      key: "ngay_nhap_xuat",
    },
  ];

  const columnsNhatKy = [
    {
      title: "Mã sản phẩm",
      dataIndex: "san_phamId",
      key: "san_phamId",
    },
    {
      title: "Hành động",
      dataIndex: "ten_hanh_dong",
      key: "ten_hanh_dong",
    },
    {
      title: "Ngày thực hiện",
      dataIndex: "ngay_hanh_dong",
      key: "ngay_hanh_dong",
    },
    {
      title: "Người thực hiện",
      dataIndex: "accountID",
      key: "accountID",
    },
  ];
  const filterHangTrongKho = khoData.filter((item) => {
    return (
      item.phe_duyet === "Đã phê duyệt" &&
      item.trang_thai_xoa === null &&
      item.trang_thai_kho === "Đã vào kho" &&
      item.nhap_hang === "Đã nhập hàng"
    );
  });

  const filterLichSuXoa = khoData.filter((item) => {
    return (
      item.phe_duyet === "Đã phê duyệt" &&
      item.trang_thai_xoa !== null &&
      item.trang_thai_kho === "Đã vào kho" &&
      item.nhap_hang === "Đã nhập hàng"
    );
  });

  return (
    <Tabs
      className="mx-auto"
      style={{ width: "1200px", margin: "auto" }}
      //onChange={onChange}
      activeKey={activeKey}
      onChange={(key) => setActiveKey(key)}
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
                {/* <div className="form-group">
                  <label htmlFor="createDate">Ngày tạo</label>
                  <input
                    type="date"
                    id="ngay_tao"
                    name="ngay_tao"
                    className="form-control"
                    value={selectedKho.ngay_tao || getCurrentDate()}
                    onChange={handleChange}
                  />
                </div> */}
                {/* <div className="form-group">
                  <label htmlFor="productQuantity">Số lượng</label>
                  <input
                    type="number"
                    id="so_luong"
                    name="so_luong"
                    className="form-control"
                    value={selectedKho.so_luong}
                    onChange={handleChange}
                  />
                </div> */}
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
              </div>

              <div className="input-container">
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
                    name="khoi_luong"
                    className="form-control"
                    value={selectedKho.khoi_luong}
                    onChange={handleChange}
                  />
                </div>
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
              </div>

              <div className="input-container"></div>

              <div className="input-container">
                {/* <div className="form-group">
                  <button
                    className="button"
                    id="themvoucher"
                    onClick={handleAddProduct}
                  >
                    Thêm
                  </button>
                </div> */}
                <div className="form-group">
                  <button className="button" onClick={capNhatSanPham}>
                    Cập nhật
                  </button>
                </div>
                <div className="form-group">
                  <button className="button">Làm mới</button>
                </div>
              </div>
            </div>
          ),
        },
        {
          label: `Hàng trong kho`,
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
                dataSource={filterHangTrongKho}
                columns={columns}
                pagination={true}
              />
            </div>
          ),
        },
        {
          label: `Hàng xuất kho`,
          key: "3",
          children: (
            <div className="tab-content">
              <h1>Hàng xuất kho</h1>
              <Table
                dataSource={listSanPhamXuat}
                columns={columnsNhapXuat}
                pagination={true}
              />
            </div>
          ),
        },
        {
          label: `Hàng nhập kho`,
          key: "4",
          children: (
            <div className="tab-content">
              <h1>Hàng nhập kho</h1>
              <Table
                dataSource={listSanPhamNhap}
                columns={columnsNhapXuat}
                pagination={true}
              />
            </div>
          ),
        },
        {
          label: `Hàng tồn đọng`,
          key: "5",
          children: (
            <div className="tab-content">
              <h1>Hàng nhập kho</h1>
              <Table
                dataSource={listTonDong}
                columns={columns}
                pagination={true}
              />
            </div>
          ),
        },
        {
          label: `Sắp hết hàng`,
          key: "6",
          children: (
            <div className="tab-content">
              <h1>Sắp hết hàng</h1>
              <Table
                dataSource={listSapHetHang}
                columns={columns}
                pagination={true}
              />
            </div>
          ),
        },
        {
          label: `Sắp hết hạn`,
          key: "7",
          children: (
            <div className="tab-content">
              <h1>Sắp hết hạn</h1>
              <Table
                dataSource={listSapHetHan}
                columns={columns}
                pagination={true}
              />
            </div>
          ),
        },
        {
          label: `Hết hàng`,
          key: "8",
          children: (
            <div className="tab-content">
              <h1>Sản phẩm đã hết </h1>
              <Table
                dataSource={listSanPhamHetHang}
                columns={columns}
                pagination={true}
              />
            </div>
          ),
        },
        {
          label: `Quá hạn`,
          key: "9",
          children: (
            <div className="tab-content">
              <h1>Sản phẩm đã hết </h1>
              <Table
                dataSource={listSanPhamQuaHan}
                columns={columns}
                pagination={true}
              />
            </div>
          ),
        },
        {
          label: `Lịch sử xóa`,
          key: "10",
          children: (
            <div className="tab-content">
              <h1>Lịch sử đã xóa</h1>
              <Table
                dataSource={filterLichSuXoa}
                columns={columns}
                pagination={true}
              />
            </div>
          ),
        },
        {
          label: `Nhật ký hoạt động`,
          key: "11",
          children: (
            <div className="tab-content">
              <h1>Nhật ký hoạt động</h1>
              <Table
                dataSource={listNhatKy}
                columns={columnsNhatKy}
                pagination={true}
              />
            </div>
          ),
        },
      ]}
    />
  );
};
export default Kho;
