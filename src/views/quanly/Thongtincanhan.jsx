import { Navigate } from "react-router-dom";

function Thongtincanhan() {
  const token = localStorage.getItem("jwtToken");
  if(!token){
    return <Navigate to="/login" replace />;
  }

  return <div>Thông tin cá nhân</div>;
}
export default Thongtincanhan;
