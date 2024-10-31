import { Tabs, Select, Table, Upload, Image, Button } from "antd"; // Thêm Table từ antd
import "../../styles/QuanLyVoucher.css";
import {
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { data, get } from "jquery";
import * as XLSX from "xlsx";
//import "../../assets/images"

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
  const [selectedVoucher, setSelectedVoucher] = useState({
    hoat_dong: "Hoạt động",
    hanh_dong: "Thêm", // Giá trị mặc định
    ngay_tao: "",
    han_su_dung: "",
  });
  const [activeKey, setActiveKey] = useState("2");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [isAddDisabled, setIsAddDisabled] = useState(false);

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

  const handleDateChange = (e) => {
    const { id, value } = e.target;
    setSelectedVoucher((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Kiểm tra hạn sử dụng phải lớn hơn ngày tạo
    if (id === "han_su_dung" && value <= selectedVoucher.ngay_tao) {
      setErrorMessage("Hạn sử dụng không được nhỏ hơn ngày tạo");
    } else {
      setErrorMessage("");
    }
  };
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

  const handleEdit = async (voucher) => {
    //setSelectedVoucher(voucher);
    //setActiveKey("1");
    try {
      const response = await fetch(
        `http://localhost:8080/api/edit/voucher/${voucher.voucherID}`
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedVoucher(data); // Đặt sản phẩm đã lấy vào state
        //console.log(data);
        setActiveKey("1");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    }
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
    if (voucher.hoat_dong === "Hoạt động") {
      setIsDisabled(true);
      setIsAddDisabled(true);
    }
    else {
      setIsDisabled(false);
      setIsAddDisabled(true);
    }
    console.log(voucher);
  };

  const handleChange = (value) => {
    console.log("Selected option:", value); // Log để kiểm tra
    setSelectedVoucher((prev) => ({
      ...prev,
      hoat_dong: value, // Cập nhật trạng thái hoat_dong
    }));
  };

  const fetchVoucherData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/listVoucher");
      const data = await response.json();
      console.log("Dữ liệu là: ", data);
      const formattedData = data.map((item) => ({
        key: item[0], // voucherID
        voucherID: item[0],
        dieu_kien: item[1],
        don_hang_toi_thieu: item[2],
        han_su_dung: item[3],
        hinh_anh: item[4],
        hoat_dong: item[5],
        so_luong: item[6],
        so_luot_SD: item[7],
        so_tien_giam: item[8],
        trang_thai_xoa: item[9],
        hanh_dong: item[10],
        ngay_tao: item[11],
        accountID: item[12],
      }));
      setVoucherData(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu voucher:", error);
    }
  };

  useEffect(() => {
    fetchVoucherData();
    setSelectedVoucher((prev) => ({
      ...prev,
      ngay_tao: prev.ngay_tao || getCurrentDate(),
    }));

    const data = JSON.parse(localStorage.getItem("data"));
    setUserData(data);
    
    // Nếu người dùng không phải admin, tự động chuyển sang tab 1
    if (data && !data.roles.includes("Admin")) {
      setActiveKey("1");
    }
  }, []);

  let voucher = {};
  const voucherChung = () => {
    voucher = {
      voucherID: document.getElementById("voucherID").value,
      dieu_kien: document.getElementById("dieu_kien").value,
      don_hang_toi_thieu:
        parseInt(document.getElementById("don_hang_toi_thieu").value) || 0,
      ngay_tao: document.getElementById("ngay_tao").value,
      han_su_dung: document.getElementById("han_su_dung").value,
      hoat_dong: selectedVoucher.hoat_dong,
      so_luong: parseInt(document.getElementById("so_luong").value) || 0,
     // so_luot_SD: parseInt(document.getElementById("so_luot_SD").value) || 0,
      so_tien_giam:
        parseInt(document.getElementById("so_tien_giam").value) || 0,
    };
  };

  const handleSave = async (e) => {
    e.preventDefault();
    voucherChung();

    if (errorMessage) {
      alert("Không thể thêm voucher. Vui lòng sửa lỗi trước.");
      return; // Dừng thực hiện nếu có lỗi
    }

    const formData = new FormData();
    for (const key in voucher) {
      formData.append(key, voucher[key]);
    }
    formData.append("hanh_dong", "Thêm");
    const accountData = JSON.parse(localStorage.getItem("data")); // Giả sử bạn lưu dữ liệu trong khóa "data"
    if (accountData && accountData.accountID) {
      formData.append("accountID", accountData.accountID);
      console.log(accountData.accountID); // Thêm accountID vào formData
    } else {
      console.error("Không tìm thấy accountID trong localStorage");
      alert("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.");
      return; // Thoát hàm nếu không tìm thấy accountID
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
        console.log(selectedVoucher);
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi thêm voucher:", response.statusText, errorData);
        alert(errorData.message);
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

  const handleDeleteToGarbageTable = async (voucherID) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/voucher/deleteToGarbage/${voucherID}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Voucher không biên xóa:", data);
        alert("Xóa voucher thành công!");
        fetchVoucherData();
        clear();
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi xóa voucher:", response.statusText, errorData);
        alert("Xóa voucher thể bắt động!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleDeleteFromGarbageTable = async (voucherID) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/voucher/deleteFromGarbage/${voucherID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hanh_dong: "Xóa",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Voucher không biên xóa:", data);
        alert("Xóa voucher thành công!");
        fetchVoucherData();
        clear();
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi xóa voucher:", response.statusText, errorData);
        alert("Xóa voucher thể bắt động!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleReloadToGarbageTable = async (voucherID) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/voucher/reloadFromGarbage/${voucherID}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Voucher không biên xóa:", data);
        alert("Khôi phục voucher thành công!");
        fetchVoucherData();
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi xóa voucher:", response.statusText, errorData);
        alert("Xóa voucher thể bắt động!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleDeleteToGarbageInput = async () => {
    voucherChung();
    try {
      const response = await fetch(
        `http://localhost:8080/api/voucher/deleteToGarbage/${voucher.voucherID}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Voucher không biên xóa:", data);
        alert("Xóa voucher thành công");
        fetchVoucherData();
        clear();
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi xóa voucher:", response.statusText, errorData);
        alert("Xóa voucher thể bắt động!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const clear = () => {
    document.getElementById("voucherID").value = "";
    document.getElementById("dieu_kien").value = "";
    document.getElementById("don_hang_toi_thieu").value = "";
    document.getElementById("ngay_tao").value = getCurrentDate();
    document.getElementById("han_su_dung").value = "";
    document.getElementById("so_luong").value = "";
    //document.getElementById("so_luot_SD").value = "";
    document.getElementById("so_tien_giam").value = "";

    setSelectedVoucher(null);
    setIsAddDisabled(false);
    setFileList([]);
    setSelectedVoucher({
      hoat_dong: "Hoạt động",
      ngay_tao: getCurrentDate(), // Giá trị mặc định
    });
  };
  const handelClear = () => {
    clear();
  };

  const handleDeleteInput = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      // Gọi API xóa voucher
      //deleteVoucherInput(voucherID);
      handleDeleteToGarbageInput();
    }
  };

  const handleDeleteTable = (voucherID) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      // Gọi API xóa voucher
      //deleteVoucherTable(voucherID);
      handleDeleteToGarbageTable(voucherID);
    }
  };

  const handleDeleteTableFromGarbage = (voucherID) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      // Gọi API xóa voucher
      //deleteVoucherTable(voucherID);
      handleDeleteFromGarbageTable(voucherID);
    }
  };

  const handleReloadTable = (voucherID) => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục voucher này?")) {
      // Gọi API xóa voucher
      //deleteVoucherTable(voucherID);
      handleReloadToGarbageTable(voucherID);
    }
  };

  // const deleteVoucherInput = async () => {
  //   voucherChung();
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/api/voucher/delete/${voucher.voucherID}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );

  //     if (response.ok) {
  //       alert("Voucher đã được xóa thành công!");
  //       fetchVoucherData();
  //       clear();
  //       // Cập nhật lại danh sách vouchers nếu cần
  //     } else {
  //       alert("Lỗi khi xóa voucher.");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi gọi API:", error);
  //   }
  // };
  const deleteVoucherTableFromGarbage = async (voucherID) => {
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
  let columns = [
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
      title: "Người tạo",
      dataIndex: "accountID",
      key: "accountID",
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
          {record.hoat_dong !== "Hoạt động" && (
            <DeleteOutlined
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDeleteTable(record.voucherID)}
            />
          )}
        </div>
      ),
    },
  ];
  if (isAdmin) {
    columns = columns.filter(col => col.key !== "hanhdong"); // Lọc cột "hanhdong" nếu là admin
  }
 
  let columnsGarbage = [
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
      title: "Trạng thái xóa",
      dataIndex: "trang_thai_xoa",
      key: "trang_thai_xoa",
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
          <ReloadOutlined
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => handleReloadTable(record.voucherID)}
          />
          <DeleteOutlined
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => handleDeleteTableFromGarbage(record.voucherID)}
          />
        </div>
      ),
    },
  ];
  if (isAdmin) {
    columnsGarbage = columnsGarbage.filter(col => col.key !== "hanhdong"); // Lọc cột "hanhdong" nếu là admin
  }
  const columnsNhatKyHoatDong = [
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

  // Lọc trạng thái
  /*const filteredVoucherData = searchStatus
    ? voucherData.filter((voucher) => voucher.hoat_dong === searchStatus)
    : voucherData; // Nếu không có trạng thái tìm kiếm, hiển thị tất cả*/

  // Lọc trạng thái hoạt động và chỉ hiển thị những voucher chưa xóa
  const filteredVoucherData = voucherData.filter((voucher) => {
    const isNotDeleted =
      voucher.trang_thai_xoa === null || voucher.trang_thai_xoa === undefined; // Kiểm tra trạng thái xóa là rỗng

    // Nếu có trạng thái tìm kiếm, lọc theo trạng thái hoạt động
    if (searchStatus && searchStatus !== "Tất cả") {
      return voucher.hoat_dong === searchStatus && isNotDeleted;
    }

    // Nếu không có trạng thái tìm kiếm hoặc tìm kiếm là "Tất cả", chỉ hiển thị các voucher chưa xóa
    return isNotDeleted;
  });

  const filteredVoucherDataGarbage = voucherData.filter((voucher) => {
    return voucher.trang_thai_xoa !== null && voucher.hanh_dong !== 'Xóa';
  });
  console.log("Thùng rác", filteredVoucherDataGarbage);

  const filteredVoucherDataNhatKy = voucherData.filter((voucher) => {
    return voucher.hanh_dong !== null;
  });
  console.log("Nhật ký", filteredVoucherDataNhatKy);

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
                  <label htmlFor="productCode">Mã voucher</label>
                  <input
                    type="text"
                    id="voucherID"
                    className="form-control"
                    disabled={isDisabled}
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
                    disabled={isDisabled}
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
                    disabled={isDisabled}
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
                  <label htmlFor="createDate">Ngày tạo</label>
                  <input
                    type="date"
                    id="ngay_tao"
                    className="form-control"
                    disabled={isDisabled}
                    value={selectedVoucher?.ngay_tao || ""}
                    // onChange={(e) =>
                    //   setSelectedVoucher({
                    //     ...selectedVoucher,
                    //     ngay_tao: e.target.value,
                    //   })
                    // }
                    onChange={handleDateChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="createDate">Hạn sử dụng</label>
                  <input
                    type="date"
                    id="han_su_dung"
                    className="form-control"
                    disabled={isDisabled}
                    value={selectedVoucher?.han_su_dung || ""}
                    // onChange={(e) =>
                    //   setSelectedVoucher({
                    //     ...selectedVoucher,
                    //     han_su_dung: e.target.value,
                    //   })
                    // }
                    onChange={handleDateChange}
                  />
                  {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="warehouseStatus">Hoạt động</label>
                  <Select
                    value={selectedVoucher.hoat_dong || "Hoạt động"} // Đồng bộ với state selectedVoucher
                    onChange={(value) =>
                      setSelectedVoucher({
                        ...selectedVoucher,
                        hoat_dong: value, // Cập nhật đúng giá trị vào state
                      })
                    }
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
                  <label htmlFor="so_luong">Số lượng</label>
                  <input
                    type="number"
                    id="so_luong"
                    className="form-control"
                    disabled={isDisabled}
                    value={selectedVoucher?.so_luong || ""}
                    onChange={(e) =>
                      setSelectedVoucher({
                        ...selectedVoucher,
                        so_luong: e.target.value,
                      })
                    }
                  />
                </div>
                {/* <div className="form-group">
                  <label htmlFor="so">Số lượt sử dụng</label>
                  <input
                    type="number"
                    id="so_luot_SD"
                    className="form-control"
                    disabled={isDisabled}
                    value={selectedVoucher?.so_luot_SD || ""}
                    onChange={(e) =>
                      setSelectedVoucher({
                        ...selectedVoucher,
                        so_luot_SD: e.target.value,
                      })
                    }
                  />
                </div> */}
                <div className="form-group">
                  <label htmlFor="productQuantity">Số tiền giảm giá</label>
                  <input
                    type="number"
                    id="so_tien_giam"
                    className="form-control"
                    disabled={isDisabled}
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
                disabled={isDisabled}
                fileList={fileList}
                value={selectedVoucher?.hinh_anh || ""}
                onPreview={handlePreview}
                onChange={handleChangeImage}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              <div className="form-group">
                <input
                  type="hidden"
                  id="so_tien_giam"
                  className="form-control"
                  disabled={isDisabled}
                  value={selectedVoucher?.hanh_dong || "Thêm"}
                  onChange={(e) =>
                    setSelectedVoucher({
                      ...selectedVoucher,
                      hanh_dong: e.target.value,
                    })
                  }
                />
              </div>
              <div className="input-container">
                <div className="form-group">
                  <button
                    className="button"
                    id="themvoucher"
                    disabled={isAddDisabled}
                    onClick={handleSave}
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
                    onClick={handleDeleteInput}
                    disabled={isDisabled}
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
          ),disabled: isAdmin,
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
                disabled={isAdmin}
              >
                <ExportOutlined style={{ marginRight: "8px" }}  /> Xuất file
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
        {
          label: "Lịch sử xóa",
          key: "3",
          children: (
            <div className="tab-content">
              <h1>Lịch sử xóa</h1>
              <Table
                dataSource={filteredVoucherDataGarbage}
                columns={columnsGarbage}
                pagination={false}
              />
            </div>
          ),
        },
        {
          label: "Nhật ký hoạt động",
          key: "4",
          children: (
            <div className="tab-content">
              <h1>Nhật kí hoạt động</h1>
              <Table
                dataSource={filteredVoucherDataNhatKy}
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

export default Voucher;
