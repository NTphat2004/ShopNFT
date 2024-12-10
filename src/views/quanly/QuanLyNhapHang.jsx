import { Tabs, Select, Table, Modal } from "antd";
import "../../styles/Quanlykho.css";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";

// const onChange = (key) => {
//   console.log(key);
// };

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const NhapHang = () => {
  const [khoData, setKhoData] = useState([]);
  const [activeKey, setActiveKey] = useState("1");
  const [sanPhamId, setSanPhamId] = useState("");
  const [selectedTenLoaiDanhMuc, setSelectedTenLoaiDanhMuc] = useState("");
  const [optionsDanhMuc, setOptionsDanhMuc] = useState([]);
  const [selectedTenThuongHieu, setSelectedTenThuongHieu] = useState("");
  const [optionsThuongHieu, setOptionsThuongHieu] = useState([]);
  const [optionsNhaCungCap, setOptionsNhaCungCap] = useState([]);
  const [selectedNhaCungCap, setSelectedNhaCungCap] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ghichu, setGhichu] = useState([]);
  const [selectedKho, setSelectedKho] = useState({
    san_phamId: "",
    ten_san_pham: "",
    ngay_tao: "",
    so_luong: parseInt(0),
    chieu_cao: parseFloat(0),
    chieu_dai: parseFloat(0),
    chieu_rong: parseFloat(0),
    gia_goc: parseFloat(0),
    tien_nhap_hang: parseFloat(0),
    mo_ta: "",
  });
  const [listNhatKy, setListNhatKy] = useState([]);
  let khoNewData = {};
  const KhoInput = () => {
    console.log("selectedTenLoaiDanhMuc nè:", selectedTenLoaiDanhMuc);
    console.log("selectedTenThuongHieu nè:", selectedTenThuongHieu);
    console.log("selectedNhaCungCap nè:", selectedNhaCungCap);
    khoNewData = {
      san_phamId: document.getElementById("san_phamId").value,
      ten_san_pham: document.getElementById("ten_san_pham").value,
      chieu_cao: parseFloat(document.getElementById("chieu_cao").value),
      chieu_dai: parseFloat(document.getElementById("chieu_dai").value),
      chieu_rong: parseFloat(document.getElementById("chieu_rong").value),
      khoi_luong: parseFloat(document.getElementById("khoi_luong").value),
      gia_goc: parseFloat(document.getElementById("gia_goc").value),
      so_luong: parseInt(document.getElementById("so_luong").value) || 0,
      ngay_tao: getCurrentDate(),
      tien_nhap_hang: parseFloat(
        document.getElementById("tien_nhap_hang").value
      ),
      mo_ta: document.getElementById("mo_ta").value,
      ten_loaiDM: selectedTenLoaiDanhMuc,
      ten_thuong_hieu: selectedTenThuongHieu,
      ten_nha_cung_cap: selectedNhaCungCap,
    };
    console.log("Dữ liệu gửi lên backend:", khoNewData);
    return khoNewData;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedKho((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const listNhatKyNe = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/sanPham/nhatKy"
      );
      setListNhatKy(response.data);
      console.log("List Nhật ký đây: ", response.data);
    } catch (error) {}
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

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const fetchKhoData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/listSanPham");
      setKhoData(response.data);
      console.log("Sản phẩm nè: ", response.data);
    } catch {}
  };

  useEffect(() => {
    console.log("Kho data real nè: ", khoData);
  }, [khoData]);

  useEffect(() => {
    fetchKhoData();
    fetchNewProductId();
    listNhaCungCap();
    listTenLoaiDanhMuc();
    listTenThuongHieu();
    listNhatKyNe();
  }, []);

  const handleEditSanPham = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/sanPham/edit/${id.san_phamId}`
      );
      const sanPhamData = response.data[0];

      // Gọi hàm lấy danh sách nhà cung cấp trước
      const nhaCungCapResponse = await axios.get(
        `http://localhost:8080/api/nhacungcap/list/theoTenSanPham?ten_san_pham=${sanPhamData.ten_san_pham}`
      );

      // Tạo options cho nhà cung cấp
      const optionsNCC = nhaCungCapResponse.data.map((item) => ({
        value: item.ten_nha_cung_cap,
        label: item.ten_nha_cung_cap,
      }));

      // Cập nhật state
      setOptionsNhaCungCap(optionsNCC);
      setActiveKey("1");
      setSelectedKho({
        ...selectedKho,
        ten_san_pham: sanPhamData?.ten_san_pham || "",
      });

      // Tìm và set các giá trị đã chọn
      const matchedNhaCungCap = optionsNCC.find(
        (option) => option.value === sanPhamData.ten_nha_cung_cap
      );
      if (matchedNhaCungCap) {
        setSelectedNhaCungCap(matchedNhaCungCap);
      }

      const matchedDanhMuc = optionsDanhMuc.find(
        (option) => option.value === sanPhamData.ten_loaiDM
      );
      setSelectedTenLoaiDanhMuc(matchedDanhMuc);

      const matchedThuongHieu = optionsThuongHieu.find(
        (option) => option.value === sanPhamData.ten_thuong_hieu
      );
      setSelectedTenThuongHieu(matchedThuongHieu);

      setSelectedKho(sanPhamData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    }
  };

  const listNhaCungCap = async (ten_san_pham) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/nhacungcap/list/theoTenSanPham?ten_san_pham=${ten_san_pham}`
      );
      console.log("Nhà cung cấp nè: ", response.data || "");
      const options = response.data.map((item) => ({
        value: item.ten_nha_cung_cap,
        label: item.ten_nha_cung_cap,
      }));
      setOptionsNhaCungCap(options);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
    }
  };

  const handleUpdateProduct = async () => {
    const accountID = JSON.parse(localStorage.getItem("data")).accountID;

    try {
      const khoChung = KhoInput();
      khoChung.accountID = accountID;
      khoChung.ten_loaiDM = selectedTenLoaiDanhMuc.value;
      khoChung.ten_thuong_hieu = selectedTenThuongHieu.value;
      khoChung.ten_nha_cung_cap = selectedNhaCungCap;
      console.log("Dữ liệu cập nhật sản phẩm:", khoChung);

      const formData = new URLSearchParams();
      Object.keys(khoChung).forEach((key) => {
        formData.append(key, khoChung[key]);
      });
      const response = await axios.put(
        `http://localhost:8080/api/nhaphang/updateSanPham/${khoChung.san_phamId}`, // Thêm san_phamId vào URL
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("Sản phẩm đã được cập nhật:", response.data);

      // Cập nhật giao diện hoặc logic khác
      // setKhoData((prevKhoData) =>
      //   prevKhoData.map((item) =>
      //     item.id === san_phamId ? { ...item, ...response.data } : item
      //   )
      // );
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật sản phẩm:",
        error.response ? error.response.data : error
      );

      if (error.response) {
        console.error("Lỗi từ server:", error.response.status);
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server:", error.request);
      } else {
        console.error("Lỗi khi cấu hình yêu cầu:", error.message);
      }
    }
  };

  const handleAddProduct = async () => {
    const accountID = JSON.parse(localStorage.getItem("data")).accountID;

    try {
      const khoChung = KhoInput();
      khoChung.accountID = accountID;
      khoChung.ten_loaiDM = selectedTenLoaiDanhMuc;
      khoChung.ten_thuong_hieu = selectedTenThuongHieu;
      khoChung.ten_nha_cung_cap = selectedNhaCungCap;

      // Chuyển object sang dạng URL-encoded
      const formData = new URLSearchParams();
      Object.keys(khoChung).forEach((key) => {
        formData.append(key, khoChung[key]);
      });

      const response = await axios.post(
        "http://localhost:8080/api/nhaphang/addSanPham",
        formData, // Gửi formData thay vì object
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("Sản phẩm đã được thêm:", response.data);
      setKhoData((prevKhoData) => [...prevKhoData, response.data]);
      fetchNewProductId();
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error.response || error);
    }
  };

  const handleXemGhiChu = async (record) => {
    setIsModalOpen(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/nhaphang/ghichu/${record}`
      );
      setGhichu(response.data);
      console.log("Nội dung ghi chú: ", response.data);
    } catch {}
  };
  const updateTrangThaiXoaInput = async () => {
    try {
      const khoChung = KhoInput();
      const response = await axios.put(
        `http://localhost:8080/api/nhaphang/update/trangThaiXoa/${khoChung.san_phamId}`
      );
      fetchKhoData();
      console.log("Sản phẩm được cập nhật:", response.data);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error.response || error);
    }
  };

  const updateTrangThaiXoaTable = async (record) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/nhaphang/update/trangThaiXoa/${record}`
      );
      fetchKhoData();
      console.log("Sản phẩm được cập nhật:", response.data);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error.response || error);
    }
  };

  const reloadFromTable = async (record) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/nhaphang/update/reload/${record}`
      );
      console.log("Sản phẩm được cập nhật:", response.data);
      fetchKhoData();
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error.response || error);
    }
  };

  const listTenLoaiDanhMuc = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/danhmuc/tenloai"
      );
      console.log("Dữ liệu danh mục:", response.data);

      const options = response.data.map((item) => ({
        value: item.ten_loaiDM,
        label: item.ten_loaiDM,
      }));
      setOptionsDanhMuc(options);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại danh mục:", error);
    }
  };

  const listTenThuongHieu = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/thuonghieu/getTenThuongHieu"
      );
      console.log("Dữ liệu thương hiệu là:", response.data);
      const options = response.data.map((item) => ({
        value: item.ten_thuong_hieu,
        label: item.ten_thuong_hieu,
      }));
      setOptionsThuongHieu(options);
      return options;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại danh mục:", error);
      return [];
    }
  };

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
      title: "Tiền nhập hàng",
      dataIndex: "tien_nhap_hang",
      key: "tien_nhap_hang",
    },
    {
      title: "Hành động",
      dataIndex: "hanh_dong",
      key: "hanh_dong",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {record.phe_duyet !== "Đã phê duyệt" &&
            record.phe_duyet !== "Bị từ chối" && (
              <EditOutlined onClick={() => handleEditSanPham(record)} />
            )}
          {record.trang_thai_kho === "Bị từ chối" &&
            record.phe_duyet !== "Đã phê duyệt" && (
              <EyeOutlined onClick={() => handleXemGhiChu(record.san_phamId)} />
            )}
          {record.trang_thai_kho !== "Cần nhập hàng" &&
            record.phe_duyet !== "Đã phê duyệt" &&
            record.phe_duyet !== "Bị từ chối" && (
              <DeleteOutlined
                onClick={() => updateTrangThaiXoaTable(record.san_phamId)}
              />
            )}
        </div>
      ),
    },
  ];

  const columnsNhatKy = [
    {
      title: "Mã sản phẩm",
      dataIndex: "san_pham_id",
      key: "san_pham_id",
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

  const columnsThungRac = [
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
      title: "Tiền nhập hàng",
      dataIndex: "tien_nhap_hang",
      key: "tien_nhap_hang",
    },
    {
      title: "Hành động",
      dataIndex: "hanh_dong",
      key: "hanh_dong",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <ReloadOutlined onClick={() => reloadFromTable(record.san_phamId)} />
        </div>
      ),
    },
  ];
  const filterCanNhapHang = khoData.filter((item) => {
    return (
      item.trang_thai_kho === "Cần nhập hàng" &&
      item.trang_thai_xoa === null &&
      item.nhap_hang === "Cần nhập hàng"
    );
  });

  const filterHangMoiNhapAndChuaDuyet = khoData.filter((item) => {
    return (
      item.nhap_hang === "Mới nhập hàng" &&
      item.phe_duyet === "Chưa phê duyệt" &&
      item.trang_thai_xoa === null
    );
  });

  const filterMoiDuyetVaoKho = khoData.filter((item) => {
    return (
      item.trang_thai_kho === "Mới vào kho" &&
      item.phe_duyet === "Đã phê duyệt" &&
      item.trang_thai_xoa === null
    );
  });

  const filterLichSuXoa = khoData.filter((item) => {
    return item.trang_thai_xoa != null;
  });

  const filterBiTuChoi = khoData.filter((item) => {
    return item.phe_duyet === "Bị từ chối";
  });
  return (
    <>
      <Tabs
        className="mx-auto"
        style={{ width: "1170px", margin: "auto" }}
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
                      //onChange={handleChange}
                      onChange={(e) => {
                        handleChange(e);
                        listNhaCungCap(e.target.value); // Gọi API sau khi nhập tên sản phẩm
                      }}
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
                  <div className="form-group">
                    <label htmlFor="productQuantity">Mô tả</label>
                    <input
                      type="text"
                      id="mo_ta"
                      name="mo_ta"
                      className="form-control"
                      value={selectedKho.mo_ta || ""}
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
                    <label htmlFor="createDate">Tiền nhập hàng</label>
                    <input
                      type="number"
                      id="tien_nhap_hang"
                      name="tien_nhap_hang"
                      className="form-control"
                      value={selectedKho.tien_nhap_hang}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Chỗ này thay đổi giá bán ra thành mô tả */}
                  <div className="form-group">
                    <label htmlFor="createDate">Giá gốc</label>
                    <input
                      type="number"
                      id="gia_goc"
                      name="gia_goc"
                      className="form-control"
                      value={selectedKho.gia_goc}
                      onChange={handleChange}
                    />
                  </div>
                  {/* <div className="form-group">
                  <label htmlFor="productQuantity">Danh mục</label>
                  <Select
                    value={selectedTenLoaiDanhMuc.ten_loaiDM}
                    // value={optionsDanhMuc.find(
                    //   (option) =>
                    //     option.value === selectedTenLoaiDanhMuc.ten_loaiDM
                    // )}
                    options={optionsDanhMuc}
                    onChange={(option) => {
                      const newValue = option;
                      setSelectedTenLoaiDanhMuc({
                        ...selectedTenLoaiDanhMuc,
                        ten_loaiDM: newValue,
                      });
                      console.log("New value là: ", newValue);
                      console.log("Dữ liệu option: ", optionsDanhMuc);
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "100%",
                        borderRadius: "8px",
                        height: "40px",
                      }),
                    }}
                  />
                </div> */}
                  <div className="form-group">
                    <label htmlFor="productQuantity">Danh mục</label>
                    <Select
                      value={selectedTenLoaiDanhMuc}
                      options={optionsDanhMuc}
                      onChange={(option) => {
                        setSelectedTenLoaiDanhMuc(option);
                        console.log("New value danh mục là:", option);
                      }}
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
                  {/* <div className="form-group">
                  <label htmlFor="productQuantity">Thương hiệu</label>
                  <Select
                    value={selectedTenThuongHieu.ten_thuong_hieu}
                    options={optionsThuongHieu}
                    onChange={(option) => {
                      const newValue = option;
                      setSelectedTenThuongHieu({
                        ...selectedTenThuongHieu,
                        ten_thuong_hieu: newValue,
                      });
                      console.log("New value là: ", newValue);
                      console.log("Dữ liệu option: ", optionsThuongHieu);
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "100%",
                        borderRadius: "8px",
                        height: "40px",
                      }),
                    }}
                  />
                </div> */}
                  <div className="form-group">
                    <label htmlFor="productQuantity">Thương hiệu</label>
                    <Select
                      value={selectedTenThuongHieu}
                      options={optionsThuongHieu}
                      onChange={(option) => {
                        setSelectedTenThuongHieu(option);
                        console.log("Dữ liệu option: ", optionsThuongHieu);
                      }}
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
                  {/* <div className="form-group">
                  <label htmlFor="productQuantity">Nhà cung cấp</label>
                  <Select
                    value={selectedNhaCungCap.ten_nha_cung_cap}
                    options={optionsNhaCungCap}
                    onChange={(option) => {
                      const newValue = option;
                      setSelectedNhaCungCap({
                        ...selectedNhaCungCap,
                        ten_nha_cung_cap: newValue,
                      });
                      console.log("New value nhà cung cấp là: ", newValue);
                      console.log(
                        "Dữ liệu option nhà cung cấp là: ",
                        optionsNhaCungCap
                      );
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "100%",
                        borderRadius: "8px",
                        height: "40px",
                      }),
                    }}
                  />
                </div> */}
                  <div className="form-group">
                    <label htmlFor="nhaCungCap">Nhà cung cấp</label>
                    <Select
                      value={selectedNhaCungCap}
                      options={optionsNhaCungCap}
                      onChange={(option) => {
                        setSelectedNhaCungCap(option);
                        console.log("Chọn nhà cung cấp: ", option);
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
                    <button className="button" onClick={handleUpdateProduct}>
                      Cập nhật
                    </button>
                  </div>
                  <div className="form-group">
                    <button
                      className="button"
                      onClick={updateTrangThaiXoaInput}
                    >
                      Xóa
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
            label: `Hàng cần nhập`,
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
                  rowKey="san_phamId"
                  dataSource={filterCanNhapHang}
                  columns={columns}
                  pagination={true}
                />
              </div>
            ),
          },
          {
            label: `Hàng chưa duyệt`,
            key: "3",
            children: (
              <div className="tab-content">
                <h1>Nhật ký hoạt động</h1>
                <Table
                  rowKey="san_phamId"
                  dataSource={filterHangMoiNhapAndChuaDuyet}
                  columns={columns}
                  pagination={true}
                />
              </div>
            ),
          },
          {
            label: `Hàng bị từ chối`,
            key: "4",
            children: (
              <div className="tab-content">
                <h1>Nhật ký hoạt động</h1>
                <Table
                  rowKey="san_phamId"
                  dataSource={filterBiTuChoi}
                  columns={columns}
                  pagination={false}
                />
              </div>
            ),
          },
          {
            label: `Hàng đã duyệt`,
            key: "5",
            children: (
              <div className="tab-content">
                <h1>Nhật ký hoạt động</h1>
                <Table
                  rowKey="san_phamId"
                  dataSource={filterMoiDuyetVaoKho}
                  columns={columns}
                  pagination={true}
                />
              </div>
            ),
          },
          {
            label: `Lịch sử xóa`,
            key: "6",
            children: (
              <div className="tab-content">
                <h1>Lịch sử xóa</h1>
                <Table
                  rowKey="san_phamId"
                  dataSource={filterLichSuXoa}
                  columns={columnsThungRac}
                  pagination={true}
                />
              </div>
            ),
          },
          {
            label: `Nhật ký hoạt động`,
            key: "7",
            children: (
              <div className="tab-content">
                <h1>Nhật ký hoạt động</h1>
                <Table
                  rowKey="san_phamId"
                  dataSource={listNhatKy}
                  columns={columnsNhatKy}
                  pagination={false}
                />
              </div>
            ),
          },
        ]}
      />
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {ghichu.length > 0 ? (
          ghichu.map((item, index) => <p key={index}>{item.ghi_chu}</p>)
        ) : (
          <p>Không có ghi chú nào.</p>
        )}
      </Modal>
    </>
  );
};
export default NhapHang;
