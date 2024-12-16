import "../../vendor/bootstrap/css/bootstrap.min.css";
import "../../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../../fonts/Linearicons-Free-v1.0.0/icon-font.min.css";
import "../../vendor/animate/animate.css";
import "../../vendor/css-hamburgers/hamburgers.min.css";
import "../../vendor/animsition/css/animsition.min.css";
import "../../vendor/select2/select2.min.css";
import "../../vendor/daterangepicker/daterangepicker.css";
import "../../styles/util.css";
import "../../styles/main.css";
import bgImage from "../../assets/images/bg-01.jpg";
import { useEffect, useState } from "react";
import $ from "jquery";
import { notification } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
//import { Navigate } from "react-router";

const Newlogin1 = () => {
  const [accountID, setAccountID] = useState(null);
  const [password, setPassword] = useState("");
  const [hinhanh, setHinhanh] = useState("");
  const navigate = useNavigate();

  // const testDeploy = async () => {
  //   const response = await fetch(
  //     "https://thanhnehihi.as.r.appspot.com/xinchao",
  //     {
  //       method: "GET",
  //     }
  //   ); // Hoặc .text() nếu API trả về texts
  //   const data = await response.text();
  //   console.log("Đây nè trời: ", data);
  // };

  // const testDeploy = async () => {
  //   try {
  //     const response = await fetch("http://localhost:8080/xinchao", {
  //       method: "GET",
  //     });

  //     // Đợi chuyển đổi từ JSON
  //     const data = await response.json();

  //     // Kiểm tra dữ liệu trả về
  //     console.log("Đây nè trời: ", data);

  //     // Nếu data là mảng, lấy phần tử đầu tiên
  //     if (Array.isArray(data) && data.length > 0) {
  //       console.log("Hình ảnh nè trời: ", data[0].hinhanh);
  //       setHinhanh(data[0].hinhanh); // Đặt hình ảnh từ phần tử đầu tiên
  //     } else {
  //       console.log("Dữ liệu không hợp lệ hoặc rỗng.");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi gọi API: ", error);
  //   }
  // };

  // useEffect(() => {
  //   testDeploy();
  // }, []);
  const handleLogin = (e) => {
    e.preventDefault();
    if (accountID === "" || password === "") {
      notification.error({
        message: "Đăng nhập thất bại",
        description: `Vui lòng nhập đầy đủ họ và tên !`,
        duration: 1, // thời gian hiển thị
        onMouseEnter: () => notification.destroy(),
      });
      return;
    }
    fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountID: accountID,
        password: password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            //throw new Error(errorData.message || "Đăng nhập thất bại.");
            notification.error({
              message: "Đăng nhập thất bại",
              description: errorData.message || "Đăng nhập thất bại.",
              duration: 1, // thời gian hiển thị
              onMouseEnter: () => notification.destroy(),
            }); // Lấy thông báo lỗi từ server
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        console.log("Roles:", data.roles);
        if (data.token && !data.roles.includes("User")) {
          // Lưu token vào localStorage hoặc sessionStorage
          localStorage.setItem("jwtToken", data.token);
          localStorage.setItem("data", JSON.stringify(data));
          const decode = jwtDecode(data.token);
          console.log("Decode nè:", decode);
          console.log("hihi: ", decode.sub);
          console.log("Roles nè trời: ", decode.roles);
          navigate("/dashboard");
          notification.success({
            message: "Đăng nhập thành công",
            description: `Chào mừng ${data.hovaten}!`,
            duration: 1, // thời gian hiển thị
            onMouseEnter: () => notification.destroy(),
          });
          console.log("Token saved:", data.token);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    $(".input100").each(function () {
      $(this).on("blur", function () {
        if ($(this).val().trim() !== "") {
          $(this).addClass("has-val");
        } else {
          $(this).removeClass("has-val");
        }
      });
    });

    return () => {
      $(".input100").off("blur");
    };
  }, []);

  return (
    <div style={{ backgroundColor: "#666666" }} className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <form className="login100-form validate-form">
            <span className="login100-form-title p-b-43">
              Login to continue
            </span>
            <div
              className="wrap-input100 validate-input"
              data-validate="Valid email is required: ex@abc.xyz"
            >
              <input
                className="input100"
                type="text"
                name="accountID"
                value={accountID}
                onChange={(e) => setAccountID(e.target.value)}
              />
              <span className="focus-input100"></span>
              <span className="label-input100">Email</span>
            </div>

            <div
              className="wrap-input100 validate-input"
              data-validate="Password is required"
            >
              <input
                className="input100"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="focus-input100"></span>
              <span className="label-input100">Password</span>
            </div>

            <div className="flex-sb-m w-full p-t-3 p-b-32">
              {/* <div className="contact100-form-checkbox">
                <input
                  className="input-checkbox100"
                  id="ckb1"
                  type="checkbox"
                  name="remember-me"
                />
                <label className="label-checkbox100" htmlFor="ckb1">
                  Remember me
                </label>
              </div>

              <div>
                <a href="#" className="txt1">
                  Forgot Password?
                </a>
              </div> */}
            </div>

            <div className="container-login100-form-btn">
              <button className="login100-form-btn" onClick={handleLogin}>
                Login
              </button>
            </div>

            {/* <div className="text-center p-t-46 p-b-20">
              <span className="txt2">or sign up using</span>
            </div> */}

            <div className="login100-form-social flex-c-m">
              {/* <a
                href="#"
                className="login100-form-social-item flex-c-m bg1 m-r-5"
              >
                <i className="fa fa-facebook-f" aria-hidden="true"></i>
              </a>

              <a
                href="#"
                className="login100-form-social-item flex-c-m bg2 m-r-5"
              >
                <i className="fa fa-twitter" aria-hidden="true"></i>
              </a> */}
            </div>
          </form>

          <div
            className="login100-more"
            style={{ backgroundImage: `url(${bgImage})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Newlogin1;
