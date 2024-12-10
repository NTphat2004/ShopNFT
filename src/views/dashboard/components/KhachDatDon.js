import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Fab } from "@mui/material";
import { IconUser } from "@tabler/icons-react";
import DashboardCard from "../../../components/shared/DashboardCard";

const KhachDatDon = () => {
  // chart color
  const theme = useTheme();
  const errorlight = "#fdede8";
  const currentMonth = new Date().getMonth() + 1;
  const [khachhang, setKhachHang] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/api/getKhachHang")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setKhachHang(data || 0);
      });
  }, []);

  return (
    <DashboardCard
      title={`Khách hàng tháng ${currentMonth}`}
      action={
        <Fab color="secondary" size="medium" sx={{ color: "#ffffff" }}>
          <IconUser width={24} />
        </Fab>
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {khachhang}
        </Typography>
      </>
    </DashboardCard>
  );
};

export default KhachDatDon;
