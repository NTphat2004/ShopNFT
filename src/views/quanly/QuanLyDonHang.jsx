import { Tabs, Select, Table, Modal, Button } from "antd"; // Thêm Table từ antd
import "../../styles/Quanlykho.css";
import {
  PrinterOutlined,
  EyeOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { get, param } from "jquery";
import { render } from "@testing-library/react";
import axios from "axios";

const QuanLyDonHang = () => {
  const [sanphamData, setSanphamData] = useState([]);
  const [activeKey, setActiveKey] = useState("1");
  const [hoatDong, setHoatDong] = useState("Hoạt động");
  const [selectedDonHang, setSelectedDonHang] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const fetchDonHangData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/donhang/getAll");
      const data = await response.json();
      console.log("Dữ liệu là: ", data);
      const formattedData = data.map((item) => ({
        key: item.don_hangid,
        don_hangid: item.don_hangid,
        so_dien_thoai: item.so_dien_thoai,
        ngay_tao: item.ngay_tao,
        thoi_gianXN: item.thoi_gianXN,
        trang_thai: item.trang_thai,
        tong_tien: item.tong_tien,
        accountID: item.users.accountID,
      }));
      setSanphamData(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu voucher:", error);
    }
  };

  const sanPhamInput = async () => {
    const sanPhamKho = {
      trang_thai: selectedDonHang.trang_thai,
    };

    return sanPhamKho;
  };

  useEffect(() => {
    fetchDonHangData();
  }, []);

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
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    }
  };

  const handleUpdate = async () => {
    console.log("selectedDonHang trước khi cập nhật: ", selectedDonHang);
    //const sanPhamData = await sanPhamInput();
    const sanPhamData = { trang_thai: selectedDonHang.trang_thai };
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
              onClick={() => handleEditClick(record)}
            />
            {isModalOpen && (
              <Modal
                title="Chi tiết đơn hàng"
                style={{ left: 90 }}
                width={800}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}
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
                  <div>
                    <div className="col-12 row d-flex">
                      <div
                        className="col-4"
                        style={{ border: "1px solid black" }}
                      >
                        Bảng 1
                      </div>
                      <div
                        className="col-4"
                        style={{ border: "1px solid black" }}
                      >
                        Bảng 2
                      </div>
                      <div
                        className="col-4"
                        style={{ border: "1px solid black" }}
                      >
                        Bảng 3
                      </div>
                    </div>
                    <div className="col-12 row d-flex">
                      <p>Ghi chú nè: {selectedDonHang[0][1]}</p>
                      <p>Dơn hàng id: {selectedDonHang[0][0]}</p>
                      <p>Some contents...</p>
                      <p>Some contents...</p>
                    </div>
                    <Select
                      value={selectedDonHang.trang_thai || "Chọn trạng thái"}
                      onChange={(value) =>
                        setSelectedDonHang({
                          ...selectedDonHang,
                          trang_thai: value,
                        })
                      }
                      options={[
                        { value: "Đã xác nhận", label: "Xác nhận đơn hàng" },
                        {
                          value: "Đang giao",
                          label: "Gửi đơn hàng cho đơn vị vận chuyển",
                        },
                        { value: "Đã giao", label: "Đơn hàng hoàn tất" },
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
                ) : (
                  <p>Loading...</p>
                )}
              </Modal>
            )}
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

  const filterDangChoThanhToan = sanphamData.filter(
    (item) => item.trang_thai === "Đang chờ thanh toán"
  );

  const filterDangChoXuLy = sanphamData.filter(
    (item) => item.trang_thai === "Đang chờ xử lý"
  );

  const filterDaXacNhan = sanphamData.filter(
    (item) => item.trang_thai === "Đã xác nhận"
  );

  const filterDangGiao = sanphamData.filter(
    (item) => item.trang_thai === "Đang giao"
  );

  const filterDaGiao = sanphamData.filter(
    (item) => item.trang_thai === "Đã giao"
  );

  const filterDaHuy = sanphamData.filter(
    (item) => item.trang_thai === "Đã hủy"
  );

  const handleTabChange = (key) => {
    setActiveKey(key);
    setIsModalOpen(false); // Đóng modal khi chuyển tab
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
        // onChange={(key) => {
        //   setActiveKey(key);
        //   setIsModalOpen(false); // Đóng modal khi chuyển tab
        // }}
        onChange={handleTabChange}
        type="card"
        items={[
          {
            label: `Đang chờ thanh toán`,
            key: "1",
            children: (
              <div className="tab-content">
                <h1>Danh sách đơn hàng</h1>
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
                  dataSource={filterDangChoThanhToan}
                  columns={columns}
                  pagination={false}
                />
              </div>
            ),
          },
          {
            label: `Đang chờ xử lý`,
            key: "2",
            children: (
              <div className="tab-content">
                <h1>Danh sách đơn hàng</h1>
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
                  dataSource={filterDangChoXuLy}
                  columns={columns}
                  pagination={false}
                />
              </div>
            ),
          },
          {
            label: `Đã xác nhận`,
            key: "3",
            children: (
              <div className="tab-content">
                <h1>Danh sách đơn hàng</h1>
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
                  dataSource={filterDaXacNhan}
                  columns={columns}
                  pagination={false}
                />
              </div>
            ),
          },
          {
            label: `Đang giao`,
            key: "4",
            children: (
              <div className="tab-content">
                <h1>Danh sách đơn hàng</h1>
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
                  dataSource={filterDangGiao}
                  columns={columns}
                  pagination={false}
                />
              </div>
            ),
          },
          {
            label: `Đã giao`,
            key: "5",
            children: (
              <div className="tab-content">
                <h1>Danh sách đơn hàng</h1>
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
                  dataSource={filterDaGiao}
                  columns={columns}
                  pagination={false}
                />
              </div>
            ),
          },
          {
            label: `Đã hủy`,
            key: "6",
            children: (
              <div className="tab-content">
                <h1>Danh sách đơn hàng</h1>
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
                  dataSource={filterDaHuy}
                  columns={columns}
                  pagination={false}
                />
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default QuanLyDonHang;
