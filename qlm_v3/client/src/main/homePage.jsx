import "../css/fonts.css";
import { MDBBadge, MDBContainer } from "mdb-react-ui-kit";
import { useAuth } from "../utils/authContext";

export default function HomePage() {
  const { isLoggedIn, user } = useAuth();

  return (
    <MDBContainer className="my-5 d-flex flex-column align-items-center">
      {isLoggedIn && user ? (
        <h2 className="noto-serif-tc-font">{user?.username}，您好！歡迎使用</h2>
      ) : (
        <h2 className="noto-serif-tc-font">
          請點選右上方{" "}
          <MDBBadge color="primary">
            <span className="chiron-hei-hk-font">登入</span>
          </MDBBadge>
        </h2>
      )}

      <h1 className="noto-serif-tc-font mt-4">捷世林檢驗合格證管理系統</h1>
    </MDBContainer>
  );
}
