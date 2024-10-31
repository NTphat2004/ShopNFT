import { Tabs, Select, Table } from "antd"; // Thêm Table từ antd
import "../../styles/Quanlykho.css";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

const Sanpham = () => {
  const [sanphamData, setSanphamData] = useState([]);
  const [activeKey, setActiveKey] = useState("1");
  const [hoatDong, setHoatDong] = useState("Hoạt động");
  const [selectedProduct, setSelectedProduct] = useState({
    san_phamId: "",
    ten_san_pham: "",
    gia_goc: "",
    gia_km: "",
    mo_ta: "",
    luot_mua: "",
    phantram_GG: "",
    han_gg: "",
    hoat_dong: "",
  });

  const fetchsanphamData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/listSanPham");
      const data = await response.json();
      console.log("Dữ liệu là: ", data);
      const formattedData = data.map((item) => ({
        key: item.san_phamId,
        san_phamId: item.san_phamId,
        ten_san_pham: item.ten_san_pham,
        gia_goc: item.gia_goc,
        gia_km: item.gia_km,
        mo_ta: item.mo_ta,
        luot_mua: item.luot_mua,
        phantram_GG: item.phantram_GG,
        han_gg: item.han_gg,
        hoat_dong: item.hoat_dong,
      }));
      setSanphamData(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu voucher:", error);
    }
  };

  useEffect(() => {
    fetchsanphamData();
  }, []);
  const handleEditClick = async (record) => {
    console.log("Record data: ", record);
    try {
      const response = await fetch(
        `http://localhost:8080/api/edit/sanpham/${record.san_phamId}`
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedProduct(data); // Đặt sản phẩm đã lấy vào state
        //console.log(data);
        setActiveKey("1");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/update/sanpham/${selectedProduct.san_phamId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedProduct), // Gửi dữ liệu sản phẩm đã cập nhật
        }
      );

      if (response.ok) {
        console.log("Cập nhật sản phẩm thành công!");
        alert("Cập nhật san pham thanh cong");
        fetchsanphamData();
      } else {
        console.error("Lỗi khi cập nhật sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu cập nhật:", error);
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
        title: "Giá bán ra",
        dataIndex: "gia_goc",
        key: "gia_goc",
      },
      {
        title: "Giá khuyến mãi",
        dataIndex: "gia_km",
        key: "gia_km",
      },
      {
        title: "Mô tả",
        dataIndex: "mo_ta",
        key: "mo_ta",
      },
      {
        title: "Lượt mua",
        dataIndex: "luot_mua",
        key: "luot_mua",
      },
      {
        title: "Phần trăm giảm giá",
        dataIndex: "phantram_GG",
        key: "phantram_GG",
      },
      {
        title: "Hạn giảm giá",
        dataIndex: "han_gg",
        key: "han_gg",
      },
      {
        title: "Hoạt động",
        dataIndex: "hoat_dong",
        key: "hoat_dong",
      },
      {
        title: "Hành động",
        dataIndex: "hang_dong",
        key: "hanh_dong",
        render: (text, record) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <EditOutlined
              style={{ cursor: "pointer", color: "#1890ff" }}
              onClick={() => handleEditClick(record)}
            />
            {record.hoat_dong !== "Hoạt động" && <DeleteOutlined />}
          </div>
        ),
      },
    ];
  return (
    <Tabs
      className="mx-auto"
      style={{ width: "1100px", margin: "auto" }}
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
                  <label htmlFor="productCode">Mã sản phẩm</label>
                  <input
                    type="text"
                    id="san_phamId"
                    className="form-control"
                    value={selectedProduct.san_phamId}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productName">Tên sản phẩm</label>
                  <input
                    type="text"
                    id="ten_san_pham"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="createDate">Giá bán ra</label>
                  <input type="number" id="gia_goc" className="form-control" />
                </div>
              </div>

              <div className="input-container">
                <div className="form-group">
                  <label htmlFor="productQuantity">Giá khuyến mãi</label>
                  <input type="number" id="gia_km" className="form-control" />
                </div>
                <div className="form-group">
                  <label htmlFor="productQuantity">Mô tả</label>
                  <input type="number" id="mo_ta" className="form-control" />
                </div>
                <div className="form-group">
                  <label htmlFor="productQuantity">Phần trăm giảm giá</label>
                  <input
                    type="number"
                    id="phantram_GG"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="input-container">
                <div className="form-group">
                  <label htmlFor="productQuantity">Hạn giảm giá</label>
                  <input type="date" id="han_gg" className="form-control" />
                </div>
                <div className="form-group">
                  <label htmlFor="warehouseStatus">Hoạt động</label>
                  <Select
                    value={selectedProduct.hoat_dong || "Hoạt động"}
                    onChange={(value) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        hoat_dong: value,
                      })
                    }
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      height: "40px",
                    }}
                    options={[
                      { value: "Hoạt động", label: "Hoạt động" },
                      { value: "Ngừng hoạt động", label: "Ngừng hoạt động" },
                    ]}
                  />
                </div>
                <div className="form-group">
                  <button className="button" onClick={handleUpdate}>
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          ),
        },
        {
          label: `Danh sách sản phẩm`,
          key: "2",
          children: (
            <div className="tab-content">
              <h1>Danh sách sản phẩm</h1>
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
                dataSource={sanphamData}
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

export default Sanpham;
