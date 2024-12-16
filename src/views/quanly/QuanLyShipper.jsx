import { Tabs, Select, Table, Upload, Image, Button } from "antd"; // Thêm Table từ antd
import "../../styles/QuanLyVoucher.css";
import {
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { data, get } from "jquery";
import * as XLSX from "xlsx";
import axios from "axios";
//import "../../assets/images"

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const QuanLyShipper = () => {
  const [voucherData, setVoucherData] = useState([]);
  const [selectedShipper, setSelectedShipper] = useState({
    shipperID: "",
    hoat_dong: "On",
    password: "",
    hovaten: "",
  });
  const [activeKey, setActiveKey] = useState("1");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);
  const [listShipper, setListShipper] = useState([]);
  const [listShipperDaGiao, setListShipperDaGiao] = useState([]);

  // Kiểm tra quyền admin
  const isAdmin = userData && userData.roles.includes("Admin");
  // Hàm lấy ngày hiện tại theo định dạng YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const sendEmail = async (email, subject, text) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/send", // Đảm bảo đường dẫn là chính xác
        null,
        {
          params: {
            to: email,
            subject: subject,
            text: text, // Nội dung HTML sẽ được truyền ở đây
          },
        }
      );
      console.log("Email gửi thành công:", response.data);
    } catch (error) {
      console.error("Lỗi khi gửi email:", error);
    }
  };

  const handleChange = (value) => {
    console.log("Selected option:", value); // Log để kiểm tra
    setSelectedShipper((prev) => ({
      ...prev,
      hoat_dong: value, // Cập nhật trạng thái hoat_dong
    }));
  };

  const danhSachShipperDaGiao = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/shipper/listShipper/daGiao"
      );
      console.log("Dữ liệu đã giao: ", response.data);
      setListShipperDaGiao(response.data);
    } catch {}
  };
  const fetchVoucherData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/shipper/listShipper"
      );
      console.log("List shipper nè: ", response.data);
      setListShipper(response.data);
    } catch {}
  };

  useEffect(() => {
    fetchVoucherData();
    const data = JSON.parse(localStorage.getItem("data"));
    setUserData(data);

    // Nếu người dùng không phải admin, tự động chuyển sang tab 1
    if (data && !data.roles.includes("Admin")) {
      setActiveKey("1");
    }
    danhSachShipperDaGiao();
  }, []);

  let voucher = {};
  const voucherChung = () => {
    console.log("ShipperID nè: ", selectedShipper.shipperID);
    console.log("Hoạt động nè: ", selectedShipper.hoat_dong);
    console.log("Họ và tên nè: ", selectedShipper.hovaten);
    console.log("Password nè: ", selectedShipper.password);
    voucher = {
      shipperID: selectedShipper.shipperID,
      hoat_dong: selectedShipper.hoat_dong,
      hovaten: selectedShipper.hovaten,
      password: selectedShipper.password,
      accountID: JSON.parse(localStorage.getItem("data")).accountID,
    };
    return voucher;
  };

  const chiTietShipper = async (shipperID) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/shipper/chiTiet/${shipperID}`
      );
      console.log("Chi tiết shipper: ", response.data);
      setSelectedShipper(response.data[0]);
      setActiveKey("1");
    } catch {}
  };
  const handleSaveShipper = async () => {
    const shipperChung = voucherChung();
    console.log("Khi nhấn lưu nè: ", shipperChung);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/shipper/addShipper",
        shipperChung,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      alert("Thêm shipper thành công.");
      sendEmail(
        shipperChung.shipperID,
        "Cung cấp tài khoản",
        "Tài khoản: " +
          shipperChung.shipperID +
          " Mật khẩu: " +
          shipperChung.password
      );
      console.log("Lưu thành công: ", response.data);
    } catch {}
  };

  const updateKhoiPhucShipper = async (record) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/shipper/update/khoiphuc/${record}`
      );
      console.log("Dữ liệu xóa nè: ", response.data);
      alert("Khôi phục shipper thành cong");
    } catch {}
  };

  const updateShipperXoaTable = async (record) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/shipper/update/trangThaiXoa/${record}`
      );
      console.log("Dữ liệu xóa nè: ", response.data);
      alert("Xóa shipper thành cong");
    } catch {}
  };

  const updateShipperXoaInput = async () => {
    const shipperChung = voucherChung();
    try {
      const response = await axios.put(
        `http://localhost:8080/api/shipper/update/trangThaiXoa/${shipperChung.shipperID}`
      );
      console.log("Dữ liệu xóa nè: ", response.data);
      alert("Xóa shipper thành cong");
    } catch {}
  };
  const handleUpdate = async () => {
    voucherChung();

    const formData = new FormData();
    for (const key in voucher) {
      formData.append(key, voucher[key]);
    }

    formData.append("hanh_dong", "Cập nhật");
    // Nếu có hình ảnh mới, thêm vào formData
    fileList.forEach((file) => {
      formData.append("hinh_anh", file.originFileObj);
    });

    try {
      const response = await fetch(
        `http://localhost:8080/api/voucher/update/${voucher.voucherID}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Voucher đã được cập nhật thành công:", data);
        alert("Cập nhật voucher thành công!");
        fetchVoucherData(); // Tải lại dữ liệu
        clear();
      } else {
        const errorData = await response.json();
        console.error(
          "Lỗi khi cập nhật voucher:",
          response.statusText,
          errorData
        );
        alert("Cập nhật voucher thất bại!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const clear = () => {
    document.getElementById("ma_voucher").value = "";
    document.getElementById("dieu_kien").value = "";
    document.getElementById("don_hang_toi_thieu").value = "";
    document.getElementById("ngay_tao").value = getCurrentDate();
    document.getElementById("han_su_dung").value = "";
    document.getElementById("so_luong").value = "";
    //document.getElementById("so_luot_SD").value = "";
    document.getElementById("so_tien_giam").value = "";

    setSelectedShipper(null);
    setIsAddDisabled(false);
    setFileList([]);
    setSelectedShipper({
      hoat_dong: "on",
      ngay_tao: getCurrentDate(), // Giá trị mặc định
    });
  };
  const handelClear = () => {
    clear();
  };

  // Cấu hình cột cho bảng
  let columnsDaGiao = [
    {
      title: "Shipper ID",
      dataIndex: "shipperID",
      key: "voucherID",
    },
    {
      title: "Họ và tên",
      dataIndex: "hovaten",
      key: "hovaten",
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinh_anh",
      key: "hinh_anh",
      render: (text) =>
        text ? (
          <img
            src={`http://localhost:8080/images/${text}`}
            alt="Voucher"
            style={{ width: 50, height: 50 }}
          />
        ) : (
          <UserOutlined style={{ fontSize: 50, color: "#ccc" }} />
        ),
    },
    {
      title: "Ngày",
      dataIndex: "thoi_gianxn",
      key: "thoi_gianxn",
    },
    {
      title: "Hoạt động",
      dataIndex: "hoat_dong",
      key: "hoat_dong",
    },
    {
      title: "Vai trò",
      dataIndex: "vai_tro",
      key: "vai_tro",
    },
    {
      title: "Đơn hàng đã giao",
      dataIndex: "don_hangID",
      key: "don_hangID",
    },
  ];
  if (isAdmin) {
    columnsDaGiao = columnsDaGiao.filter((col) => col.key !== "hanhdong"); // Lọc cột "hanhdong" nếu là admin
  }

  let columns = [
    {
      title: "Shipper ID",
      dataIndex: "shipperID",
      key: "voucherID",
    },
    {
      title: "Họ và tên",
      dataIndex: "hovaten",
      key: "hovaten",
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinh_anh",
      key: "hinh_anh",
      render: (text) =>
        text ? (
          <img
            src={`http://localhost:8080/images/${text}`}
            alt="Voucher"
            style={{ width: 50, height: 50 }}
          />
        ) : (
          <UserOutlined style={{ fontSize: 50, color: "#ccc" }} />
        ),
    },
    {
      title: "Hoạt động",
      dataIndex: "hoat_dong",
      key: "hoat_dong",
    },
    {
      title: "Vai trò",
      dataIndex: "vai_tro",
      key: "vai_tro",
    },
    {
      title: "Hành động",
      dataIndex: "hanhdong",
      key: "hanhdong",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <EditOutlined
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => chiTietShipper(record.shipperID)}
          />
          {record.hoat_dong !== "Hoạt động" && (
            <DeleteOutlined
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => updateShipperXoaTable(record.shipperID)}
            />
          )}
          {record.trang_thai_xoa === "Đã xóa" && (
            <ReloadOutlined
              style={{ cursor: "pointer", color: "green" }}
              onClick={() => updateKhoiPhucShipper(record.shipperID)}
            />
          )}
        </div>
      ),
    },
  ];
  if (isAdmin) {
    columns = columns.filter((col) => col.key !== "hanhdong"); // Lọc cột "hanhdong" nếu là admin
  }
  const columnsNhatKyHoatDong = [
    {
      title: "Mã voucher",
      dataIndex: "voucherID",
      key: "voucherID",
    },
    {
      title: "Mã voucher",
      dataIndex: "ma_voucher",
      key: "ma_voucher",
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
        <img
          src={`http://localhost:8080/images/${text}`}
          alt="Voucher"
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      title: "Hành động",
      dataIndex: "hanh_dong",
      key: "hanh_dong",
    },
  ];

  const filteredShipperBangNULL = listShipper.filter((shipper) => {
    return shipper.trang_thai_xoa === null;
  });

  const filteredShipperKhacNull = listShipper.filter((shipper) => {
    return shipper.trang_thai_xoa !== null;
  });

  // Xuất file Excel
  const exportToExcel = () => {
    const filteredData = searchStatus
      ? voucherData.filter((voucher) => voucher.hoat_dong === searchStatus)
      : voucherData;

    // Chuyển đổi dữ liệu thành bảng
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Voucher");

    // Xuất file Excel
    XLSX.writeFile(workbook, "VoucherData.xlsx");
  };

  return (
    <Tabs
      className="mx-auto"
      style={{ width: "1180px", margin: "auto" }}
      //onChange={onChange}
      activeKey={activeKey} // Điều khiển tab hiện tại
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
                  <label htmlFor="productCode">ShipperID</label>
                  <input
                    type="text"
                    id="shipperID"
                    className="form-control"
                    disabled={isDisabled}
                    value={selectedShipper.shipperID}
                    onChange={(e) =>
                      setSelectedShipper({
                        ...selectedShipper,
                        shipperID: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productCode">Họ và tên</label>
                  <input
                    type="text"
                    id="hovaten"
                    className="form-control"
                    disabled={isDisabled}
                    value={selectedShipper.hovaten}
                    onChange={(e) =>
                      setSelectedShipper({
                        ...selectedShipper,
                        hovaten: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productName">Mật khẩu</label>
                  <input
                    type="text"
                    id="password"
                    className="form-control"
                    disabled={isDisabled}
                    value={selectedShipper.password}
                    onChange={(e) =>
                      setSelectedShipper({
                        ...selectedShipper,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="warehouseStatus">Hoạt động</label>
                  <Select
                    value={selectedShipper.hoat_dong} // Đồng bộ với state selectedVoucher
                    onChange={(value) =>
                      setSelectedShipper({
                        ...selectedShipper,
                        hoat_dong: value, // Cập nhật đúng giá trị vào state
                      })
                    }
                    options={[
                      { value: "On", label: "On" },
                      { value: "Off", label: "Off" },
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
                    disabled={isAddDisabled}
                    onClick={handleSaveShipper}
                  >
                    Thêm
                  </button>
                </div>
                <div className="form-group">
                  <button className="button" onClick={handleUpdate}>
                    Cập nhật
                  </button>
                </div>
                <div className="form-group">
                  <button
                    className="button"
                    id="xoavoucher"
                    disabled={isDeleteDisabled}
                    onClick={updateShipperXoaInput}
                  >
                    Xóa
                  </button>
                </div>
                <div className="form-group">
                  <button className="button" onClick={handelClear}>
                    Làm mới
                  </button>
                </div>
              </div>
            </div>
          ),
          disabled: isAdmin,
        },
        {
          label: `Danh sách shipper`,
          key: "2",
          children: (
            <div className="tab-content">
              <h1>Danh sách shipper</h1>
              <button
                style={{
                  marginBottom: "20px",
                  float: "right",
                  display: "flex",
                  alignItems: "center",
                }}
                className="buttonexcel"
                onClick={exportToExcel}
                disabled={isAdmin}
              >
                <ExportOutlined style={{ marginRight: "8px" }} /> Xuất file
                excel
              </button>
              <label htmlFor="searchStatus">Tìm kiếm theo trạng thái</label>
              <Select
                defaultValue="Tất cả"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  height: "40px",
                }}
                onChange={setSearchStatus} // Cập nhật trạng thái tìm kiếm
                options={[
                  { value: "", label: "Tất cả" }, // Không lọc
                  { value: "Hoạt động", label: "Hoạt động" },
                  { value: "Ngừng hoạt động", label: "Ngừng hoạt động" },
                ]}
              />
              <Table
                dataSource={filteredShipperBangNULL}
                columns={columns}
                pagination={true}
              />
            </div>
          ),
        },
        {
          label: `Danh sách shipper đã giao hàng`,
          key: "3",
          children: (
            <div className="tab-content">
              <h1>Danh sách shipper</h1>
              <button
                style={{
                  marginBottom: "20px",
                  float: "right",
                  display: "flex",
                  alignItems: "center",
                }}
                className="buttonexcel"
                onClick={exportToExcel}
                disabled={isAdmin}
              >
                <ExportOutlined style={{ marginRight: "8px" }} /> Xuất file
                excel
              </button>
              <label htmlFor="searchStatus">Tìm kiếm theo trạng thái</label>
              <Select
                defaultValue="Tất cả"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  height: "40px",
                }}
                onChange={setSearchStatus} // Cập nhật trạng thái tìm kiếm
                options={[
                  { value: "", label: "Tất cả" }, // Không lọc
                  { value: "Hoạt động", label: "Hoạt động" },
                  { value: "Ngừng hoạt động", label: "Ngừng hoạt động" },
                ]}
              />
              <Table
                dataSource={listShipperDaGiao}
                columns={columnsDaGiao}
                pagination={true}
              />
            </div>
          ),
        },
        {
          label: "Lịch sử xóa",
          key: "4",
          children: (
            <div className="tab-content">
              <h1>Lịch sử xóa</h1>
              <Table
                dataSource={filteredShipperKhacNull}
                columns={columns}
                pagination={false}
              />
            </div>
          ),
        },
        {
          label: "Nhật ký hoạt động",
          key: "5",
          children: (
            <div className="tab-content">
              <h1>Nhật kí hoạt động</h1>
              <Table
                //dataSource={filteredVoucherDataNhatKy}
                columns={columnsNhatKyHoatDong}
                pagination={false}
              />
            </div>
          ),
        },
      ]}
    />
  );
};

export default QuanLyShipper;
