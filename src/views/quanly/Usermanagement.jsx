import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  AppBar,
} from "@mui/material";
import { Add, Search, Edit, Delete, Restore } from "@mui/icons-material";

const UserManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [list, setList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    accountID: "",
    hovaten: "",
    password: "",
    hinh_anh: "",
    vai_tro: "",
    so_dien_thoai: "",
    dia_chi: "",
    trang_thai_xoa: "",
    previewUrl: "",
    hanh_dong: "",
    hoat_dong: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [listDataHD, setlistDataHD] = useState([]);
  const [listLoad, setlistLoad] = useState([]);
  const [listUser, setlistUser] = useState([]);
  const [listNgay, setlistNgay] = useState([]);
  const [active, setactive] = useState(false);
  const apilistDataHD = async () => {
    const res = await axios({
      url: "http://localhost:8080/api/users/gethanhdong",
      method: "GET",
    });
    setlistDataHD(res.data);
    console.log("sdsadsadfas", res.data);
  };

  const handleLoad = async () => {
    const res = await axios({
      url: `http://localhost:8080/api/users/getNhanVien`,
      method: "GET",
    });
    setlistLoad(res.data);
  };

  const handleUser = async () => {
    const res = await axios({
      url: `http://localhost:8080/api/users/getUser`,
      method: "GET",
    });
    console.log("first users nè", res.data);
    setlistUser(res.data);
  };

  const handleNgay = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users/today");
      console.log("Data từ API ngày:", res.data);
      setlistNgay(res.data); // Cập nhật state `listNgay`
    } catch (error) {
      console.error("Lỗi khi gọi API ngày:", error);
    }
  };

  useEffect(() => {
    handleUser();
    // handleNgay();
    fetchUsers();
    handleLoad();
    apilistDataHD();
    danhSachViPham();
  }, []);
  useEffect(() => {
    handleLoad();
  }, [tabValue]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users");
      console.log(res.data); // Kiểm tra dữ liệu trả về từ API
      setList(res.data || []);
    } catch (error) {
      console.error("Lỗi API:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);

    setFormData((prevData) => ({
      ...prevData,
      hinh_anh: file,
      previewUrl: imageUrl,
    }));
  };

  const validateForm = () => {
    const {
      accountID,
      hovaten,
      password,
      so_dien_thoai,
      dia_chi,
      trang_thai_xoa,
    } = formData;
    let errors = {};

    if (!accountID) errors.accountID = "Account ID không được để trống!";
    else if (!/\S+@\S+\.\S+/.test(accountID))
      errors.accountID = "Account ID không hợp lệ!";

    if (!hovaten) errors.hovaten = "Họ và tên không được để trống!";
    if (!password) errors.password = "Mật khẩu không được để trống!";
    else if (password.length < 5 || password.length > 9)
      errors.password = "Mật khẩu phải từ 5 đến 9 ký tự!";

    /*  if (!so_dien_thoai)
      errors.so_dien_thoai = "Số điện thoại không được để trống!";
    else if (!/^0\d{9,13}$/.test(so_dien_thoai))
      errors.so_dien_thoai = "Số điện thoại phải có từ 10 đến 15 ký tự số";
    else if (/[^0-9]/.test(so_dien_thoai))
      errors.so_dien_thoai =
        "Số điện thoại không được chứa ký tự chữ cái hoặc ký tự đặc biệt!"; */

    /*     if (!dia_chi) errors.dia_chi = "Địa chỉ không được để trống!";
    else if (dia_chi.length < 10 || dia_chi.length > 50)
      errors.dia_chi = "Địa chỉ phải từ 10 đến 50 ký tự!" */
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "previewUrl") formDataToSend.append(key, value);
    });

    try {
      const isUpdating = Boolean(currentUser);
      const url = isUpdating
        ? `http://localhost:8080/api/users/put/${currentUser.accountID}`
        : "http://localhost:8080/api/users/add";
      const method = isUpdating ? "PUT" : "POST";
      if (method == "POST") {
        const acc = formDataToSend.get("accountID");
        console.log("sâsas", acc);
        const res = await axios({
          url: `http://localhost:8080/api/users/trung?accountID=${acc}`,
          method: "GET",
        });
        if (res.data != "") {
          alert("Trùng Accoutn");
          return;
        }
      }
      const response = await axios({
        method,
        url,
        data: formDataToSend,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        const successMessage = isUpdating
          ? "Cập nhật người dùng thành công!"
          : "Thêm người dùng thành công!";
        setSnackbarMessage(successMessage);

        setList((prevList) =>
          isUpdating
            ? prevList.map((user) =>
                user.accountID === currentUser.accountID
                  ? { ...formData, accountID: currentUser.accountID }
                  : user
              )
            : [
                ...prevList,
                {
                  ...formData,
                  accountID: response.data.accountID,
                  hinh_anh: response.data.hinh_anh,
                },
              ]
        );

        setSnackbarOpen(true);
        fetchUsers();
        resetForm();
        setTabValue(0);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi gửi yêu cầu:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi không xác định.";
      setSnackbarMessage(`Lỗi: ${errorMessage}`);
      setSnackbarOpen(true);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    console.log("cc", user);
    setFormData({
      accountID: user.accountID,
      hovaten: user.hovaten,
      hinh_anh: user.hinh_anh,
      vai_tro: user.ten_vai_tro,
      so_dien_thoai: user.so_dien_thoai,
      dia_chi: user.dia_chi,
      previewUrl: user.hinh_anh,
      hoat_dong: user.hoat_dong, // Giả định có URL hình ảnh
      password: user.password,
    });
    setactive(user.hoat_dong == "On" ? true : false);
    setTabValue(2);
  };

  const handleRestore = async (user) => {
    const { accountID } = user;
    console.log("id", accountID);
    try {
      // Giả định API khôi phục người dùng
      await axios.get(`http://localhost:8080/api/users/back/${accountID}`);
      setSnackbarMessage("Khôi phục người dùng thành công!");
      setSnackbarOpen(true);
      fetchUsers(); // Cập nhật danh sách người dùng sau khi khôi phục
      setTabValue(0);
    } catch (error) {
      console.error("Lỗi khi khôi phục người dùng:", error);
      setSnackbarMessage("Có lỗi xảy ra khi khôi phục người dùng!");
      setSnackbarOpen(true);
    }
  };

  const handlechange1 = async (user) => {
    try {
      setCurrentUser(user);
      console.log("cc", user);
      const { accountID } = user;
      console.log("ccccc", accountID);
      const res = await axios({
        url: `http://localhost:8080/api/users/delete/${accountID}`,
        method: "GET",
      });
      setList((prevList) =>
        prevList.filter((user) => user.accountID !== accountID)
      );

      setSnackbarMessage("Xóa người dùng thành công!");
      setSnackbarOpen(true);

      // Chuyển sang tab thứ ba nếu cần
      setTabValue(0);
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      setSnackbarMessage("Có lỗi xảy ra khi xóa người dùng!");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (accountID) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${accountID}`);

      // Cập nhật danh sách người dùng trong state
      setList((prevList) =>
        prevList.filter((user) => user.accountID !== accountID)
      );

      setSnackbarMessage("Xóa người dùng thành công!");
      setSnackbarOpen(true);

      // Chuyển sang tab thứ ba nếu cần
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      setSnackbarMessage("Có lỗi xảy ra khi xóa người dùng!");
      setSnackbarOpen(true);
    }
  };

  const resetForm = async () => {
    setCurrentUser(null);
    setFormData({
      accountID: "",
      hovaten: "",
      password: "",
      hinh_anh: "",
      vai_tro: "",
      so_dien_thoai: "",
      dia_chi: "",
      trang_thai_xoa: "",
      previewUrl: "",
    });
    setFormErrors({});
  };
  console.log(formData);
  const filteredData = list.filter((user) => {
    const matchesSearchTerm =
      (user.hovaten &&
        user.hovaten.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.accountID &&
        user.accountID.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRoleFilter = roleFilter
      ? user.roles && user.roles.some((role) => role.ten_vai_tro === roleFilter)
      : true;

    // Kiểm tra tồn tại của `trang_thai_xoa` trước khi so sánh
    // const setTrangThaiXoa = user.trang_thai_xoa === null;

    return matchesSearchTerm && matchesRoleFilter;
  });

  const filterdataUser = listUser.filter((user) => {
    const matchesRoleFilter = roleFilter
      ? user.roles && user.roles.some((role) => role.ten_vai_tro === roleFilter)
      : true;
    const matchesSearchTerm =
      (user.hovaten &&
        user.hovaten.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.accountID &&
        user.accountID.toLowerCase().includes(searchTerm.toLowerCase()));

    // // Kiểm tra tồn tại của `trang_thai_xoa` trước khi so sánh
    // const setTrangThaiXoa = user.trang_thai_xoa === null;

    return matchesSearchTerm && matchesRoleFilter;
  });

  const filterdataNhanVien = listLoad.filter((user) => {
    const normalizedSearchTerm = (searchTerm || "").toLowerCase();

    // Kiểm tra tên hoặc accountID khớp với từ khóa tìm kiếm
    const matchesSearchTerm =
      (user.hovaten &&
        user.hovaten.toLowerCase().includes(normalizedSearchTerm)) ||
      (user.accountID &&
        user.accountID.toLowerCase().includes(normalizedSearchTerm));

    // Kiểm tra vai trò khớp với bộ lọc
    const matchesRoleFilter = roleFilter
      ? user.ten_vai_tro.trim().toLowerCase() ===
        roleFilter.trim().toLowerCase()
      : true;

    return matchesSearchTerm && matchesRoleFilter;
  });

  const filteredDataXoa = list.filter((user) => {
    const matchesSearchTerm =
      (user.hovaten &&
        user.hovaten.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.accountID &&
        user.accountID.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRoleFilter = roleFilter
      ? user.roles?.some((role) => role.ten_vai_tro === roleFilter)
      : true;
    // const setTrangThaiXoa = user.trang_thai_xoa === "Xóa";

    return matchesSearchTerm && matchesRoleFilter;
  });
  const filteredDataViPham = list.filter((user) => {
    const matchesSearchTerm =
      (user.hovaten &&
        user.hovaten.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.accountID &&
        user.accountID.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRoleFilter = roleFilter
      ? user.roles?.some((role) => role.ten_vai_tro === roleFilter)
      : true;
    const setTrangThaiXoa = user.vi_pham > 0;

    return matchesSearchTerm && matchesRoleFilter && setTrangThaiXoa;
  });
  useEffect(() => {
    console.log("FilerData nè: ", listDataHD);
  }, [listDataHD, listNgay]);
  const combinedList = [...listDataHD, ...listNgay];

  const filteredCombinedData = combinedList.filter((user) => {
    const matchesSearchTerm =
      (user.hovaten &&
        user.hovaten.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.accountID &&
        user.accountID
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesRoleFilter = roleFilter
      ? user.roles && user.roles.some((role) => role.ten_vai_tro === roleFilter)
      : true;

    // Điều kiện trang_thai_xoa (nếu có từ listDataHD)
    // const setTrangThaiXoa = user.trang_thai_xoa === null || user.trang_thai_xoa !== null;

    return matchesSearchTerm && matchesRoleFilter;
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const danhSachViPham = async () => {
    try {
      // Gửi yêu cầu đánh dấu vi phạm
      const res = await axios({
        url: "http://localhost:8080/api/users/vipham",
        method: "GET",
      });

      // Cập nhật danh sách người dùng
      setList(res.data);
      console.log("Danh sách vi phạm nè: ", res.data);
    } catch (error) {
      console.error("Lỗi khi đánh dấu vi phạm:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" className="form-container">
      <Paper elevation={5} className="form-paper">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          className="form-title"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          User Management
        </Typography>

        <AppBar position="static" color="default">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Danh Sách Người Dùng" />
            <Tab label="Danh Sách Nhân Viên" />
            <Tab
              onClick={() => {
                resetForm();
              }}
              label="Thêm Người Dùng"
            />
            {/* <Tab
              onClick={() => {
                fetchUsers();
              }}
              label="Lịch Sử Xóa"
            /> */}
            <Tab
              onClick={() => {
                fetchUsers();
              }}
              label="Vi Phạm"
            />
            {/*   <Tab
              onClick={() => {
                fetchUsers();
              }}
              label="Các Tài Khoản Bị Ban"
            /> */}
            <Tab
              onClick={() => {
                apilistDataHD();
              }}
              label=" Hành Động"
            />
          </Tabs>
        </AppBar>

        {tabValue === 0 && (
          <TableContainer component={Paper} className="table-container">
            <Typography variant="h6" align="center" className="table-title">
              Submitted User Data
            </Typography>
            <Grid container spacing={2} style={{ alignItems: "center" }}>
              <Grid item xs={6}>
                <TextField
                  className="input-field"
                  label="Search"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className="input-field"
                  select
                  label="Filter by Role"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Nhân Viên Kho">Nhân Viên Kho</MenuItem>
                  <MenuItem value="Nhân Viên Kinh Doanh">
                    Nhân Viên Kinh Doanh
                  </MenuItem>
                  <MenuItem value="Nhân Viên Đăng Bài">
                    Nhân Viên Đăng Bài
                  </MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Table>
              <TableHead>
                <TableRow className="table-row-header">
                  <TableCell>Account ID</TableCell>
                  <TableCell>Họ và tên</TableCell>
                  <TableCell>Hình Ảnh</TableCell>
                  <TableCell>Vai Trò</TableCell>
                  <TableCell>Số Điện Thoại</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterdataUser
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.accountID}</TableCell>
                      <TableCell>{user.hovaten}</TableCell>
                      <TableCell>
                        {user.hinh_anh ? (
                          <img
                            src={`/images/${user.hinh_anh}`}
                            alt="Hình ảnh"
                            style={{ width: 50, height: 50 }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </TableCell>
                      <TableCell>{user.ten_vai_tro}</TableCell>
                      {/* Hiển thị vai trò */}
                      <TableCell>{user.so_dien_thoai}</TableCell>
                      {/* Hiển thị địa chỉ */}

                      {/* <TableCell>{user.password}</TableCell> */}
                      {/* <TableCell>
                        <Button onClick={() => handleEdit(user)}>
                          <Edit />
                        </Button>
                        <Button
                    onClick={() => {
                        handlechange1(user); // Call the edit function
                        setTabValue(2); // Switch to tab 2
                    }}
                    sx={{ color: "secondary" }}
                >
                    <Delete />
                </Button>
                      </TableCell> */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filterdataUser.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        )}
        {tabValue === 1 && (
          <TableContainer component={Paper} className="table-container">
            <Typography
              variant="h6"
              align="center"
              className="table-title"
              style={{ marginTop: "20px", marginBottom: "20px" }}
            >
              Submitted User Data
            </Typography>
            <Grid container spacing={2} style={{ alignItems: "center" }}>
              <Grid item xs={6}>
                <TextField
                  className="input-field"
                  label="Search"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className="input-field"
                  select
                  label="Filter by Role"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Nhân Viên Kho">Nhân Viên Kho</MenuItem>
                  <MenuItem value="Nhân Viên Kinh Doanh">
                    Nhân viên Kinh Doanh
                  </MenuItem>
                  <MenuItem value="Nhân Viên Ðăng Bài">
                    Nhân Viên Ðăng Bài
                  </MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Table>
              <TableHead>
                <TableRow className="table-row-header">
                  <TableCell>Account ID</TableCell>
                  <TableCell>Họ và tên</TableCell>
                  <TableCell>Hình Ảnh</TableCell>
                  <TableCell>Vai Trò</TableCell>
                  <TableCell>Số Điện Thoại</TableCell>
                  <TableCell>Hoạt Động</TableCell>
                  <TableCell>Địa Chỉ</TableCell>
                  {/* <TableCell>Mật Khẩu</TableCell> */}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterdataNhanVien
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.accountID}</TableCell>
                      <TableCell>{user.hovaten}</TableCell>
                      <TableCell>
                        {user.hinh_anh ? (
                          <img
                            src={`/images/${user.hinh_anh}`}
                            alt="Hình ảnh"
                            style={{ width: 50, height: 50 }}
                          />
                        ) : (
                          "Không Có Hình"
                        )}
                      </TableCell>
                      <TableCell>{user.ten_vai_tro}</TableCell>
                      <TableCell>{user.so_dien_thoai}</TableCell>
                      <TableCell>
                        {user.hoat_dong == "On"
                          ? "Đang hoạt động"
                          : "Không hoạt động"}
                      </TableCell>
                      <TableCell>{user.dia_chi}</TableCell>
                      <TableCell>
                        {
                          <Button onClick={() => handleEdit(user)}>
                            <Edit />
                          </Button>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filterdataNhanVien.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        )}

        {tabValue === 2 && (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  align="center"
                  style={{ marginTop: "20px", marginBottom: "20px" }}
                >
                  Thêm Users
                </Typography>
                <TextField
                  name="accountID"
                  label="Account ID"
                  variant="outlined"
                  fullWidth
                  required
                  disabled={active}
                  value={formData.accountID}
                  onChange={handleInputChange}
                  error={!!formErrors.accountID}
                  helperText={formErrors.accountID}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="hovaten"
                  label="Họ và tên"
                  variant="outlined"
                  fullWidth
                  required
                  disabled={active}
                  value={formData.hovaten}
                  onChange={handleInputChange}
                  error={!!formErrors.hovaten}
                  helperText={formErrors.hovaten}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Mật Khẩu"
                  type="password"
                  variant="outlined"
                  fullWidth
                  disabled={active}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="vai_tro"
                  select
                  label="Vai Trò"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.vai_tro}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Chọn vai trò</MenuItem>
                  <MenuItem value="Nhân Viên Kho">Nhân Viên Kho</MenuItem>
                  <MenuItem value="Nhân Viên Kinh Doanh">
                    Nhân Viên Kinh Doanh
                  </MenuItem>
                  <MenuItem value="Nhân Viên Ðăng Bài">
                    Nhân Viên Ðăng Bài
                  </MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </TextField>
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  name="so_dien_thoai"
                  label="Số Điện Thoại"
                  variant="outlined"
                  fullWidth
                  required
                  disabled={active}
                  value={formData.so_dien_thoai}
                  onChange={handleInputChange}
                  error={!!formErrors.so_dien_thoai}
                  helperText={formErrors.so_dien_thoai}
                />
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  name="hoat_dong"
                  select
                  label="Trạng Thái Hoạt Động"
                  variant="outlined"
                  fullWidth
                  value={formData.hoat_dong}
                  error={!!formErrors.hoatDong}
                  helperText={formErrors.hoatDong}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">
                    <em>Chọn trạng thái hoạt động</em>
                  </MenuItem>
                  <MenuItem value="On">Hoạt Động</MenuItem>
                  <MenuItem value="Off">Ngưng Hoạt Động</MenuItem>
                </TextField>
              </Grid>

              {/*  <Grid item xs={12}>
                <TextField
                  name="dia_chi"
                  label="Địa Chỉ"
                  variant="outlined"
                  fullWidth
                  required
                  disabled={active}
                  value={formData.dia_chi}
                  onChange={handleInputChange}
                  error={!!formErrors.dia_chi}
                  helperText={formErrors.dia_chi}
                />
              </Grid> */}
              {/*  <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="upload-button"
                />
                <label htmlFor="upload-button">
                  <Button variant="contained" component="span">
                    Tải lên Hình Ảnh
                  </Button>
                </label>
              </Grid>
              <Grid item xs={12}>
                {formData.previewUrl ? (
                  <img
                    src={formData.previewUrl}
                    alt="Hình ảnh đã chọn"
                    style={{ width: 50, height: 50 }}
                  />
                ) : (
                  "No Image"
                )}
              </Grid> */}
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<Add />}
                  >
                    {currentUser ? "CẬP NHẬT NGƯỜI DÙNG" : "THÊM NGƯỜI DÙNG"}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={resetForm}
                    startIcon={<Restore />}
                  >
                    ĐẶT LẠI
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>

      {/* {tabValue === 4 && (
        <TableContainer component={Paper} className="table-container">
          <Typography variant="h6" align="center" className="table-title">
            Lịch Sử Xóa
          </Typography>
          <Grid container spacing={2} style={{ alignItems: "center" }}>
            <Grid item xs={6}>
              <TextField
                className="input-field"
                label="Search"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                className="input-field"
                select
                label="Filter by Role"
                variant="outlined"
                fullWidth
                margin="normal"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Nhân Viên Kho">Nhân viên kho</MenuItem>
                <MenuItem value="Nhân Viên Kinh Doanh">
                  Nhân viên kinh doanh
                </MenuItem>
                <MenuItem value="Nhân Viên Đăng Bài">
                  Nhân viên đăng bài
                </MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Table>
            <TableHead>
              <TableRow className="table-row-header">
                <TableCell>Account ID</TableCell>
                <TableCell>Họ và tên</TableCell>
                <TableCell>Hình Ảnh</TableCell>
                <TableCell>Vai Trò</TableCell>
                <TableCell>Số Điện Thoại</TableCell>
                <TableCell>Địa Chỉ</TableCell>
                <TableCell>Mật Khẩu</TableCell>
                <TableCell>Trạng Thái Xóa</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDataXoa
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.accountID}</TableCell>
                    <TableCell>{user.hovaten}</TableCell>
                    <TableCell>
                      {user.hinh_anh ? (
                        <img
                          src={`/images/${user.hinh_anh}`}
                          alt="Hình ảnh"
                          style={{ width: 50, height: 50 }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell>{user?.roles[0]?.ten_vai_tro}</TableCell>
                    <TableCell>{user.so_dien_thoai}</TableCell>
                    <TableCell>{user?.diachi[0]?.dia_chi}</TableCell>
                    <TableCell>{user.password}</TableCell>
                    <TableCell>{user.trang_thai_xoa}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleRestore(user)}>
                        <Restore />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer> */}
      {/* )} */}
      {tabValue === 3 && (
        <TableContainer component={Paper} className="table-container">
          <Typography
            variant="h6"
            align="center"
            className="table-title"
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            Các Tài Khoản Vi Phạm
          </Typography>
          {/* <Grid container spacing={2} style={{ alignItems: "center" }}>
            <Grid item xs={6}>
              <TextField
                className="input-field"
                label="Search"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                className="input-field"
                select
                label="Filter by Role"
                variant="outlined"
                fullWidth
                margin="normal"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Nhân Viên Kho">Nhân viên kho</MenuItem>
                <MenuItem value="Nhân Viên Kinh Doanh">
                  Nhân viên kinh doanh
                </MenuItem>
                <MenuItem value="Nhân Viên Đăng Bài">
                  Nhân viên đăng bài
                </MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </TextField>
            </Grid>
          </Grid> */}

          <Table>
            <TableHead>
              <TableRow className="table-row-header">
                <TableCell>Account ID</TableCell>
                <TableCell>Họ và tên</TableCell>
                <TableCell>Vai Trò</TableCell>
                <TableCell>Số Điện Thoại</TableCell>
                <TableCell>Vi Phạm</TableCell>
                {/*                 <TableCell>Vi Phạm</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDataViPham
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.accountID}</TableCell>
                    <TableCell>{user.hovaten}</TableCell>
                    <TableCell>{user?.roles[0]?.ten_vai_tro}</TableCell>
                    {/* Hiển thị vai trò */}
                    <TableCell>{user.so_dien_thoai}</TableCell>
                    <TableCell>{user.vi_pham}</TableCell>
                    {/* <TableCell>{user?.diachi[0]?.dia_chi}</TableCell> */}
                    {/* Hiển thị địa chỉ */}

                    {/* <TableCell>
                      {user.vi_pham === 3 ? (
                        <button
                          style={{
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleBanUser(user)}
                        >
                          Ban
                        </button>
                      ) : (
                        user.vi_pham
                      )}
                    </TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDataViPham.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
      {/*   {tabValue === 4 && (
        <TableContainer component={Paper} className="table-container">
          <Typography variant="h6" align="center" className="table-title"
          style={{ marginTop: "20px" , marginBottom:"20px" }}>
            Tài Khoản Bị Ban
          </Typography> */}
      {/*    <Grid container spacing={2} style={{ alignItems: "center" }}>
            <Grid item xs={6}>
              <TextField
                className="input-field"
                label="Search"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                className="input-field"
                select
                label="Filter by Role"
                variant="outlined"
                fullWidth
                margin="normal"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Nhân Viên Kho">Nhân viên kho</MenuItem>
                <MenuItem value="Nhân Viên Kinh Doanh">
                  Nhân viên kinh doanh
                </MenuItem>
                <MenuItem value="Nhân Viên Đăng Bài">
                  Nhân viên đăng bài
                </MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </TextField>
            </Grid>
          </Grid> */}

      {/*     <Table>
            <TableHead>
              <TableRow className="table-row-header">
                <TableCell>Account ID</TableCell>
                <TableCell>Họ và tên</TableCell>
                <TableCell>Hình Ảnh</TableCell>
                <TableCell>Vai Trò</TableCell>
                <TableCell>Số Điện Thoại</TableCell>
                <TableCell>Địa Chỉ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDataViPham
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.accountID}</TableCell>
                    <TableCell>{user.hovaten}</TableCell>
                    <TableCell>
                      {user.hinh_anh ? (
                        <img
                          src={`/images/${user.hinh_anh}`}
                          alt="Hình ảnh"
                          style={{ width: 50, height: 50 }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell>{user?.roles[0]?.ten_vai_tro}</TableCell>
                    <TableCell>{user.so_dien_thoai}</TableCell>
                    <TableCell>{user?.diachi[0]?.dia_chi}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table> */}

      {/*    <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDataViPham.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
      {/*       </TableContainer>
      )} */}
      {tabValue === 4 && (
        <TableContainer component={Paper} className="table-container">
          <Typography
            variant="h6"
            align="center"
            className="table-title"
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            Nhật ký hoạt động
          </Typography>
          {/* <Grid container spacing={2} style={{ alignItems: "center" }}>
            <Grid item xs={6}>
              <TextField
                className="input-field"
                label="Search"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                className="input-field"
                select
                label="Filter by Role"
                variant="outlined"
                fullWidth
                margin="normal"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Nhân Viên Kho">Nhân viên kho</MenuItem>
                <MenuItem value="Nhân Viên Kinh Doanh">
                  Nhân viên kinh doanh
                </MenuItem>
                <MenuItem value="Nhân Viên Đăng Bài">
                  Nhân viên đăng bài
                </MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </TextField>
            </Grid>
          </Grid> */}

          <Table>
            <TableHead>
              <TableRow className="table-row-header">
                <TableCell>Account ID</TableCell>
                <TableCell>Họ và tên</TableCell>
                <TableCell>Hình Ảnh</TableCell>
                <TableCell>Vai Trò</TableCell>
                <TableCell>Số Điện Thoại</TableCell>
                <TableCell>Ngày Hành Động</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listDataHD
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.user.accountID}</TableCell>
                    <TableCell>{user.user.hovaten}</TableCell>
                    <TableCell>
                      {user.user.hinh_anh ? (
                        <img
                          src={`/images/${user.user.hinh_anh}`}
                          alt="Hình ảnh"
                          style={{ width: 50, height: 50 }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell>{user?.user?.roles[0]?.ten_vai_tro}</TableCell>
                    {/* Hiển thị vai trò */}
                    <TableCell>{user.user.so_dien_thoai}</TableCell>
                    {/* <TableCell>{user.user?.diachi[0]?.dia_chi}</TableCell> */}
                    {/* Hiển thị địa chỉ */}

                    <TableCell>{user.ngayhanhdong}</TableCell>
                    <TableCell>{user.tenHanhDong}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 50]}
            component="div"
            count={listDataHD.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserManagement;
