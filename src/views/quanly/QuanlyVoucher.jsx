import { Tabs, Select, Table, Upload, Image, Button } from "antd"; // Thêm Table từ antd
import "../../styles/QuanLyVoucher.css";
import {
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { data } from "jquery";
import * as XLSX from "xlsx";
//import "../../assets/images"

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

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Voucher = () => {
  const [voucherData, setVoucherData] = useState([]);
  const [hoatDong, setHoatDong] = useState("Hoạt động");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [activeKey, setActiveKey] = useState("1");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChangeImage = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setSelectedVoucher((prev) => ({
      ...prev,
      hinh_anh: newFileList.map((file) =>
        file.response ? file.response.url : file.url
      ), // Lưu URL hình ảnh
    }));
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  const handleEdit = (voucher) => {
    setSelectedVoucher(voucher);
    setActiveKey("1");

    // Chuyển đổi 'hinh_anh' thành mảng nếu cần
    const images = Array.isArray(voucher.hinh_anh)
      ? voucher.hinh_anh
      : [voucher.hinh_anh];

    // Tạo fileList từ danh sách hình ảnh
    const initialFileList = images.map((image) => ({
      uid: image, // ID duy nhất
      name: image ? image.split("/").pop() : "unknown.png", // Tên file
      status: "done", // Đã tải xong
      url: image.startsWith("http")
        ? image // Nếu là URL tuyệt đối, dùng luôn
        : `http://localhost:8080/images/${image}`, // URL đầy đủ
    }));

    setFileList(initialFileList);
    console.log(voucher);
  };

  const handleChange = (value) => {
    setHoatDong(value); // Cập nhật trạng thái hoạt động
  };

  const fetchVoucherData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/listVoucher");
      const data = await response.json();
      console.log("Dữ liệu là: ", data);
      const formattedData = data.map((item) => ({
        key: item.voucherID,
        voucherID: item.voucherID,
        dieu_kien: item.dieu_kien,
        don_hang_toi_thieu: item.don_hang_toi_thieu,
        han_su_dung: item.han_su_dung,
        hoat_dong: item.hoat_dong,
        so_luong: item.so_luong,
        so_luot_SD: item.so_luot_SD,
        so_tien_giam: item.so_tien_giam,
        hinh_anh: item.hinh_anh,
      }));
      setVoucherData(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu voucher:", error);
    }
  };

  useEffect(() => {
    fetchVoucherData();
  }, []);

  let voucher = {};
  const voucherChung = () => {
    voucher = {
      voucherID: document.getElementById("voucherID").value,
      dieu_kien: document.getElementById("dieu_kien").value,
      don_hang_toi_thieu:
        parseInt(document.getElementById("don_hang_toi_thieu").value) || 0,
      han_su_dung: document.getElementById("han_su_dung").value,
      hoat_dong: hoatDong,
      so_luong: parseInt(document.getElementById("so_luong").value) || 0,
      so_luot_SD: parseInt(document.getElementById("so_luot_SD").value) || 0,
      so_tien_giam:
        parseInt(document.getElementById("so_tien_giam").value) || 0,
    };
  };

  const handleSave = async () => {
    voucherChung();

    const formData = new FormData();
    for (const key in voucher) {
      formData.append(key, voucher[key]);
    }

    // Sử dụng ref để lấy file
    fileList.forEach((file) => {
      formData.append("hinh_anh", file.originFileObj); // Sử dụng originFileObj để lấy file thực tế
    });

    try {
      const response = await fetch("http://localhost:8080/api/voucher/add", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Voucher đã được thêm thành công:", data);
        alert("Thêm voucher thành công!");
        fetchVoucherData();
        clear();
        console.log("URL ảnh:", data.imageUrl);
        console.log(selectedVoucher);
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi thêm voucher:", response.statusText, errorData);
        alert("Thêm voucher thất bại!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleUpdate = async () => {
    voucherChung();

    const formData = new FormData();
    for (const key in voucher) {
      formData.append(key, voucher[key]);
    }

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
    document.getElementById("voucherID").value = "";
    document.getElementById("dieu_kien").value = "";
    document.getElementById("don_hang_toi_thieu").value = "";
    document.getElementById("han_su_dung").value = "";
    document.getElementById("so_luong").value = "";
    document.getElementById("so_luot_SD").value = "";
    document.getElementById("so_tien_giam").value = "";

    setSelectedVoucher(null);

    setFileList([]);
    setHoatDong("Hoạt động");
  }
  const handelClear = () => {
    clear();
  };

  const handleDeleteInput = (voucherID) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      // Gọi API xóa voucher
      deleteVoucherInput(voucherID);
    }
  };

  const handleDeleteTable = (voucherID) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      // Gọi API xóa voucher
      deleteVoucherTable(voucherID);
    }
  };

  const deleteVoucherInput = async () => {
    voucherChung();
    try {
      const response = await fetch(
        `http://localhost:8080/api/voucher/delete/${voucher.voucherID}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Voucher đã được xóa thành công!");
        fetchVoucherData();
        clear();
        // Cập nhật lại danh sách vouchers nếu cần
      } else {
        alert("Lỗi khi xóa voucher.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };
  const deleteVoucherTable = async (voucherID) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/voucher/delete/${voucherID}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Voucher đã được xóa thành công!");
        fetchVoucherData();
        // Cập nhật lại danh sách vouchers nếu cần
      } else {
        alert("Lỗi khi xóa voucher.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };
  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Mã voucher",
      dataIndex: "voucherID",
      key: "voucherID",
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
      title: "Hạn sử dụng",
      dataIndex: "han_su_dung",
      key: "han_su_dung",
    },
    {
      title: "Hoạt động",
      dataIndex: "hoat_dong",
      key: "hoat_dong",
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
      dataIndex: "hanhdong",
      key: "hanhdong",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <EditOutlined
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => handleEdit(record)}
          />
          <DeleteOutlined
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => handleDeleteTable(record.voucherID)}
          />
        </div>
      ),
    },
  ];

  // Lọc trạng thái
  const filteredVoucherData = searchStatus
    ? voucherData.filter((voucher) => voucher.hoat_dong === searchStatus)
    : voucherData; // Nếu không có trạng thái tìm kiếm, hiển thị tất cả

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
      style={{ width: "1100px", margin: "auto" }}
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
                  <label htmlFor="productCode">Mã voucher</label>
                  <input
                    type="text"
                    id="voucherID"
                    className="form-control"
                    value={selectedVoucher?.voucherID || ""}
                    onChange={(e) =>
                      setSelectedVoucher({
                        ...selectedVoucher,
                        voucherID: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productName">Điều kiện</label>
                  <input
                    type="text"
                    id="dieu_kien"
                    className="form-control"
                    value={selectedVoucher?.dieu_kien || ""}
                    onChange={(e) =>
                      setSelectedVoucher({
                        ...selectedVoucher,
                        dieu_kien: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Đơn hàng tối thiểu</label>
                  <input
                    type="number"
                    id="don_hang_toi_thieu"
                    className="form-control"
                    value={selectedVoucher?.don_hang_toi_thieu || ""}
                    onChange={(e) =>
                      setSelectedVoucher({
                        ...selectedVoucher,
                        don_hang_toi_thieu: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="input-container">
                <div className="form-group">
                  <label htmlFor="createDate">Hạn sử dụng</label>
                  <input
                    type="date"
                    id="han_su_dung"
                    className="form-control"
                    value={selectedVoucher?.han_su_dung || ""}
                    onChange={(e) =>
                      setSelectedVoucher({
                        ...selectedVoucher,
                        han_su_dung: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="warehouseStatus">Hoạt động</label>
                  <Select
                    value={hoatDong}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      height: "40px",
                    }}
                    onChange={handleChange}
                    options={[
                      { value: "Hoạt động", label: "Hoạt động" },
                      { value: "Ngừng hoạt động", label: "Ngừng hoạt động" },
                    ]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="so_luong">Số lượng</label>
                  <input
                    type="number"
                    id="so_luong"
                    className="form-control"
                    value={selectedVoucher?.so_luong || ""}
                    onChange={(e) =>
                      setSelectedVoucher({
                        ...selectedVoucher,
                        so_luong: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="input-container">
                <div className="form-group">
                  <label htmlFor="so">Số lượt sử dụng</label>
                  <input
                    type="number"
                    id="so_luot_SD"
                    className="form-control"
                    value={selectedVoucher?.so_luot_SD || ""}
                    onChange={(e) =>
                      setSelectedVoucher({
                        ...selectedVoucher,
                        so_luot_SD: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productQuantity">Số tiền giảm giá</label>
                  <input
                    type="number"
                    id="so_tien_giam"
                    className="form-control"
                    value={selectedVoucher?.so_tien_giam || ""}
                    onChange={(e) =>
                      setSelectedVoucher({
                        ...selectedVoucher,
                        so_tien_giam: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <Upload
                action="http://localhost:8080/images/"
                listType="picture-card"
                fileList={fileList}
                value={selectedVoucher?.hinh_anh || ""}
                onPreview={handlePreview}
                onChange={handleChangeImage}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>

              <div className="input-container">
                <div className="form-group">
                  <button className="button" onClick={handleSave}>
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
                    onClick={() => handleDeleteInput(voucher.voucherID)}
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
        },
        {
          label: `Danh sách voucher`,
          key: "2",
          children: (
            <div className="tab-content">
              <h1>Danh sách voucher</h1>
              <button
                style={{
                  marginBottom: "20px",
                  float: "right",
                  display: "flex",
                  alignItems: "center",
                }}
                className="buttonexcel"
                onClick={exportToExcel}
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
                dataSource={filteredVoucherData}
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

export default Voucher;
