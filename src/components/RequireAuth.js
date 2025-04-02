import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import useRequireLogin from "../hooks/useRequireLogin";

const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  const { checkLogin, LoginAlert } = useRequireLogin();

  useEffect(() => {
    if (!user) {
      checkLogin("로그인"); // 로그인 화면으로 이동하는 대신 모달을 띄움
    }
  }, [user]);

  return (
    <>
      {user ? children : null}
      <LoginAlert />
    </>
  );
};

export default RequireAuth;
