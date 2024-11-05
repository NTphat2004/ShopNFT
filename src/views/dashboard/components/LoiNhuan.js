import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Fab } from "@mui/material";
import { IconCurrencyCent } from "@tabler/icons-react";
import DashboardCard from "../../../components/shared/DashboardCard";

const LoiNhuan = () => {
  // chart color
  const theme = useTheme();
  const errorlight = "#fdede8";
  const currentMonth = new Date().getMonth() + 1;
  const [loinhuan, setLoiNhuan] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/api/getLoiNhuan")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLoiNhuan(data || 0);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoiNhuan(0);
      })
      ;
    
  }, []);

  return (
    <DashboardCard
      title={`Lợi nhuận tháng ${currentMonth}`}
      action={
        <Fab color="secondary" size="medium" sx={{ color: "#ffffff" }}>
          <IconCurrencyCent width={24} />
        </Fab>
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {loinhuan} VND
        </Typography>
      </>
    </DashboardCard>
  );
};

export default LoiNhuan;
