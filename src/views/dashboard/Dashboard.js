import { Grid, Box } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";

// components
import SalesOverview from "./components/SalesOverview";
import YearlyBreakup from "./components/YearlyBreakup";
// import RecentTransactions from "./components/RecentTransactions";
// import ProductPerformance from "./components/ProductPerformance";
// import Blog from "./components/Blog";
import MonthlyEarnings from "./components/MonthlyEarnings";
import { Navigate } from "react-router-dom";
import KhachDatDon from "./components/KhachDatDon";
import LoiNhuan from "./components/LoiNhuan";
import TrangThaiDonHang from "./components/TrangThaiDonHang";
import "../../styles/trangthaidonhang.css";
import DonHang from "./components/DonHang";
import DoanhThuDateToDate from "./components/DoanhThuDateToDate";

const Dashboard = () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          {/* Phần tử hang1 nằm chung 1 hàng ngang */}
          <Grid item xs={12} lg={6}>
            <Grid container spacing={3}>
              <Grid item xs={6} className="hang1">
                <DonHang />
              </Grid>
              <Grid item xs={6} className="hang1">
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>

          {/* Phần tử hang2 nằm chung 1 hàng ngang */}
          <Grid item xs={12} lg={6}>
            <Grid container spacing={3}>
              <Grid item xs={6} className="hang2">
                <KhachDatDon />
              </Grid>
              <Grid item xs={6} className="hang2">
                <LoiNhuan />
              </Grid>
            </Grid>
          </Grid>

          {/* Hàng riêng cho SalesOverview */}
          <Grid item xs={12} lg={12} className="hang3">
            <SalesOverview />
          </Grid> 

          <Grid item xs={12} lg={12} className="hang4">
            <DoanhThuDateToDate />
          </Grid>

          {/* Hàng riêng cho TrangThaiDonHang */}
          <Grid item xs={12} lg={12} className="hang4">
            <TrangThaiDonHang />
          </Grid> 
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
