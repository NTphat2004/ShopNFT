// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate

// const useAuth = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const navigate = useNavigate(); // Khởi tạo useNavigate

//   useEffect(() => {
//     const checkAuth = async () => {
//       const response = await fetch("http://localhost:8080/dashboard", {
//         method: "GET",
//         credentials: "include",
//       });

//       if (response.ok) {
//         setIsAuthenticated(true);
//       } else {
//         setIsAuthenticated(false);
//         navigate("/login"); // Chuyển hướng đến login nếu chưa xác thực
//       }
//     };

//     checkAuth();
//   }, [navigate]); // Thêm navigate vào dependency array

//   return { isAuthenticated, setIsAuthenticated }; // Trả về một đối tượng
// };

// export default useAuth;
