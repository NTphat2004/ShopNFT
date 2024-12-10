import { Card, Image, Row, Col, Select, Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

const BestSeller = () => {
  const [listSanPham, setListSanPham] = useState([]);
  const [thang, setThang] = useState(10); // Tháng mặc định là 10
  const [nam, setNam] = useState(2024); // Năm mặc định là 2024

  const getBestSeller = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/list/bestSeller/dashboard?thang=${thang}&nam=${nam}`
      );
      setListSanPham(res.data);
      console.log("Dữ liệu nè ní: ", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBestSeller();
  }, [thang, nam]); // Gọi lại API khi thay đổi tháng hoặc năm

  return (
    <div style={{ padding: "20px", fontFamily: "'Poppins', sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#444" }}>
        🌟 TOP 10 Best Sellers 🌟
      </h2>

      {/* Chọn tháng và năm */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <Select
          value={thang}
          onChange={(value) => setThang(value)}
          style={{ width: 120, marginRight: "10px" }}
        >
          {[...Array(12)].map((_, i) => (
            <Select.Option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </Select.Option>
          ))}
        </Select>

        <Select
          value={nam}
          onChange={(value) => setNam(value)}
          style={{ width: 120 }}
        >
          {["2022", "2023", "2024", "2025"].map((year) => (
            <Select.Option key={year} value={parseInt(year)}>
              {year}
            </Select.Option>
          ))}
        </Select>

        <Button
          onClick={getBestSeller}
          type="primary"
          style={{ marginLeft: "20px" }}
        >
          Tìm kiếm
        </Button>
      </div>

      <Row gutter={[16, 16]} justify="center">
        {listSanPham.map((item, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={8}>
            <Card
              hoverable
              style={{
                width: "100%",
                textAlign: "center",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              bodyStyle={{
                padding: "15px",
                background: "#fff",
              }}
              onHover={() => console.log(`Hovered on ${item.tenSanPham}`)}
            >
              <Image
                width="100%"
                height="200px"
                src={`http://localhost:8080/images/${item.tenHinh}`}
                style={{
                  borderRadius: "10px 10px 0 0",
                  objectFit: "cover",
                  marginBottom: "15px",
                }}
                alt={item.tenHinh}
              />
              <h3 style={{ color: "#2c3e50", fontWeight: "600" }}>
                {item.tenSanPham}
              </h3>
              <p
                style={{
                  color: "#e74c3c",
                  fontWeight: "500",
                  fontSize: "26px",
                }}
              >
                {item.giaGoc.toLocaleString()} VND
              </p>
              <p
                style={{
                  color: "#e74c3c",
                  fontWeight: "500",
                  fontSize: "26px",
                }}
              >
                Đã bán: {item.tongSoLuong.toLocaleString()} cái
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BestSeller;
