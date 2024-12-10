import { Tabs, Select, Table, Modal, Button, DatePicker, Rate } from "antd"; // Thêm Table từ antd
import "../../styles/Quanlykho.css";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { render } from "@testing-library/react";

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

const DanhGia = () => {
  const [khoData, setKhoData] = useState([]);
  const [listNhatKyNe, setListNhatKyNe] = useState([]);
  const [sanPhamId, setSanPhamId] = useState("");
  const [danhGiaId, setDanhGiaId] = useState(""); // Lưu danh_giaID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noiDung, setNoiDung] = useState(""); // Tạo state cho nội dung

  const handleNoiDungChange = (e) => {
    setNoiDung(e.target.value);
  };
  const showModal = (record) => {
    console.log("record nè: ", record);
    setDanhGiaId(record.danh_giaID);
    setSanPhamId(record.san_phamId);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  let phanHoiDanhGia = {};
  const PhanHoiDanhGiaKho = () => {
    phanHoiDanhGia = {
      danh_giaID: danhGiaId,
      noi_dung: noiDung,
      ngay_tao: getCurrentDate(),
      san_phamId: sanPhamId,
    };
    return phanHoiDanhGia;
  };

  useEffect(() => {
    console.log("Đánh giá id: ", danhGiaId);
  }, [danhGiaId]);

  useEffect(() => {
    console.log("Sản phẩm id: ", sanPhamId);
  }, [sanPhamId]);

  const handleShowDanhGia = async (record) => {
    // Hiển thị hộp thoại xác nhận trước khi thực hiện
    const accountID = JSON.parse(localStorage.getItem("data"));
    console.log("Account ID:", accountID.accountID);
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn thực hiện thao tác này?"
    );

    // Nếu người dùng nhấn 'OK', tiếp tục thực hiện thao tác
    if (isConfirmed) {
      try {
        const response = await axios.put(
          `http://localhost:8080/api/danhgia/show/${record.danh_giaID}`,
          { accountID: accountID.accountID }
        );
        if (response.status === 200) {
          fetchKhoData(); // Gọi lại dữ liệu sau khi cập nhật thành công
          alert("Show thành công");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh giá:", error);
      }
    } else {
      // Nếu người dùng hủy thao tác, không làm gì cả
      console.log("Thao tác bị hủy.");
    }
  };

  const handleDisableDanhGia = async (record) => {
    const accountID = JSON.parse(localStorage.getItem("data"));
    // Hiển thị hộp thoại xác nhận trước khi thực hiện
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn thực hiện thao tác này?"
    );

    // Nếu người dùng nhấn 'OK', tiếp tục thực hiện thao tác
    if (isConfirmed) {
      try {
        const response = await axios.put(
          `http://localhost:8080/api/danhgia/disable/${record.danh_giaID}`,
          { accountID: accountID.accountID }
        );
        if (response.status === 200) {
          fetchKhoData(); // Gọi lại dữ liệu sau khi cập nhật thành công
          alert("Disable thành công");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh giá:", error);
      }
    } else {
      // Nếu người dùng hủy thao tác, không làm gì cả
      console.log("Thao tác bị hủy.");
    }
  };
  const phanHoiDanhGiaSave = async () => {
    const accountID = JSON.parse(localStorage.getItem("data"));
    console.log("Account ID:", accountID.accountID);

    const phanhoi = PhanHoiDanhGiaKho();
    phanhoi.accountID = accountID.accountID;

    console.log("Phản hồi nè: ", phanhoi);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/phanhoidanhgia/save",
        phanhoi, // Gửi dữ liệu dưới dạng JSON
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Đảm bảo Content-Type là application/json
          },
        }
      );
      console.log(response.data); // In ra dữ liệu trả về nếu thành công
    } catch (error) {
      // In lỗi chi tiết ra console để debug
      console.error("Lỗi chi tiết:", error);
      if (error.response) {
        // Lỗi từ server, in ra phản hồi lỗi
        console.error("Lỗi từ server:", error.response.data);
        console.error("Mã lỗi từ server:", error.response.status);
      } else if (error.request) {
        // Lỗi khi không nhận được phản hồi
        console.error("Không nhận được phản hồi từ server:", error.request);
      } else {
        // Lỗi khi cấu hình yêu cầu không hợp lệ
        console.error("Lỗi cấu hình yêu cầu:", error.message);
      }
    }
  };

  const listNhatKy = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/danhgia/list/nhatky"
    );
    const data = response.data;
    const formattedData = data.map((item) => ({
      key: item.danh_giaID,
      danh_giaID: item.danh_giaID,
      ten_hanh_dong: item.ten_hanh_dong,
      ngay_hanh_dong: item.ngay_hanh_dong,
      accountID: item.accountID,
    }));
    setListNhatKyNe(formattedData);
    console.log("Nhật ký nè: ", data);
  };

  useEffect(() => {
    listNhatKy();
  }, []);
  const fetchKhoData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/danhgia/list/chuaphanhoi"
      );
      const data = await response.json();
      console.log("Dữ liệu đánh giá là: ", data);
      const formattedData = data.map((item) => ({
        key: item.danh_giaID,
        danh_giaID: item.danh_giaID,
        noi_dung: item.noi_dung,
        ngay_tao: item.ngay_tao,
        hinh_anh: item.hinh_anh,
        so_sao: item.so_sao,
        trang_thaiPH: item.trang_thaiPH,
        san_phamId: item.san_phamId,
        hoat_dong: item.hoat_dong,
        accountID: item.accountID,
      }));
      setKhoData(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu voucher:", error);
    }
  };

  useEffect(() => {
    fetchKhoData();
  }, []);

  useEffect(() => {
    console.log("Kho đánh giá nè: ", khoData);
  }, [khoData]);

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Mã đánh giá",
      dataIndex: "danh_giaID",
      key: "danh_giaID",
      render: (text) => `DG${text}`,
    },
    {
      title: "Nội dung",
      dataIndex: "noi_dung",
      key: "noi_dung",
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngay_tao",
      key: "ngay_tao",
    },
    {
      title: "Số sao",
      dataIndex: "so_sao",
      key: "so_sao",
      render: (soSao) => <Rate value={soSao} disabled />,
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "san_phamId",
      key: "san_phamId",
    },
    {
      title: "Người đánh giá",
      dataIndex: "accountID",
      key: "accountID",
    },
    {
      title: "Hoạt động",
      dataIndex: "hoat_dong",
      key: "hoat_dong",
      render: (text) => (
        <span
          style={
            text === "On"
              ? { color: "green", fontWeight: "bold" }
              : { color: "red", fontWeight: "bold" }
          }
        >
          {text}
        </span>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "hanh_dong",
      key: "hanh_dong",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {record.hoat_dong === "Off" ? (
            <Button type="primary" onClick={() => handleShowDanhGia(record)}>
              Show
            </Button>
          ) : (
            <>
              <Button type="primary" onClick={() => showModal(record)}>
                Trả lời
              </Button>
              <Button
                type="primary"
                onClick={() => handleDisableDanhGia(record)}
              >
                Hide
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const columnsDaPhanHoi = [
    {
      title: "Mã đánh giá",
      dataIndex: "danh_giaID",
      key: "danh_giaID",
      render: (text) => `DG${text}`,
    },
    {
      title: "Nội dung",
      dataIndex: "noi_dung",
      key: "noi_dung",
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngay_tao",
      key: "ngay_tao",
    },
    {
      title: "Số sao",
      dataIndex: "so_sao",
      key: "so_sao",
      render: (soSao) => <Rate value={soSao} disabled />,
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "san_phamId",
      key: "san_phamId",
    },
    {
      title: "Người đánh giá",
      dataIndex: "accountID",
      key: "accountID",
    },
  ];

  const columnsNhatKy = [
    {
      title: "Mã đánh giá",
      dataIndex: "danh_giaID",
      key: "danh_giaID",
      render: (text) => `DG${text}`,
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

  const filerDanhGiaChuaPhanHoi = khoData.filter((item) => {
    return item.trang_thaiPH === null || item.hoat_dong === null;
  });

  const filerDanhGiaDaPhanHoi = khoData.filter((item) => {
    return item.trang_thaiPH === "Đã phản hồi";
  });

  console.log("Đánh giá chưa phản hồi nè: ", filerDanhGiaChuaPhanHoi);

  return (
    <>
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
                {/* Thanh tìm kiếm và bộ lọc */}
                <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                  <DatePicker.RangePicker
                    //value={selectedDateRange}
                    //onChange={handleDateChange}
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "20px", // Tạo khoảng cách giữa bộ lọc và bảng
                  }}
                >
                  {/* Ô tìm kiếm */}
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    style={{
                      padding: "8px",
                      width: "550px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      outline: "none",
                    }}
                    // onChange={(e) => handleSearch(e.target.value)} // Gọi hàm tìm kiếm khi nhập
                  />

                  {/* Select lọc */}
                  <select
                    style={{
                      padding: "8px",
                      border: "1px solid #ccc",
                      width: "550px",
                      borderRadius: "5px",
                      outline: "none",
                      marginBottom: "15px",
                    }}
                    // onChange={(e) => handleFilter(e.target.value)} // Gọi hàm lọc khi thay đổi
                  >
                    <option value="">Tất cả</option>
                    <option value="positive">Đánh giá tích cực</option>
                    <option value="negative">Đánh giá tiêu cực</option>
                  </select>
                </div>
                <Table
                  dataSource={filerDanhGiaChuaPhanHoi}
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
                  dataSource={filerDanhGiaDaPhanHoi}
                  columns={columnsDaPhanHoi}
                  pagination={false}
                />
              </div>
            ),
          },
          {
            label: `Nhật ký phản hồi`,
            key: "3",
            children: (
              <div className="tab-content">
                <h1>Nhật ký hoạt động</h1>
                <Table
                  dataSource={listNhatKyNe}
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
        onCancel={handleCancel}
        footer={
          <div>
            <button className="btn btn-success" onClick={phanHoiDanhGiaSave}>
              Lưu thông tin
            </button>
          </div>
        }
      >
        <div>
          <label htmlFor="">Nội dung</label>
          <input
            type="text"
            id="noi_dung"
            value={noiDung}
            onChange={handleNoiDungChange}
          />
        </div>
      </Modal>
    </>
  );
};
export default DanhGia;
