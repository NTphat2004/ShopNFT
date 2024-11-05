import { Tabs, Select, Table } from "antd"; // Thêm Table từ antd
import "../../styles/Quanlykho.css";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { get } from "jquery";

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
    phantram_GG: "",
    han_gg: "",
    hoat_dong: "",
  });
  const [isDisabled, setIsDisabled] = useState(false);

  const updateGiaKhuyenMaiHetHan = async (products) => {
    const currentDate = new Date();

    products.forEach((product) => {
      const hanGg = new Date(product.han_gg);
      if (hanGg < currentDate) {
        product.gia_km = 0;
        product.phantram_GG = 0;
      }
    });
  }

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
      updateGiaKhuyenMaiHetHan(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu voucher:", error);
    }
  };

  const sanPhamInput = async () => {
    const sanPhamKho = {
      san_phamId: document.getElementById("san_phamId").value,
      ten_san_pham: document.getElementById("ten_san_pham").value,
      gia_goc: parseFloat(document.getElementById("gia_goc").value),
      gia_km: parseFloat(document.getElementById("gia_km").value),
      mo_ta: document.getElementById("mo_ta").value,
      phantram_GG: parseInt(document.getElementById("phantram_GG").value),
      han_gg: document.getElementById("han_gg").value,
      hoat_dong: hoatDong,
    };
    //return sanPhamKho;
    const formBody = Object.keys(sanPhamKho)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(sanPhamKho[key]))
      .join('&');

    return formBody;
  }

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
        console.log(data);
        setActiveKey("1");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    }
    if(record.hoat_dong !== "Hoạt động"){ 
      setIsDisabled(true);
    }
    else{
      setIsDisabled(false);
    }
  };

  const handleUpdate = async () => {
    const sanPhamData = await sanPhamInput();
    console.log("Dữ liệu khi nhấn update: ", sanPhamData);
    try {
      const response = await fetch(
        `http://localhost:8080/api/update/sanpham/${selectedProduct.san_phamId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          //body: JSON.stringify(selectedProduct),
          body: sanPhamData, // Gửi dữ liệu sản phẩm đã cập nhật
        }
      );

      if (response.ok) {
        console.log("Cập nhật sản phẩm thành công!");
        alert("Cập nhật san pham thanh cong");
        fetchsanphamData();
        setSelectedProduct("");
      } else {
        const errorData = await response.json(); // Lấy dữ liệu lỗi từ phản hồi
        console.error("Lỗi khi cập nhật sản phẩm:", errorData.message || errorData);
        alert(`Lỗi khi cập nhật sản phẩm: ${errorData.message || "Không xác định"}`);
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

  const filteredSanPhamData = sanphamData.filter((item) => item.hoat_dong === "Hoạt động");

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
                    onChange={(e) => {
                      setSelectedProduct((prev) => ({
                        ...prev,
                        san_phamId: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productName">Tên sản phẩm</label>
                  <input
                    type="text"
                    id="ten_san_pham"
                    className="form-control"
                    value={selectedProduct.ten_san_pham || ""}
                    onChange={(e) => {
                      setSelectedProduct((prev) => ({
                        ...prev,
                        ten_san_pham: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="createDate">Giá bán ra</label>
                  <input
                    type="number"
                    id="gia_goc"
                    className="form-control"
                    value={selectedProduct.gia_goc || ""}
                    onChange={(e) =>
                      setSelectedProduct((prev) => ({
                        ...prev,
                        gia_goc: e.target.value || 0,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="input-container">
                <div className="form-group">
                  <label htmlFor="productQuantity">Giá khuyến mãi</label>
                  <input
                    type="number"
                    id="gia_km"
                    className="form-control"
                    disabled
                    value={selectedProduct.gia_km || ""}
                    // onChange={(e) =>
                    //   setSelectedProduct((prev) => ({
                    //     ...prev,
                    //     gia_km: e.target.value,
                    //   }))
                    // }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productQuantity">Mô tả</label>
                  <input
                    type="text"
                    id="mo_ta"
                    className="form-control"
                    value={selectedProduct.mo_ta || ""}
                    onChange={(e) =>
                      setSelectedProduct((prev) => ({
                      ...prev,
                      mo_ta: e.target.value,
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productQuantity">Phần trăm giảm giá</label>
                  <input
                    type="number"
                    id="phantram_GG"
                    className="form-control"
                    value={selectedProduct.phantram_GG || 0}
                    // onChange={(e) =>
                    //   setSelectedProduct((prev) => ({
                    //   ...prev,
                    //   phantram_GG: e.target.value,
                    // }))}
                    onChange={(e) => {
                      const discountPercent = parseFloat(e.target.value) || 0;
                      setSelectedProduct((prev) => {
                        const originalPrice = prev.gia_goc || 0;
                        const discountPrice = originalPrice - (originalPrice * discountPercent) / 100;
                        return {
                          ...prev,
                          phantram_GG: discountPercent,
                          gia_km: discountPrice,
                        };
                      });
                    }}
                  />
                </div>
              </div>

              <div className="input-container">
                <div className="form-group">
                  <label htmlFor="productQuantity">Hạn giảm giá</label>
                  <input
                    type="date"
                    id="han_gg"
                    className="form-control"
                    value={selectedProduct.han_gg || ""}
                    onChange={(e) =>
                      setSelectedProduct((prev) => ({
                        ...prev,
                        han_gg: e.target.value,
                      }))
                    }
                  />
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
                dataSource={filteredSanPhamData}
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
