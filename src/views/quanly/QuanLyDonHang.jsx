import { Tabs, Select, Table, Modal, Button, DatePicker } from "antd"; // Thêm Table từ antd
import "../../styles/Quanlykho.css";
import {
  PrinterOutlined,
  EyeOutlined,
  ExportOutlined,
  UserOutlined,
  CreditCardOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { data, get, param } from "jquery";
import { render } from "@testing-library/react";
import axios from "axios";
import dayjs from "dayjs";
import moment from "moment";

const formatDateToYYYYMMDD = (date) => {
  return date.toISOString().split("T")[0];
};
const QuanLyDonHang = () => {
  const [sanphamData, setSanphamData] = useState([]);
  const [activeKey, setActiveKey] = useState("1");
  const [hoatDong, setHoatDong] = useState("Hoạt động");
  const [selectedDonHang, setSelectedDonHang] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalXacNhanOpen, setIsModalXacNhanOpen] = useState(false);
  const [dataListSanPham, setDataListSanPham] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [selectedDateRangeXacNhan, setSelectedDateRangeXacNhan] = useState([
    null,
    null,
  ]);
  const [selectedDateRangeDangGiao, setSelectedDateRangeDangGiao] = useState([
    null,
    null,
  ]);
  const [selectedDateRangeDaHoanThanh, setSelectedDateRangeDaHoanThanh] =
    useState([null, null]);
  const [selectedDateRangeDaHuy, setSelectedDateRangeDaHuy] = useState([
    null,
    null,
  ]);
  const [token, settoken] = useState("");

  // Xử lý hoàn tiền của Phát
  const getPaypalAccessToken = async () => {
    const res = await axios({
      method: "post",
      url: "https://api.sandbox.paypal.com/v1/oauth2/token",
      data: "grant_type=client_credentials", // => this is mandatory x-www-form-urlencoded. DO NOT USE json format for this
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded", // => needed to handle data parameter
        "Accept-Language": "en_US",
      },
      auth: {
        username:
          "AUuoahug326XM8PupIWATfSZph2ulLyvj714hnfx7DV-Z9MNjC9hSehpDh4VqE6mvtS6ExGgNSkhML2K",
        password:
          "EBRxibct4O7BsLjLUR0iAELmNHPVzI0UCU5HQ-LOzW-w3EUVOWRYhiLP4bZK4zM0YNX-IkWs_blvqV8c",
      },
    });

    localStorage.setItem("paypal_token", res.data.access_token);
    console.log("paypal access token", res.data.access_token);
    settoken(res.data.access_token);
  };

  const Show_order_details = async (id) => {
    const res = await axios({
      url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${id}`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("order details", res.data);
    if (res) {
      // 201 Created
      await axios.put("http://localhost:8080/api/donhang/hoantien", null, {
        params: {
          online_payment_id: id,
        },
      });
      alert("Hoàn tiền thành công");
      console.log(
        `Cập nhật trạng thái hoàn tiền cho đơn hàng với online_payment_id: ${id}`
      );
      fetchDonHangData();
    }
    Show_captured_payment_details(
      res.data.purchase_units[0].payments.captures[0].id
    );
  };
  const Refund_captured_payment = async (url) => {
    const res = await axios({
      url: `${url}`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {},
    });
    console.log(res.data);
  };
  const Show_captured_payment_details = async (id) => {
    const res = await axios({
      url: `https://api-m.sandbox.paypal.com/v2/payments/captures/${id} `,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("capture  payment  details", res.data);
    console.log(res.data.links.find((link) => link.rel === "refund").href);
    Refund_captured_payment(
      res.data.links.find((link) => link.rel === "refund").href
    );
  };
  // Xử lý hoàn tiền của Phát

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleXacNhanCancel = () => {
    setIsModalXacNhanOpen(false);
  };

  const fetchDonHangData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/donhang/getAll"
      );
      setSanphamData(response.data);
      console.log("Dữ liệu là: ", response.data);
    } catch {}
  };
  // const fetchDonHangData = async () => {
  //   try {
  //     const response = await fetch("http://localhost:8080/api/donhang/getAll");
  //     const data = await response.json();
  //     console.log("Dữ liệu là: ", data);
  //     const formattedData = data.map((item) => ({
  //       key: item.don_hangid,
  //       don_hangid: item.don_hangid,
  //       so_dien_thoai: item.so_dien_thoai,
  //       ngay_tao: item.ngay_tao,
  //       thoi_gianXN: item.thoi_gianXN,
  //       trang_thai: item.trang_thai,
  //       tong_tien: item.tong_tien,
  //       accountID: item.users.accountID,
  //     }));
  //     setSanphamData(formattedData);
  //   } catch (error) {
  //     console.error("Lỗi khi lấy dữ liệu voucher:", error);
  //   }
  // };

  const sanPhamInput = async () => {
    const sanPhamKho = {
      trang_thai: selectedDonHang.trang_thai,
    };

    return sanPhamKho;
  };

  useEffect(() => {
    fetchDonHangData();
    getPaypalAccessToken();
  }, []);
  useEffect(() => {
    console.log("dataListSanPham đã thay đổi:", dataListSanPham);
  }, [dataListSanPham]);
  const handlePrint = async (madonhang) => {
    try {
      const response = await axios.post(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/a5/gen-token",
        {
          order_codes: [madonhang],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Token: "b20158be-5619-11ef-8e53-0a00184fe694",
          },
        }
      );

      const matoken = response.data.data.token;
      console.log("Token nè:", matoken);

      // Gọi printOrder để in đơn hàng
      await printOrder(matoken, madonhang);
    } catch (error) {
      console.error("Lỗi khi lấy token:", error);
    }
  };

  const printOrder = async (matoken, madonhang) => {
    try {
      const response = await axios.get(
        "https://dev-online-gateway.ghn.vn/a5/public-api/printA5", // Gọi qua proxy
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            token: matoken,
            order_codes: [madonhang],
          },
        }
      );
      const newWindow = window.open("inmadonhang", "_blank");
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(response.data); // Ghi nội dung HTML vào trang mới
        newWindow.document.close();
      }

      console.log("In thành công:", response.data);
    } catch (error) {
      console.error("Lỗi khi in đơn hàng:", error);
    }
  };

  const handleEditClick = async (record) => {
    setIsModalOpen(true);
    console.log("Record data: ", record);
    try {
      const response = await fetch(
        `http://localhost:8080/api/edit/donhang/${record.don_hangid}`
      );
      if (response.ok) {
        const data = await response.json();
        const don_hangid = data[0][0];
        setSelectedDonHang({
          don_hangid: don_hangid,
          ...data,
        });
        //setSelectedDonHang(data);
        console.log("Dữ liệu khi nhấn edit: ", data);
        setDataListSanPham(data);
        console.log("Dữ liệu sản phẩm lis: ", dataListSanPham.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    }
  };

  const handleEditXacNhanClick = async (record) => {
    setIsModalXacNhanOpen(true);
    console.log("Record data: ", record);
    try {
      const response = await fetch(
        `http://localhost:8080/api/edit/donhang/${record.don_hangid}`
      );
      if (response.ok) {
        const data = await response.json();
        const don_hangid = data[0][0];
        setSelectedDonHang({
          don_hangid: don_hangid,
          ...data,
        });
        //setSelectedDonHang(data);
        console.log("Dữ liệu khi nhấn edit: ", data);
        setDataListSanPham(data);
        console.log("Dữ liệu sản phẩm lis: ", dataListSanPham.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    }
  };
  const handleUpdate = async () => {
    console.log("selectedDonHang trước khi cập nhật: ", selectedDonHang);
    //const sanPhamData = await sanPhamInput();
    const sanPhamData = {
      trang_thai: selectedDonHang.trang_thai,
      // thoi_gianXN:
      //   selectedDonHang.trang_thai === "Đã xác nhận"
      //     ? formatDateToYYYYMMDD(new Date())
      //     : selectedDonHang.thoi_gianXN,
    };
    console.log("Dữ liệu khi nhấn update: ", sanPhamData);

    try {
      const response = await axios.put(
        `http://localhost:8080/api/update/trangthai/${selectedDonHang.don_hangid}`,
        sanPhamData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Cập nhật sản phẩm thành công!");
        alert("Cập nhật sản phẩm thành công");
        fetchDonHangData();
        setSelectedDonHang({});
        setIsModalOpen(false);
      } else {
        console.error(
          "Lỗi khi cập nhật sản phẩm:",
          response.data.message || "Không xác định"
        );
        alert(
          `Lỗi khi cập nhật sản phẩm: ${
            response.data.message || "Không xác định"
          }`
        );
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu cập nhật:", error);
    }
  };

  const handleUpdateDaXacNhan = async () => {
    console.log("selectedDonHang trước khi cập nhật: ", selectedDonHang);
    //const sanPhamData = await sanPhamInput();
    const sanPhamData = {
      trang_thai: selectedDonHang.trang_thai,
      thoi_gianXN: formatDateToYYYYMMDD(new Date()),
    };
    console.log("Dữ liệu khi nhấn update: ", sanPhamData);

    try {
      const response = await axios.put(
        `http://localhost:8080/api/update/trangthai/ngayXacNhan/${selectedDonHang.don_hangid}`,
        sanPhamData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Cập nhật sản phẩm thành công!");
        alert("Cập nhật sản phẩm thành công");
        fetchDonHangData();
        setSelectedDonHang({});
        setIsModalXacNhanOpen(false);
      } else {
        console.error(
          "Lỗi khi cập nhật sản phẩm:",
          response.data.message || "Không xác định"
        );
        alert(
          `Lỗi khi cập nhật sản phẩm: ${
            response.data.message || "Không xác định"
          }`
        );
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu cập nhật:", error);
    }
  };
  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "don_hangid",
      key: "don_hangid",
    },
    {
      title: "Người đặt",
      dataIndex: "accountID",
      key: "accountID",
    },
    {
      title: "Số điện thoại",
      dataIndex: "so_dien_thoai",
      key: "so_dien_thoai",
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngay_tao",
      key: "ngay_tao",
    },
    {
      title: "Ngày xác nhận",
      dataIndex: "thoi_gianXN",
      key: "thoi_gianXN",
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "trang_thai",
      key: "trang_thai",
      render: (text) => (
        <span
          style={{
            color:
              text === "Đang chờ thanh toán"
                ? "#808080" // Xám
                : text === "Đã xác nhận"
                ? "#FF8C00" // Cam
                : text === "Đang giao"
                ? "#1E90FF" // Xanh dương
                : text === "Đã giao"
                ? "#32CD32" // Xanh lục
                : text === "Đã hủy"
                ? "#FF4500" // Đỏ
                : "#000000", // Màu mặc định
            fontWeight: "bold", // Tô đậm tất cả các trạng thái
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "tong_tien",
      key: "tong_tien",
      render: (tong_tien) => `${tong_tien} VND`,
    },
    {
      title: "Hành động",
      dataIndex: "hanh_dong",
      key: "hanh_dong",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <EyeOutlined
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => handleEditClick(record)}
          />
          {record.trang_thai === "Đã xác nhận" && (
            <PrinterOutlined
              style={{ cursor: "pointer", color: "#faad14" }}
              onClick={() => handlePrint(record.don_hangid)}
            />
          )}
          {record.trang_thai === "Đã hủy" &&
            record.phuong_thucTT === "PTTT02" && (
              <Button
                onClick={() => Show_order_details(record.online_payment_id)}
                style={{
                  cursor: "pointer",
                  color: "white",
                  backgroundColor: "red",
                  marginLeft: "10px",
                  fontWeight: "bold",
                  border: "1px solid red",
                }}
              >
                Hoàn tiền
              </Button>
            )}
        </div>
      ),
    },
  ];

  // Cấu hình cột cho bảng
  const columnsDaXacNhan = [
    {
      title: "Mã đơn hàng",
      dataIndex: "don_hangid",
      key: "don_hangid",
    },
    {
      title: "Người đặt",
      dataIndex: "accountID",
      key: "accountID",
    },
    {
      title: "Số điện thoại",
      dataIndex: "so_dien_thoai",
      key: "so_dien_thoai",
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngay_tao",
      key: "ngay_tao",
    },
    {
      title: "Ngày xác nhận",
      dataIndex: "thoi_gianXN",
      key: "thoi_gianXN",
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "trang_thai",
      key: "trang_thai",
      render: (text) => (
        <span
          style={{
            color: text === "Đang chờ xử lý" ? "#fff438" : "#000000", // màu xám cho trạng thái chờ thanh toán
            fontWeight: text === "Đang chờ xử lý" ? "bold" : "normal", // tô đậm cho dễ nhìn
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "tong_tien",
      key: "tong_tien",
      render: (tong_tien) => `${tong_tien} VND`,
    },
    {
      title: "Hành động",
      dataIndex: "hanh_dong",
      key: "hanh_dong",
      render: (text, record) =>
        record.trang_thai !== "Đang chờ thanh toán" ? (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <EyeOutlined
              style={{ cursor: "pointer", color: "#1890ff" }}
              onClick={() => handleEditXacNhanClick(record)}
            />

            {record.trang_thai === "Đã xác nhận" && (
              <PrinterOutlined
                style={{ cursor: "pointer", color: "#faad14" }}
                onClick={() => handlePrint(record.don_hangid)}
              />
            )}
          </div>
        ) : null,
    },
  ];
  const handleDateChange = (dates) => {
    console.log("Selected date range: ", dates);
    setSelectedDateRange(dates);
  };

  const handleDateChangeXacNhan = (dates) => {
    console.log("Selected date range for 'Đã xác nhận':", dates);
    setSelectedDateRangeXacNhan(dates);
  };

  const handleDateChangeDangGiao = (dates) => {
    console.log("Selected date range for 'Đang giao':", dates);
    setSelectedDateRangeDangGiao(dates);
  };

  const handleDateChangeDaHoanThanh = (dates) => {
    console.log("Selected date range for 'Đã hoàn thành':", dates);
    setSelectedDateRangeDaHoanThanh(dates);
  };

  const handleDateChangeDaHuy = (dates) => {
    console.log("Selected date range for 'Đã hủy':", dates);
    setSelectedDateRangeDaHuy(dates);
  };

  // Lọc dữ liệu theo khoảng thời gian đã chọn
  // const filterByDateRange = () => {
  //   if (!selectedDateRange[0] || !selectedDateRange[1]) return sanphamData;

  //   const startDate = selectedDateRange[0].format("YYYY-MM-DD");
  //   const endDate = selectedDateRange[1].format("YYYY-MM-DD");
  //   console.log("Ngày bắt đầu và ngày kết thúc nè: ", startDate, "to", endDate);
  //   return sanphamData.filter((item) => {
  //     // Chuyển đổi ngay_tao thành moment và loại bỏ phần thời gian
  //     const itemDate = moment(item.ngay_tao).startOf("day"); // Loại bỏ giờ của ngay_tao
  //     return itemDate.isBetween(startDate, endDate, null, "[]") ; // So sánh ngày
  //   });
  // };

  const filterByDateRange = (selectedDateRange, trangThai) => {
    if (!selectedDateRange || !selectedDateRange[0] || !selectedDateRange[1]) {
      return sanphamData.filter((item) => item.trang_thai === trangThai); // Trả về toàn bộ dữ liệu nếu chưa chọn ngày
    }

    const startDate = selectedDateRange[0].format("YYYY-MM-DD");
    const endDate = selectedDateRange[1].format("YYYY-MM-DD");
    console.log("Ngày bắt đầu và ngày kết thúc nè: ", startDate, "to", endDate);

    return sanphamData.filter((item) => {
      const itemDate = moment(item.ngay_tao).startOf("day");
      return (
        itemDate.isBetween(startDate, endDate, null, "[]") &&
        item.trang_thai === trangThai
      );
    });
  };

  const filterDangChoXuLy = filterByDateRange().filter(
    (item) => item.trang_thai === "Đang chờ xử lý"
  );

  const filterDaXacNhan = filterByDateRange().filter(
    (item) => item.trang_thai === "Đã xác nhận"
  );

  const filterDangGiao = filterByDateRange().filter(
    (item) => item.trang_thai === "Đang giao"
  );

  const filterDaGiao = filterByDateRange().filter(
    (item) => item.trang_thai === "Đã giao"
  );

  const filterDaHuy = filterByDateRange().filter(
    (item) => item.trang_thai === "Đã hủy"
  );

  const filterDangChoThanhToan = sanphamData.filter(
    (item) => item.trang_thai === "Đang chờ thanh toán"
  );

  // const filterDangChoXuLy = sanphamData.filter(
  //   (item) => item.trang_thai === "Đang chờ xử lý"
  // );

  // const filterDaXacNhan = sanphamData.filter(
  //   (item) => item.trang_thai === "Đã xác nhận"
  // );

  // const filterDangGiao = sanphamData.filter(
  //   (item) => item.trang_thai === "Đang giao"
  // );

  // const filterDaGiao = sanphamData.filter(
  //   (item) => item.trang_thai === "Đã giao"
  // );

  // const filterDaHuy = sanphamData.filter(
  //   (item) => item.trang_thai === "Đã hủy"
  // );

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã giao":
        return "green"; // Màu xanh lục
      case "Đang giao":
        return "blue"; // Màu xanh dương
      case "Đã xác nhận":
        return "orange"; // Màu cam
      case "Đã hủy":
        return "red"; // Màu đỏ
      case "Đang chờ xử lý":
        return "yellow"; // Màu vàng
      default:
        return "black"; // Màu mặc định nếu không có trạng thái hợp lệ
    }
  };

  return (
    <>
      <style>
        {`
          .ant-modal-mask {
            background-color: transparent !important;
            box-shadow: none !important; 
          }
          .ant-modal {
              z-index: 1050 !important;
          }
      `}
      </style>
      <Tabs
        className="mx-auto"
        style={{ width: "1100px", margin: "auto" }}
        activeKey={activeKey} // Điều khiển tab hiện tại
        onChange={handleTabChange}
        type="card"
        items={[
          {
            label: `Đang chờ thanh toán`,
            key: "1",
            children: (
              <div className="tab-content">
                <h1>Danh sách đơn hàng</h1>
                <Table
                  dataSource={filterDangChoThanhToan}
                  columns={columns}
                  pagination={true}
                />
              </div>
            ),
          },
          {
            label: `Đang chờ xử lý`,
            key: "2",
            children: (
              <div className="tab-content">
                <h1>Danh sách đơn hàng chờ xử lý</h1>
                {/* <button
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
                </button> */}
                <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                  <DatePicker.RangePicker
                    value={selectedDateRange}
                    onChange={handleDateChange}
                    format="YYYY-MM-DD"
                    style={{
                      width: "100%", // Chiều rộng đầy đủ giúp dễ sử dụng hơn
                      borderRadius: "6px", // Bo tròn nhẹ viền cho thẩm mỹ
                      border: "1px solid #d9d9d9", // Thêm viền nhạt để dễ nhìn
                      padding: "8px 12px", // Tăng khoảng cách nội dung trong DatePicker
                      backgroundColor: "#fdfdfd", // Màu nền sáng để dễ đọc
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng nhẹ
                    }}
                    dropdownClassName="custom-date-dropdown" // Lớp tùy chỉnh cho phần dropdown
                  />
                </div>
                <Table
                  dataSource={filterByDateRange(
                    selectedDateRange,
                    "Đang chờ xử lý"
                  )}
                  columns={columnsDaXacNhan}
                  pagination={true}
                />
              </div>
            ),
          },
          {
            label: `Đã xác nhận`,
            key: "3",
            children: (
              <div className="tab-content">
                <h1>Danh sách đơn hàng đã xác nhận</h1>
                <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                  <DatePicker.RangePicker
                    value={selectedDateRangeXacNhan}
                    onChange={handleDateChangeXacNhan}
                    format="YYYY-MM-DD"
                    style={{
                      width: "100%", // Chiều rộng đầy đủ giúp dễ sử dụng hơn
                      borderRadius: "6px", // Bo tròn nhẹ viền cho thẩm mỹ
                      border: "1px solid #d9d9d9", // Thêm viền nhạt để dễ nhìn
                      padding: "8px 12px", // Tăng khoảng cách nội dung trong DatePicker
                      backgroundColor: "#fdfdfd", // Màu nền sáng để dễ đọc
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng nhẹ
                    }}
                    dropdownClassName="custom-date-dropdown" // Lớp tùy chỉnh cho phần dropdown
                  />
                </div>
                <Table
                  dataSource={filterByDateRange(
                    selectedDateRangeXacNhan,
                    "Đã xác nhận"
                  )}
                  columns={columns}
                  pagination={true}
                />
              </div>
            ),
          },
          {
            label: `Đang giao`,
            key: "4",
            children: (
              <div className="tab-content">
                <h1>Danh sách đơn hàng đang giao</h1>
                <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                  <DatePicker.RangePicker
                    value={selectedDateRangeDangGiao}
                    onChange={handleDateChangeDangGiao}
                    format="YYYY-MM-DD"
                    style={{
                      width: "100%", // Chiều rộng đầy đủ giúp dễ sử dụng hơn
                      borderRadius: "6px", // Bo tròn nhẹ viền cho thẩm mỹ
                      border: "1px solid #d9d9d9", // Thêm viền nhạt để dễ nhìn
                      padding: "8px 12px", // Tăng khoảng cách nội dung trong DatePicker
                      backgroundColor: "#fdfdfd", // Màu nền sáng để dễ đọc
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng nhẹ
                    }}
                    dropdownClassName="custom-date-dropdown" // Lớp tùy chỉnh cho phần dropdown
                  />
                </div>
                <Table
                  dataSource={filterByDateRange(
                    selectedDateRangeDangGiao,
                    "Đang giao"
                  )}
                  columns={columns}
                  pagination={true}
                />
              </div>
            ),
          },
          {
            label: `Đã giao`,
            key: "5",
            children: (
              <div className="tab-content">
                <h1>Danh sách đơn hàng đã giao</h1>
                <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                  <DatePicker.RangePicker
                    value={selectedDateRangeDaHoanThanh}
                    onChange={handleDateChangeDaHoanThanh}
                    format="YYYY-MM-DD"
                    style={{
                      width: "100%", // Chiều rộng đầy đủ giúp dễ sử dụng hơn
                      borderRadius: "6px", // Bo tròn nhẹ viền cho thẩm mỹ
                      border: "1px solid #d9d9d9", // Thêm viền nhạt để dễ nhìn
                      padding: "8px 12px", // Tăng khoảng cách nội dung trong DatePicker
                      backgroundColor: "#fdfdfd", // Màu nền sáng để dễ đọc
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng nhẹ
                    }}
                    dropdownClassName="custom-date-dropdown" // Lớp tùy chỉnh cho phần dropdown
                  />
                </div>
                <Table
                  dataSource={filterByDateRange(
                    selectedDateRangeDaHoanThanh,
                    "Đã giao"
                  )}
                  columns={columns}
                  pagination={true}
                />
              </div>
            ),
          },
          {
            label: `Đã hủy`,
            key: "6",
            children: (
              <div className="tab-content">
                <h1>Danh sách đơn hàng đã hủy</h1>
                <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                  <DatePicker.RangePicker
                    value={selectedDateRangeDaHuy}
                    onChange={handleDateChangeDaHuy}
                    format="YYYY-MM-DD"
                    style={{
                      width: "100%", // Chiều rộng đầy đủ giúp dễ sử dụng hơn
                      borderRadius: "6px", // Bo tròn nhẹ viền cho thẩm mỹ
                      border: "1px solid #d9d9d9", // Thêm viền nhạt để dễ nhìn
                      padding: "8px 12px", // Tăng khoảng cách nội dung trong DatePicker
                      backgroundColor: "#fdfdfd", // Màu nền sáng để dễ đọc
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng nhẹ
                    }}
                    dropdownClassName="custom-date-dropdown" // Lớp tùy chỉnh cho phần dropdown
                  />
                </div>
                <Table
                  dataSource={filterByDateRange(
                    selectedDateRangeDaHuy,
                    "Đã hủy"
                  )}
                  columns={columns}
                  pagination={true}
                />
              </div>
            ),
          },
          {
            label: `Đã hoàn tiền`,
            key: "7",
            children: (
              <div className="tab-content">
                <h1>Danh sách đơn hàng đã hoàn tiền</h1>
                <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                  <DatePicker.RangePicker
                    value={selectedDateRangeDaHuy}
                    onChange={handleDateChangeDaHuy}
                    format="YYYY-MM-DD"
                    style={{
                      width: "100%", // Chiều rộng đầy đủ giúp dễ sử dụng hơn
                      borderRadius: "6px", // Bo tròn nhẹ viền cho thẩm mỹ
                      border: "1px solid #d9d9d9", // Thêm viền nhạt để dễ nhìn
                      padding: "8px 12px", // Tăng khoảng cách nội dung trong DatePicker
                      backgroundColor: "#fdfdfd", // Màu nền sáng để dễ đọc
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng nhẹ
                    }}
                    dropdownClassName="custom-date-dropdown" // Lớp tùy chỉnh cho phần dropdown
                  />
                </div>
                <Table
                  dataSource={filterByDateRange(
                    selectedDateRangeDaHuy,
                    "Đã hoàn tiền"
                  )}
                  columns={columns}
                  pagination={true}
                />
              </div>
            ),
          },
        ]}
      />
      {/* Modal của đã giao nè hihi */}
      <Modal
        title="Chi tiết đơn hàng"
        style={{ left: 120 }}
        width={1150}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleUpdate} type="primary">
            Cập nhật
          </Button>,
          <Button key="submit" onClick={handleCancel}>
            Thoát
          </Button>,
        ]}
      >
        {selectedDonHang && selectedDonHang[0] ? (
          <div
            className="py-1"
            style={{
              backgroundColor: "#f5f5f5",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <div
              className="col-12 row d-flex py-3 cot1 "
              style={{
                paddingLeft: "0px",
                paddingRight: "0px",
                marginLeft: "1px",
              }}
            >
              <div
                className="col-4 py-3"
                style={{
                  backgroundColor: "white",
                  borderRight: "10px solid #f5f5f5",
                }}
              >
                <div className="d-flex">
                  <UserOutlined style={{ paddingRight: "10px" }} />
                  <h6>Thông tin khách hàng</h6>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Tên khách hàng: </p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][6]}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Email:</p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][12]}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Số điện thoại: </p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][16]}
                  </p>
                </div>
              </div>
              {/* Phương thức thanh toán */}
              <div
                className="col-4 py-3"
                style={{
                  backgroundColor: "white",
                  borderRight: "10px solid #f5f5f5",
                }}
              >
                <div className="d-flex">
                  <CreditCardOutlined style={{ paddingRight: "10px" }} />
                  <h6>Phương thức thanh toán</h6>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Hình thức:</p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][4]}
                  </p>
                </div>
              </div>
              {/* Thông tin đơn hàng */}
              <div className="col-4 py-3" style={{ backgroundColor: "white" }}>
                <div className="d-flex">
                  <ShoppingCartOutlined style={{ paddingRight: "10px" }} />
                  <h6>Thông tin đơn hàng</h6>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Mã đơn hàng:</p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][0]}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Ngày tạo</p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][7]}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Ngày xác nhận</p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][8]}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Thời gian giao hàng dự kiến:</p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][13]}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Trạng thái đơn hàng:</p>
                  {/* <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][14]}
                  </p> */}
                  <p
                    style={{
                      color: getStatusColor(selectedDonHang[0][14]), // Áp dụng màu dựa trên trạng thái
                      fontWeight: "bold",
                    }}
                  >
                    {selectedDonHang[0][14]}
                  </p>
                </div>
              </div>
            </div>
            {/* Địa chỉ nhận hàng */}
            <div
              className="col-12 py-3 cot2 "
              style={{ backgroundColor: "white", marginBottom: "15px" }}
            >
              <div className="d-flex">
                <EnvironmentOutlined style={{ paddingRight: "10px" }} />
                <h6>Địa chỉ nhận hàng:</h6>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <p style={{ color: "black" }}>Địa chỉ</p>
                <p style={{ color: "black", fontWeight: "bold" }}>
                  {selectedDonHang[0][17]} {selectedDonHang[0][18]}{" "}
                  {selectedDonHang[0][19]} {selectedDonHang[0][20]}
                </p>
              </div>
            </div>

            <div
              className="col-12 cot3"
              style={{
                backgroundColor: "white",
                paddingLeft: "0",
                paddingRight: "0",
              }}
            >
              <table
                className="table"
                style={{ paddingLeft: "0", paddingRight: "0" }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "orange",
                      color: "white",
                      fontWeight: "bolder",
                    }}
                  >
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {dataListSanPham.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={`http://localhost:8080/images/${item[10]}`}
                          width={50}
                          height={50}
                          alt="Product"
                        />
                      </td>
                      <td>{item[5]}</td>
                      <td>{item[2]}</td>
                      <td>{item[9]} VND</td>
                      <td>{item[9] * item[2]} VND</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="col-12 py-3 mb-3"
              style={{ backgroundColor: "white" }}
            >
              <div className="d-flex justify-content-between">
                <p
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontFamily: "Arial",
                  }}
                >
                  Mã giảm giá:
                </p>
                <p style={{ color: "orange", fontWeight: "bold" }}>
                  {selectedDonHang[0][11]
                    ? selectedDonHang[0][11]
                    : "Không có mã giảm giá nào"}
                </p>
              </div>
              <div className="d-flex justify-content-between pt-2">
                <p
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontFamily: "Arial",
                  }}
                >
                  Phí vận chuyển:
                </p>
                <p style={{ color: "green", fontWeight: "bold" }}>
                  {selectedDonHang[0][15]} VND
                </p>
              </div>
              <div className="d-flex justify-content-between pt-2">
                <p
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontFamily: "Arial",
                  }}
                >
                  Tổng thành tiền:
                </p>
                <p style={{ color: "red", fontWeight: "bold" }}>
                  {dataListSanPham.reduce(
                    (total, item) => total + item[9] * item[2],
                    0
                  )}{" "}
                  VND
                </p>
              </div>
              {selectedDonHang[0][14] !== "Đã giao" ? (
                <div className="d-flex justify-content-between pt-2">
                  <p
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontFamily: "Arial",
                    }}
                  >
                    Cập nhật trạng thái đơn hàng:
                  </p>

                  <Select
                    style={{ width: "300px" }}
                    value={selectedDonHang.trang_thai || "Chọn trạng thái"}
                    onChange={(value) =>
                      setSelectedDonHang({
                        ...selectedDonHang,
                        trang_thai: value,
                      })
                    }
                    options={[
                      {
                        value: "Đang giao",
                        label: "Gửi đơn hàng cho đơn vị vận chuyển",
                      },
                      // { value: "Đã giao", label: "Đơn hàng hoàn tất" },
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
              ) : null}
            </div>
            {/* Ghi chú */}
            <div
              className="col-12 py-3 mb-3"
              style={{ backgroundColor: "white" }}
            >
              <p style={{ color: "black", fontWeight: "bold" }}>Ghi chú:</p>
              <hr />
              <p style={{ color: "black" }}>
                {selectedDonHang[0][1]
                  ? selectedDonHang[0][1]
                  : "Không có ghi chú nào"}
              </p>
            </div>
            {selectedDonHang[0][14] === "Đã hủy" && (
              <div
                className="col-12 py-3 mb-3"
                style={{ backgroundColor: "white" }}
              >
                <p style={{ color: "black", fontWeight: "bold" }}>Lý do:</p>
                <hr />
                <p style={{ color: "black" }}>
                  {selectedDonHang[0][21]
                    ? selectedDonHang[0][21]
                    : "Không có nội dung nào"}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

      {/* Modal của đã xác nhận nè hihi */}
      <Modal
        title="Chi tiết đơn hàng"
        style={{ left: 120 }}
        width={1150}
        open={isModalXacNhanOpen}
        onOk={handleOk}
        onCancel={handleXacNhanCancel}
        footer={[
          <Button key="back" onClick={handleUpdateDaXacNhan} type="primary">
            Cập nhật
          </Button>,
          <Button key="submit" onClick={handleXacNhanCancel}>
            Thoát
          </Button>,
        ]}
      >
        {selectedDonHang && selectedDonHang[0] ? (
          <div
            className="py-1"
            style={{
              backgroundColor: "#f5f5f5",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <div
              className="col-12 row d-flex py-3 cot1 "
              style={{
                paddingLeft: "0px",
                paddingRight: "0px",
                marginLeft: "1px",
              }}
            >
              <div
                className="col-4 py-3"
                style={{
                  backgroundColor: "white",
                  borderRight: "10px solid #f5f5f5",
                }}
              >
                <div className="d-flex">
                  <UserOutlined style={{ paddingRight: "10px" }} />
                  <h6>Thông tin khách hàng</h6>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Tên khách hàng: </p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][6]}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Email:</p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][12]}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Số điện thoại: </p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][16]}
                  </p>
                </div>
              </div>
              {/* Phương thức thanh toán */}
              <div
                className="col-4 py-3"
                style={{
                  backgroundColor: "white",
                  borderRight: "10px solid #f5f5f5",
                }}
              >
                <div className="d-flex">
                  <CreditCardOutlined style={{ paddingRight: "10px" }} />
                  <h6>Phương thức thanh toán</h6>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Hình thức:</p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][4]}
                  </p>
                </div>
              </div>
              {/* Thông tin đơn hàng */}
              <div className="col-4 py-3" style={{ backgroundColor: "white" }}>
                <div className="d-flex">
                  <ShoppingCartOutlined style={{ paddingRight: "10px" }} />
                  <h6>Thông tin đơn hàng</h6>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Mã đơn hàng:</p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][0]}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Ngày tạo</p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][7]}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Ngày xác nhận</p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][8]}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Thời gian giao hàng dự kiến:</p>
                  <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][13]}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "black" }}>Trạng thái đơn hàng:</p>
                  {/* <p style={{ color: "black", fontWeight: "bold" }}>
                    {selectedDonHang[0][14]}
                  </p> */}
                  <p
                    style={{
                      color: getStatusColor(selectedDonHang[0][14]), // Áp dụng màu dựa trên trạng thái
                      fontWeight: "bold",
                    }}
                  >
                    {selectedDonHang[0][14]}
                  </p>
                </div>
              </div>
            </div>
            {/* Địa chỉ nhận hàng */}
            <div
              className="col-12 py-3 cot2 "
              style={{ backgroundColor: "white", marginBottom: "15px" }}
            >
              <div className="d-flex">
                <EnvironmentOutlined style={{ paddingRight: "10px" }} />
                <h6>Địa chỉ nhận hàng:</h6>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <p style={{ color: "black" }}>Địa chỉ</p>
                <p style={{ color: "black", fontWeight: "bold" }}>
                  {selectedDonHang[0][17]} {selectedDonHang[0][18]}{" "}
                  {selectedDonHang[0][19]} {selectedDonHang[0][20]}
                </p>
              </div>
            </div>

            <div
              className="col-12 cot3"
              style={{
                backgroundColor: "white",
                paddingLeft: "0",
                paddingRight: "0",
              }}
            >
              <table
                className="table"
                style={{ paddingLeft: "0", paddingRight: "0" }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "orange",
                      color: "white",
                      fontWeight: "bolder",
                    }}
                  >
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {dataListSanPham.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={`http://localhost:8080/images/${item[10]}`}
                          width={50}
                          height={50}
                          alt="Product"
                        />
                      </td>
                      <td>{item[5]}</td>
                      <td>{item[2]}</td>
                      <td>{item[9]} VND</td>
                      <td>{item[9] * item[2]} VND</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="col-12 py-3 mb-3"
              style={{ backgroundColor: "white" }}
            >
              <div className="d-flex justify-content-between">
                <p
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontFamily: "Arial",
                  }}
                >
                  Mã giảm giá:
                </p>
                <p style={{ color: "orange", fontWeight: "bold" }}>
                  {selectedDonHang[0][11]
                    ? selectedDonHang[0][11]
                    : "Không có mã giảm giá nào"}
                </p>
              </div>
              <div className="d-flex justify-content-between pt-2">
                <p
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontFamily: "Arial",
                  }}
                >
                  Phí vận chuyển:
                </p>
                <p style={{ color: "green", fontWeight: "bold" }}>
                  {selectedDonHang[0][15]} VND
                </p>
              </div>
              <div className="d-flex justify-content-between pt-2">
                <p
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontFamily: "Arial",
                  }}
                >
                  Tổng thành tiền:
                </p>
                <p style={{ color: "red", fontWeight: "bold" }}>
                  {dataListSanPham.reduce(
                    (total, item) => total + item[9] * item[2],
                    0
                  )}{" "}
                  VND
                </p>
              </div>
              <div className="d-flex justify-content-between pt-2">
                <p
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontFamily: "Arial",
                  }}
                >
                  Cập nhật trạng thái đơn hàng:
                </p>
                <Select
                  style={{ width: "300px" }}
                  value={selectedDonHang.trang_thai || "Chọn trạng thái"}
                  onChange={(value) =>
                    setSelectedDonHang({
                      ...selectedDonHang,
                      trang_thai: value,
                    })
                  }
                  options={[
                    {
                      value: "Đã xác nhận",
                      label: "Xác nhận đơn hàng",
                    },
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
            {/* Ghi chú */}
            <div
              className="col-12 py-3 mb-3"
              style={{ backgroundColor: "white" }}
            >
              <p style={{ color: "black", fontWeight: "bold" }}>Ghi chú:</p>
              <hr />
              <p style={{ color: "black" }}>
                {selectedDonHang[0][1]
                  ? selectedDonHang[0][1]
                  : "Không có ghi chú nào"}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </>
  );
};

export default QuanLyDonHang;
