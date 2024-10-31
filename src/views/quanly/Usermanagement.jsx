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
//import "../../styles/UserForm.css";

const UserForm = () => {
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
    ten_vai_tro: "",
    hoat_dong: "Hoạt động",
    so_dien_thoai: "",
    dia_chi: "",
    previewUrl: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/list/users");
      console.log("Dữ liệu nè", res.data); // Kiểm tra dữ liệu trả về từ API
      setList(res.data || []);
    } catch (error) {
      if (error.response) {
        // Lỗi từ server, có response trả về
        console.error("Lỗi API:", {
          status: error.response.status, // Mã lỗi HTTP (500, 404, ...)
          statusText: error.response.statusText, // Mô tả mã lỗi
          data: error.response.data, // Dữ liệu lỗi từ backend
        });
      } else if (error.request) {
        // Request được gửi nhưng không nhận được response
        console.error("Không có phản hồi từ server:", error.request);
      } else {
        // Lỗi khác khi cấu hình request
        console.error("Lỗi khác:", error.message);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  //   setFormErrors({ ...formErrors, [name]: "" });
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    const { accountID, hovaten, password, so_dien_thoai, dia_chi } = formData;
    let errors = {};

    if (!accountID) errors.accountID = "Account ID không được để trống!";
    else if (!/\S+@\S+\.\S+/.test(accountID))
      errors.accountID = "Account ID không hợp lệ!";

    if (!hovaten) errors.hovaten = "Họ và tên không được để trống!";
    if (!password) errors.password = "Mật khẩu không được để trống!";
    else if (password.length < 5 || password.length > 9)
      errors.password = "Mật khẩu phải từ 5 đến 9 ký tự!";

    if (!so_dien_thoai)
      errors.so_dien_thoai = "Số điện thoại không được để trống!";
    else if (!/^0\d{9,13}$/.test(so_dien_thoai))
      errors.so_dien_thoai = "Số điện thoại phải có từ 10 đến 15 ký tự số";
    else if (/[^0-9]/.test(so_dien_thoai))
      errors.so_dien_thoai =
        "Số điện thoại không được chứa ký tự chữ cái hoặc ký tự đặc biệt!";

    if (!dia_chi) errors.dia_chi = "Địa chỉ không được để trống!";
    else if (dia_chi.length < 10 || dia_chi.length > 50)
      errors.dia_chi = "Địa chỉ phải từ 10 đến 50 ký tự!";

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
        ? `http://localhost:8080/api/update/users/${currentUser.accountID}`
        : "http://localhost:8080/api/add/users";
      const method = isUpdating ? "PUT" : "POST";

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
      accountID: user.accountID || "",
      hovaten: user.hovaten || "",
      password: user.password || "",
      hinh_anh: user.hinh_anh || "", // Có thể là URL hình ảnh
      ten_vai_tro: user.ten_vai_tro || "", // Cập nhật đúng tên
      hoat_dong: user.hoat_dong || "Hoạt động",
      so_dien_thoai: user.so_dien_thoai || "",
      dia_chi: user.dia_chi || "",
      previewUrl: user.hinh_anh
        ? `http://localhost:8080/images/${user.hinh_anh}`
        : "", // Chỉ tạo URL nếu có hình
    });
    setTabValue(1);
  };

  const handleDelete = async (accountID) => {
    try {
      await axios.delete(`http://localhost:8080/api/delete/users/${accountID}`);
      setList(list.filter((user) => user.accountID !== accountID));
      setSnackbarMessage("Xóa người dùng thành công!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      setSnackbarMessage("Có lỗi xảy ra khi xóa người dùng!");
      setSnackbarOpen(true);
    }
  };

  const resetForm = () => {
    setCurrentUser(null);
    setFormData({
      accountID: "",
      hovaten: "",
      password: "",
      hinh_anh: "",
      ten_vai_tro: "",
      hoat_dong: "Hoạt động",
      so_dien_thoai: "",
      dia_chi: "",
      previewUrl: "",
    });
    setFormErrors({});
  };
  //console.log(formData);

  const filteredData = list.filter((user) => {
    const matchesSearchTerm =
      (user.hovaten &&
        user.hovaten.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.accountID &&
        user.accountID.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRoleFilter = roleFilter
      ? user.roles?.some((role) => role.ten_vai_tro === roleFilter)
      : true;

    return matchesSearchTerm && matchesRoleFilter;
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
            <Tab label="Thêm Người Dùng" />
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
                  <TableCell>Hoạt động</TableCell>
                  <TableCell>Số Điện Thoại</TableCell>
                  <TableCell>Địa Chỉ</TableCell>
                  <TableCell>Mật Khẩu</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.accountID}</TableCell>
                      <TableCell>{user.hovaten}</TableCell>
                      <TableCell>
                        {user.hinh_anh ? (
                          <img
                            src={`http://localhost:8080/images/${user.hinh_anh}`}
                            alt="Hình ảnh"
                            style={{ width: 50, height: 50 }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </TableCell>
                      <TableCell>
                        {user?.ten_vai_tro || "Không có vai trò"}
                      </TableCell>
                      <TableCell>
                        {user?.hoat_dong || "Không có vai trò"}
                      </TableCell>
                      {/* Hiển thị vai trò */}
                      <TableCell>{user.so_dien_thoai}</TableCell>
                      <TableCell>
                        {user?.dia_chi || "Không có địa chỉ"}
                      </TableCell>
                      {/* Hiển thị địa chỉ */}
                      <TableCell>{user.password}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEdit(user)}>
                          <Edit />
                        </Button>
                        <Button
                          onClick={() => handleDelete(user.accountID)}
                          sx={{ color: "secondary" }}
                        >
                          <Delete />
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
          </TableContainer>
        )}

        {tabValue === 1 && (
          <form onSubmit={handleSubmit} className="mt-4">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="accountID"
                  label="Account ID"
                  variant="outlined"
                  fullWidth
                  required
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
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="ten_vai_tro"
                  select
                  label="Vai Trò"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.ten_vai_tro || ""}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Chọn vai trò</MenuItem>
                  <MenuItem value="Nhân viên kho">Nhân viên kho</MenuItem>
                  <MenuItem value="Nhân viên kinh doanh">
                    Nhân viên kinh doanh
                  </MenuItem>
                  <MenuItem value="Nhân viên đăng bài">
                    Nhân viên đăng bài
                  </MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="hoat_dong"
                  select
                  label="Hoạt động"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.hoat_dong || "Hoạt động"}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Chọn hoạt động</MenuItem>
                  <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                  <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="so_dien_thoai"
                  label="Số Điện Thoại"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.so_dien_thoai}
                  onChange={handleInputChange}
                  error={!!formErrors.so_dien_thoai}
                  helperText={formErrors.so_dien_thoai}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="dia_chi"
                  label="Địa Chỉ"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.dia_chi}
                  onChange={handleInputChange}
                  error={!!formErrors.dia_chi}
                  helperText={formErrors.dia_chi}
                />
              </Grid>
              <Grid item xs={12}>
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
                {formData.previewUrl && (
                  <img
                    src={formData.previewUrl}
                    alt="Xem trước hình ảnh"
                    style={{
                      marginTop: "10px",
                      maxWidth: "100%",
                      height: "50px",
                      width: "50px",
                    }}
                  />
                )}
              </Grid>
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

export default UserForm;
