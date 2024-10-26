import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar, Fab } from "@mui/material";
import { IconArrowUpLeft, IconShoppingCart  } from "@tabler/icons-react";

import DashboardCard from "../../../components/shared/DashboardCard";

const YearlyBreakup = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = "#ecf2ff";
  const successlight = theme.palette.success.light;
  const [totalOrders, setTotalOrders] = useState(0);

  const currentMonth = new Date().getMonth() + 1;
  useEffect(() => {
    fetch("http://localhost:8080/api/getTotal")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTotalOrders(data);
      });
  });

  return (
    <DashboardCard title={`Đơn hàng tháng ${currentMonth}`}
    action={
      <Fab color="secondary" size="medium" sx={{color: '#ffffff'}}>
        <IconShoppingCart width={24} />
      </Fab>
    }>
      <Grid container spacing={5}>
        {/* column */}
        <Grid item xs={7} sm={7}>
          <Typography variant="h3" fontWeight="700">
            {totalOrders}
          </Typography>
        </Grid>
        {/* column */}
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
