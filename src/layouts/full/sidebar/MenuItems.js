import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Trang chủ",
    icon: IconLayoutDashboard,
    href: "/dashboard",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/thongke",
    roles: ["Admin"],
  },
  {
    id: uniqueId(),
    title: "Quản lý người dùng",
    icon: IconLayoutDashboard,
    href: "/nguoidung",
    roles: ["Admin"],
  },
  {
    id: uniqueId(),
    title: "Quản lý danh mục",
    icon: IconLayoutDashboard,
    href: "/danhmuc",
    roles: ["Admin"],
  },
  {
    id: uniqueId(),
    title: "Quản lý shipper",
    icon: IconLayoutDashboard,
    href: "/shipper",
    roles: ["Admin"],
  },
  {
    id: uniqueId(),
    title: "Quản lý thương hiệu",
    icon: IconLayoutDashboard,
    href: "/thuonghieu",
    roles: ["Admin"],
  },
  {
    id: uniqueId(),
    title: "Quản lý đơn hàng",
    icon: IconLayoutDashboard,
    href: "/donhang",
    roles: ["Admin"],
  },
  {
    navlabel: true,
    subheader: "Utilities",
  },
  {
    id: uniqueId(),
    title: "Typography",
    icon: IconTypography,
    href: "/ui/typography",
    roles: ["User"],
  },
  {
    id: uniqueId(),
    title: "Quản lý nhập hàng",
    icon: IconTypography,
    href: "/nhaphang",
    roles: ["Nhân viên kho", "Admin"],
  },
  {
    id: uniqueId(),
    title: "Quản lý đánh giá",
    icon: IconTypography,
    href: "/danhgia",
    roles: ["Nhân viên kho", "Admin"],
  },
  {
    id: uniqueId(),
    title: "Quản lý kho",
    icon: IconTypography,
    href: "/kho",
    roles: ["Nhân viên kho", "Admin"],
  },
  {
    id: uniqueId(),
    title: "Quản lý sản phẩm",
    icon: IconTypography,
    href: "/sanpham",
    roles: ["Nhân viên kho", "Admin"],
  },
  {
    id: uniqueId(),
    title: "Quản lý Voucher",
    icon: IconTypography,
    href: "/voucher",
    roles: ["Nhân viên kinh doanh", "Nhân viên kho", "Admin"],
  },
  {
    id: uniqueId(),
    title: "Shadow",
    icon: IconCopy,
    href: "/ui/shadow",
  },
  {
    navlabel: true,
    subheader: "Auth",
  },
  {
    id: uniqueId(),
    title: "Login",
    icon: IconLogin,
    href: "/auth/login",
  },
  {
    id: uniqueId(),
    title: "Register",
    icon: IconUserPlus,
    href: "/auth/register",
  },
  {
    navlabel: true,
    subheader: "Extra",
  },
  {
    id: uniqueId(),
    title: "Icons",
    icon: IconMoodHappy,
    href: "/icons",
  },
  {
    id: uniqueId(),
    title: "Sample Page",
    icon: IconAperture,
    href: "/sample-page",
  },
];

export default Menuitems;
