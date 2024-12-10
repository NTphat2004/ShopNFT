import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import DashboardCard from "../../../components/shared/DashboardCard";
import { Select } from "antd"; // Import Select từ Ant Design

const { Option } = Select;

const TrangThaiDonHang = () => {
  const [statusData, setStatusData] = useState({}); // Dữ liệu trạng thái đơn hàng
  //const [month, setMonth] = useState(new Date().getMonth() + 1); // Tháng hiện tại
  //const [year, setYear] = useState(new Date().getFullYear()); // Năm hiện tại
  const [month, setMonth] = useState(9); // Mặc định tháng 9
  const [year, setYear] = useState(2024);
  // Gọi API để lấy trạng thái đơn hàng
  useEffect(() => {
    fetchOrderStatus();
  }, [month, year]);

  const fetchOrderStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/getTrangThaiDonHang?month=${month}&year=${year}`
      );
      setStatusData(response.data || {});
    } catch (error) {
      console.error("Lỗi khi lấy trạng thái đơn hàng: ", error);
      setStatusData({});
    }
  };

  // Chuyển đổi dữ liệu cho biểu đồ
  const chartData = {
    labels: Object.keys(statusData), // Trạng thái đơn hàng
    series: Object.values(statusData), // Số lượng đơn hàng cho từng trạng thái
  };

  return (
    <DashboardCard title={`Đơn hàng tháng ${month} năm ${year}`}>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <Select
          value={month}
          onChange={(value) => setMonth(value)}
          style={{ width: 120 }}
          placeholder="Chọn tháng"
        >
          {[...Array(12).keys()].map((m) => (
            <Option key={m} value={m + 1}>
              {m + 1}
            </Option>
          ))}
        </Select>

        <Select
          value={year}
          onChange={(value) => setYear(value)}
          style={{ width: 120 }}
          placeholder="Chọn năm"
        >
          {[2020, 2021, 2022, 2023, 2024].map((y) => (
            <Option key={y} value={y}>
              {y}
            </Option>
          ))}
        </Select>
      </div>
      <Chart
        options={{
          labels: chartData.labels,
          colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
          plotOptions: {
            pie: {
              donut: {
                size: "60%",
              },
            },
          },
          tooltip: {
            theme: "light",
          },
        }}
        series={chartData.series}
        type="donut"
        height="370px"
      />
    </DashboardCard>
  );
};

export default TrangThaiDonHang;
