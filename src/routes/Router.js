import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "../layouts/full/shared/loadable/Loadable";
import Newlogin1 from "../views/quanly/Newlogin1";
import Thongtincanhan from "../views/quanly/Thongtincanhan";
import Voucher from "../views/quanly/QuanlyVoucher";
import Sanpham from "../views/quanly/QuanlySP";
import Kho from "../views/quanly/Quanlykho";

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
      { path: "dashboard", element: <Thongtincanhan /> },
      { path: "thongke", element: <Dashboard /> },
      { path: "voucher", element: <Voucher /> },
      { path: "kho", element: <Kho /> },
      { path: "sanpham", element: <Sanpham /> },
      { path: "sample-page", element: <SamplePage /> },
      { path: "icons", element: <Icons /> },
      { path: "ui/typography", element: <TypographyPage /> },
      { path: "ui/shadow", element: <Shadow /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: "/auth",
    element: <BlankLayout />,
    children: [
      { path: "404", element: <Error /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
  { path: "/login", element: <Newlogin1 /> },
];

export default Router;
