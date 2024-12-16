import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "../layouts/full/shared/loadable/Loadable";
import Newlogin1 from "../views/quanly/Newlogin1";
import Thongtincanhan from "../views/quanly/Thongtincanhan";
import Voucher from "../views/quanly/QuanlyVoucher";
import Sanpham from "../views/quanly/QuanlySP";
import Thuonghieu from "../views/quanly/Thuonghieu";
import Naptien from "../views/quanly/Naptien";
import QuanLyDonHang from "../views/quanly/QuanLyDonHang";
import NhapHang from "../views/quanly/QuanLyNhapHang";
import Kho from "../views/quanly/QuanLyKho";
import DanhGia from "../views/quanly/QuanLyDanhGia";
import QuanLyShipper from "../views/quanly/QuanLyShipper";
import UploadFile from "../views/quanly/UploadFile";
import CrudCategory from "../views/quanly/CrudCategory";
import Baidang from "../views/quanly/Baidang";
import Settings from "../views/quanly/Settings";
import CRUDAnh from "../views/quanly/CRUDAnh";
import UserManagement from "../views/quanly/UserManagement";
import BannerManager from "../views/quanly/BannerManager";
import SupplierManagement from "../views/quanly/SupplierManagement";
import CrudPOPUP from "../views/quanly/CrudPOPUP";
import Respone from "../views/quanly/Respone";
import { patch } from "@mui/material";
import { X } from "@mui/icons-material";
import Xetduyetsanpham from "../views/quanly/Xetduyetsanpham";

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import("../layouts/full/FullLayout")));
const BlankLayout = Loadable(
  lazy(() => import("../layouts/blank/BlankLayout"))
);

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import("../views/dashboard/Dashboard")));
const SamplePage = Loadable(
  lazy(() => import("../views/sample-page/SamplePage"))
);
const Icons = Loadable(lazy(() => import("../views/icons/Icons")));
const TypographyPage = Loadable(
  lazy(() => import("../views/utilities/TypographyPage"))
);
const Shadow = Loadable(lazy(() => import("../views/utilities/Shadow")));
const Error = Loadable(lazy(() => import("../views/authentication/Error")));
const Register = Loadable(
  lazy(() => import("../views/authentication/Register"))
);
const Login = Loadable(lazy(() => import("../views/authentication/Login")));

const Router = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" /> },
      { path: "upload", element: <UploadFile /> },
      { path: "popup", element: <CrudPOPUP /> },
      { path: "response", element: <Respone /> },
      { path: "xetduyetsanpham", element: <Xetduyetsanpham /> },
      { path: "crudhinhAnh", element: <CRUDAnh /> },
      { path: "banner", element: <BannerManager /> },
      { path: "nhacungcap", element: <SupplierManagement /> },
      { path: "danhmuc", element: <CrudCategory /> },
      { path: "settings", element: <Settings /> },
      { path: "thuonghieu", element: <Thuonghieu /> },
      { path: "baidang", element: <Baidang /> },
      { path: "DuAnTotNghiep", element: <Dashboard /> },
      { path: "dashboard", element: <Thongtincanhan /> },
      { path: "shipper", element: <QuanLyShipper /> },
      { path: "thongke", element: <Dashboard /> },
      { path: "voucher", element: <Voucher /> },
      { path: "nhaphang", element: <NhapHang /> },
      { path: "kho", element: <Kho /> },
      { path: "danhgia", element: <DanhGia /> },
      { path: "sanpham", element: <Sanpham /> },
      { path: "donhang", element: <QuanLyDonHang /> },
      { path: "nguoidung", element: <UserManagement /> },
      { path: "sample-page", element: <SamplePage /> },
      { path: "icons", element: <Icons /> },
      { path: "ui/typography", element: <TypographyPage /> },
      { path: "ui/shadow", element: <Shadow /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
  // {
  //   path: "/auth",
  //   element: <BlankLayout />,
  //   children: [
  //     { path: "404", element: <Error /> },
  //     { path: "register", element: <Register /> },
  //     { path: "login", element: <Login /> },
  //     { path: "*", element: <Navigate to="/auth/404" /> },
  //   ],
  // },
  { path: "/login", element: <Newlogin1 /> },
  { path: "naptien", element: <Naptien /> },
];

export default Router;
