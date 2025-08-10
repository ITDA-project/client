import { Platform } from "react-native";

// 개발 모드인지 확인하는 전역 변수 (__DEV__는 리액트 네이티브가 제공)
const isDevelopment = __DEV__;

// 🚨 여기에 실제 운영 서버 주소를 입력해주세요.
const PROD_ROOT_URL = "https://api.moamoa.com/api";

const DEV_ROOT_URL = Platform.select({
  ios: "http://127.0.0.1:8080",
  android: "http://10.0.2.2:8080",
});

// 개발/운영 환경에 따라 올바른 URL을 선택하여 내보냅니다.
const ROOT_URL = isDevelopment ? DEV_ROOT_URL : PROD_ROOT_URL;

export default API_BASE_URL = `${ROOT_URL}/api`;
export const WEBSOCKET_URL = `${ROOT_URL}/ws`;
