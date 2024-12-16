import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { ListProductSearch } from "../Reducer/productReducer";
import { SetTEXT } from "../Reducer/searchReducer";
import { CallAPI_Cart } from "../Reducer/cartReducer";

const NewHeader = () => {
  const userId = localStorage.getItem("account_id");
  const [showPopup, setShowPopup] = useState(false);
  const [historySearch, SethistorySearch] = useState([]);
  const danhmuc = useSelector((state) => state.textSearch.Danhmuc);
  const TextSearch = useSelector((state) => state.textSearch.Text);
  const sosao = useSelector((state) => state.textSearch.sosao);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usersId, setUsersId] = useState(null);
  const [Text, SetText] = useState("");
  const [suggest, Setsuggest] = useState([]);
  const [mostpbuyed, Setmostpbuyed] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart.CartDatabase);
  const api_Suggest = async (name) => {
    if (name.trim() === "") {
      Setsuggest([]); // Xóa gợi ý khi ô tìm kiếm trống
      return;
    }
    try {
      const res = await axios({
        url: `http://localhost:8080/Product/FindByKeyWord?name=${name}`,
        method: "GET",
      });
      Setsuggest(res.data); // Lưu dữ liệu vào state suggest
      console.log("render suggest");
    } catch (error) {
      console.error("Lỗi API:", error); // Xử lý lỗi
    }
  };

  const gettopsale = async () => {
    try {
      const res = await axios({
        url: `http://localhost:8080/Product/Getsanphamname`,
        method: "GET",
      });
      Setmostpbuyed(res.data);
      console.log("render suggest");
    } catch (error) {
      console.error("Lỗi API:", error); // Xử lý lỗi
    }
  };

  // Hàm debounce để trì hoãn việc gọi API
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args); // Gọi hàm func sau delay
      }, delay);
    };
  };

  const debouncedApiSuggest = useCallback(debounce(api_Suggest, 1000), []);

  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(
      regex,
      (match) => `<span class="highlight">${match}</span>`
    );
  };
  // Xử lý khi click bên ngoài để đóng popup
  useEffect(() => {
    gettopsale();
    setIsLoggedIn(!!userId);
    setUsersId(userId);
    dispatch(CallAPI_Cart(userId));
    SethistorySearch(JSON.parse(localStorage.getItem("HistorySearch")) || []);
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".search-container") &&
        !event.target.closest(".popup") &&
        !event.target.closest(".card") // Thêm điều kiện cho phần tử card
      ) {
        setShowPopup(false);
      }
    };

    const handleScroll = () => {
      setShowPopup(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleInputClick = () => {
    setShowPopup(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("account_id");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = document.querySelector(".search").value;

    const res = await axios({
      url: `http://localhost:8080/Product/FindbyName?name=${value}`,
      method: "GET",
    });
    const api = ListProductSearch(res.data);
    console.log("data", res.data);
    dispatch(api);

    if (danhmuc != "") {
      const res = await axios({
        url: `http://localhost:8080/Product/FindbyNameandDanhmuc?id=${danhmuc}&name=${value}`,
        method: "GET",
      });
      const api = ListProductSearch(res.data);
      console.log("data", res.data);
      dispatch(api);
    }

    if (value !== "") {
      let updateHistory = [Text, ...historySearch];
      SethistorySearch(updateHistory);
      localStorage.setItem("HistorySearch", JSON.stringify(updateHistory));
      dispatch(SetTEXT(Text));
    }

    setShowPopup(false);
    navigate("/search");
  };

  return (
    <>
      <header className="bg-white border-bottom">
        <div className="container-fluid py-1">
          <div className="row align-items-center">
            {/* Logo và Dropdown */}
            {/* Logo Section */}
            <div className="col-3 d-flex align-items-center">
              <img
                src="/images/logosnackshoponline.jpg"
                alt="Snack Shop Logo"
                className="me-3 img-fluid"
                style={{ width: "165px", height: "auto" }}
              />
            </div>

            {/* Tìm kiếm */}
            <form
              className="col-4 col-md-6 mt-2 mt-md-0 d-flex justify-content-center mt-2"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                className="form-control me-2 search"
                placeholder="Tìm kiếm"
                value={Text}
                onChange={(e) => {
                  SetText(e.target.value);
                  if (e.target.value === "") {
                    dispatch(SetTEXT(""));
                  }
                  debouncedApiSuggest(e.target.value);
                }}
                onClick={handleInputClick}
              />
              <button className="btn btn-outline-secondary" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>

            {/* Icon giỏ hàng và thông báo */}
            <div className="col-5 col-md-3 d-flex justify-content-end align-items-center mt-2">
              <NavLink
                className="nav-link active position-relative me-4"
                to={"Cart"}
              >
                <i className="fa fa-cart-plus fs-5 mt-1"></i>
                <span
                  className="position-absolute top-3 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{
                    fontSize: "0.6em",
                    padding: "0.2em 0.4em",
                    minWidth: "1.5em",
                    height: "1.5em",
                  }}
                >
                  {cart?.gioHangChiTiet?.length}
                </span>
              </NavLink>
              {isLoggedIn ? (
                <div className="dropdown me-4">
                  <button
                    className="btn btn-link dropdown-toggle d-flex align-items-center no-caret"
                    type="button"
                    id="userMenuDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="ms-2" style={{ textDecoration: "none" }}>
                      <i className="bi bi-person-circle text-dark fs-4"></i>
                    </span>
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="userMenuDropdown"
                  >
                    <li>
                      <NavLink className="dropdown-item" to={`personal-info`}>
                        Quản lý cá nhân
                      </NavLink>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="dropdown me-4">
                  <button
                    className="btn btn-link dropdown-toggle d-flex align-items-center no-caret"
                    type="button"
                    id="userMenuDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="ms-2" style={{ textDecoration: "none" }}>
                      <i className="bi bi-person-circle text-dark fs-4"></i>
                    </span>
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="userMenuDropdown"
                  >
                    <li>
                      <NavLink className="dropdown-item" to="/login">
                        Đăng nhập
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/register">
                        Đăng ký
                      </NavLink>
                    </li>
                  </ul>
                </div>
              )}

              <NavLink className="me-4 d-flex align-items-center" to="#">
                <i className="fa fa-bell fs-4 text-dark"></i>
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-nav">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" activeClassName="active">
                  Danh Mục
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/search"
                  activeClassName="active"
                >
                  Tìm kiếm
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/voucher"
                  activeClassName="active"
                >
                  Voucher
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/bai-dang"
                  activeClassName="active"
                >
                  Bài đăng
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/allproduct/FindProductTopSell"
                  activeClassName="active"
                >
                  Bán Chạy
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/allproduct/FindProductThisWeek"
                  activeClassName="active"
                >
                  Hàng Mới
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        {showPopup && (
          <div
            className="popup row"
            style={{
              position: "absolute",
              top: "20%",
              left: "30%",
              zIndex: 999,
              borderRadius: "20px",
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)",
              backgroundColor: "white",
              width: "620px",
              padding: "20px",
            }}
          >
            <div className="popup-content">
              <div className="history row mx-auto">
                {Text == "" ? (
                  <div
                    className="col-md-6 "
                    style={{ borderRight: "1px solid black" }}
                  >
                    <h5
                      style={{
                        fontWeight: "bold",
                        marginBottom: "1rem",
                        color: "#333",
                      }}
                    >
                      Lịch sử
                    </h5>
                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                      {historySearch.slice(0, 10).map((object, index) => {
                        return (
                          <li
                            key={index}
                            onClick={async () => {
                              const res = await axios({
                                url: `http://localhost:8080/Product/FindbyName?name=${object}`,
                                method: "GET",
                              });
                              const api = ListProductSearch(res.data);
                              SetText(object);
                              dispatch(api);
                              dispatch(SetTEXT(object));
                              setShowPopup(false);
                              let updateHistory = [object, ...historySearch];
                              SethistorySearch(updateHistory);
                              localStorage.setItem(
                                "HistorySearch",
                                JSON.stringify(updateHistory)
                              );
                              navigate("/search");
                            }}
                            style={{
                              marginBottom: "0.5rem",
                              color: "#555",
                              cursor: "pointer",
                            }}
                          >
                            {object}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <div
                    className="col-md-6 "
                    style={{ borderRight: "1px solid black" }}
                  >
                    <h5
                      style={{
                        fontWeight: "bold",
                        marginBottom: "1rem",
                        color: "#333",
                      }}
                    >
                      Gợi ý tìm kiếm
                    </h5>
                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                      {suggest.map((object, index) => {
                        return (
                          <li
                            key={index}
                            dangerouslySetInnerHTML={{
                              __html: highlightText(object, Text),
                            }}
                            onClick={async () => {
                              const res = await axios({
                                url: `http://localhost:8080/Product/FindbyName?name=${object}`,
                                method: "GET",
                              });
                              const api = ListProductSearch(res.data);
                              SetText(object);
                              dispatch(api);
                              dispatch(SetTEXT(object));
                              setShowPopup(false);
                              let updateHistory = [object, ...historySearch];
                              SethistorySearch(updateHistory);
                              localStorage.setItem(
                                "HistorySearch",
                                JSON.stringify(updateHistory)
                              );
                              navigate("/search");
                            }}
                            style={{
                              marginBottom: "0.5rem",
                              color: "#555",
                              cursor: "pointer",
                            }}
                          ></li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <div className="col-md-6">
                  <div className="keywords ms-1">
                    <h5
                      style={{
                        fontWeight: "bold",
                        marginBottom: "1rem",
                        color: "#333",
                      }}
                    >
                      Sản phẩm mua nhiều nhất
                    </h5>
                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                      {mostpbuyed.map((sp, index) => {
                        return (
                          <li
                            key={sp.san_phamId}
                            onClick={async () => {
                              const res = await axios({
                                url: `http://localhost:8080/Product/FindbyNamenew?name=${sp.ten_san_pham}`,
                                method: "GET",
                              });
                              const api = ListProductSearch(res.data);
                              SetText(sp.ten_san_pham);
                              dispatch(api);
                              dispatch(SetTEXT(sp.ten_san_pham));
                              setShowPopup(false);
                              let updateHistory = [
                                sp.ten_san_pham,
                                ...historySearch,
                              ];
                              SethistorySearch(updateHistory);
                              localStorage.setItem(
                                "HistorySearch",
                                JSON.stringify(updateHistory)
                              );
                              navigate("/search");
                            }}
                            style={{
                              marginBottom: "0.5rem",
                              color: "#555",
                              cursor: "pointer",
                            }}
                          >
                            {" "}
                            <b className="me-2">{index + 1}</b>{" "}
                            {sp.ten_san_pham}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default NewHeader;
