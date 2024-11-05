import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import "../../../styles/DoanhThuDateToDate.css"; // Đảm bảo tạo file CSS này

const DoanhThuDateToDate = () => {
  const [doanhThuData, setDoanhThuData] = useState([]);
  const [startDate, setStartDate] = useState("2024-09-01");
  const [endDate, setEndDate] = useState("2024-09-30");

  const fetchDoanhThu = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/getDoanhThuDateToDate",
        {
          params: {
            startDate,
            endDate,
            trangThai: "Đã giao",
          },
        }
      );
      console.log("Doanh thu là:", response.data);

      if (Array.isArray(response.data)) {
        setDoanhThuData(response.data);
      } else {
        console.error("Dữ liệu không đúng định dạng:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy doanh thu:", error);
    }
  };

  useEffect(() => {
    fetchDoanhThu();
  }, [startDate, endDate]);

  return (
    <div className="doanh-thu-container">
      <h2>Doanh Thu Theo Ngày Trong Tháng</h2>
      <div className="date-pickers">
        <label>
          Chọn từ ngày:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Chọn đến ngày:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={doanhThuData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="doanhThu" name="Doanh Thu Theo Ngày Trong Tháng" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoanhThuDateToDate;
