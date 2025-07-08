import jwtDecode from "jwt-decode";

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token); // payload 해석
    const now = Date.now() / 1000; // 초 단위 시간
    return decoded.exp < now; // 현재보다 만료 시간이 작으면 true
  } catch (e) {
    return true; // 디코딩 자체가 실패하면 만료된 걸로 간주
  }
};
