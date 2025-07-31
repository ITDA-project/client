import React, { useState, useRef } from "react";
import { WebView } from "react-native-webview";
import { Alert, Linking, Platform } from "react-native";
import { AlertModal } from "../components";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

const PaymentScreen = ({ route, navigation }) => {
  const { amount, title, somoimId, sessionId } = route.params;

  const [paymentData, setPaymentData] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(null); // goBack 등을 지정할 수 있는 콜백

  const hasProcessedPayment = useRef(false);

  const handleUrlScheme = (event) => {
    const url = event.url;

    if (url.startsWith("moamoa://payment-success")) {
      try {
        const urlObj = new URL(url);
        const imp_uid = urlObj.searchParams.get("imp_uid");
        const merchant_uid = urlObj.searchParams.get("merchant_uid");
        const imp_success = urlObj.searchParams.get("imp_success");

        console.log("📦 결제 콜백 파라미터:", { imp_uid, merchant_uid, imp_success });

        if (imp_success === "true" && imp_uid && merchant_uid) {
          processPaymentSuccess(imp_uid, merchant_uid);
        }
      } catch (err) {
        console.error("❌ URL 파싱 에러:", err);
      }
      return false;
    }

    if (url.startsWith("http") || url.startsWith("https")) return true;

    if (Platform.OS === "android") {
      if (url.startsWith("intent://") || url.startsWith("ispmobile://") || url.startsWith("supertoss://") || url.startsWith("v3mobileplusweb://")) {
        try {
          Linking.openURL(url);
        } catch (e) {
          console.error("❌ 앱 실행 에러:", e);
          setAlertMessage("필요한 앱이 설치되지 않았습니다.");
          setAlertVisible(true);
        }
        return false;
      }
    }

    return true;
  };

  const processPaymentSuccess = (imp_uid, merchant_uid) => {
    if (hasProcessedPayment.current) return;

    hasProcessedPayment.current = true;

    console.log("💫 결제 성공 처리 시작", { imp_uid, merchant_uid, somoimId });

    const paymentInfo = {
      imp_uid,
      merchant_uid,
      success: true,
    };

    // sendPaymentDataToServer 함수에 somoimId를 함께 전달
    sendPaymentDataToServer(paymentInfo);
  };

  // sendPaymentDataToServer 함수에 somoimId 매개변수 추가
  const sendPaymentDataToServer = async (data) => {
    try {
      const { imp_uid, merchant_uid } = data;
      const accessToken = await EncryptedStorage.getItem("accessToken");
      console.log("엑세스 토큰: ", accessToken);

      if (!accessToken) {
        console.log("인증 오류! 로그인이 필요합니다.");
        return;
      }

      payload = {
        impUid: imp_uid,
        merchantUid: merchant_uid,
        somoimId, // somoimId 추가
        sessionId, // 세션 ID 추가
      };
      console.log("📤 결제 정보 전송:", payload);

      // 백엔드 API 요청 시 somoimId를 body에 포함
      const response = await axios.post("http://10.0.2.2:8080/api/payments/verify", payload, {
        headers: {
          access: accessToken,
        },
      });

      console.log("✅ 결제 정보 전송 성공:", response.data);

      setAlertMessage("결제가 성공적으로 완료되었습니다.");
      setOnConfirmAction(() => () => navigation.goBack()); // 확인 시 goBack 실행
      setAlertVisible(true);
    } catch (err) {
      console.error("❌ 서버 전송 실패:", err.response?.data || err.message);

      setAlertMessage("서버로 결제 정보를 전달하는 데\n실패했습니다.");
      setAlertVisible(true);

      setOnConfirmAction(() => () => navigation.goBack()); // 확인 시 goBack 실행
    }
  };

  // 결제 웹뷰의 amount에 route.params로 받은 amount 변수 사용
  const html = `
  <!DOCTYPE html>
  <html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js"></script>
  </head>
  <body>
    <script>
      var IMP = window.IMP;
      IMP.init("imp35072674");

      function requestPay() {
        IMP.request_pay({
          pg: "html5_inicis",
          pay_method: "card",
          merchant_uid: "mid_" + new Date().getTime(),
          name: "${title}",
          amount: 100, 
          buyer_name: "홍길동", // 추후 사용자의 이름으로 수정 필요
          buyer_tel: "010-1234-5678",
          m_redirect_url: "moamoa://payment-success",
        }, function(rsp) {
          window.ReactNativeWebView?.postMessage(JSON.stringify(rsp));
        });
      }

      setTimeout(requestPay, 100); // 로딩 안정화를 위해 딜레이 추가
    </script>
  </body>
  </html>
  `;

  return (
    <>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        onShouldStartLoadWithRequest={handleUrlScheme}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScriptBeforeContentLoaded={""} // 생략 가능
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          console.log("💬 WebView 메시지:", data);
        }}
      />
      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onConfirm={() => {
          setAlertVisible(false);
          if (onConfirmAction) onConfirmAction(); // goBack 등 실행
        }}
      />
    </>
  );
};

export default PaymentScreen;
