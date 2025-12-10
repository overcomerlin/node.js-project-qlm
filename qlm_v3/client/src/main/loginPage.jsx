import { useState } from "react";
import { useAuth } from "../utils/authContext";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { MDBBadge, MDBBtn, MDBContainer, MDBInput } from "mdb-react-ui-kit";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  if (isLoggedIn) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      // navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed, please try again later."
      );
    }
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <form onSubmit={handleSubmit}>
        <h3 className="mb-3 text-center">
          請輸入使用者
          <MDBBadge className="info" light>
            帳號
          </MDBBadge>
          及
          <MDBBadge className="info" light>
            密碼
          </MDBBadge>
        </h3>
        <MDBInput
          wrapperClass="mb-4"
          label="使用者帳號"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <MDBInput
          wrapperClass="mb-4"
          label="使用者密碼"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-danger text-center">{error}</p>}
        <div className="text-center">
          <MDBBtn className="fs-6" type="submit">
            登入
          </MDBBtn>
        </div>
      </form>
    </MDBContainer>
  );
}
