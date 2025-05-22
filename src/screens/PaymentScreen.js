import React, { useState, useRef } from "react";
import { WebView } from "react-native-webview";
import { Alert, Linking, Platform } from "react-native";
import axios from "axios";

const PaymentScreen = ({ route, navigation }) => {
  const { amount, title } = route.params;

  const [paymentData, setPaymentData] = useState(null);
  const hasProcessedPayment = useRef(false);

  const processPaymentSuccess = (imp_uid, merchant_uid) => {
    if (hasProcessedPayment.current) return;

    hasProcessedPayment.current = true;

    console.log("💫 결제 성공 처리 시작", { imp_uid, merchant_uid });

    const paymentInfo = {
      imp_uid,
      merchant_uid,
      success: true,
    };

    sendPaymentDataToServer(paymentInfo);
  };

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
          Alert.alert("앱 실행 실패", "필요한 앱이 설치되지 않았습니다.");
        }
        return false;
      }
    }

    return true;
  };

  const sendPaymentDataToServer = async (data) => {
    try {
      const { imp_uid, merchant_uid } = data;

      const response = await axios.post("http://10.0.0.2:8080/api/payments/verify", {
        impUid: imp_uid,
        merchantUid: merchant_uid,
      });

      Alert.alert("결제 성공", "서버에 결제 정보가 전달되었습니다.", [{ text: "확인", onPress: () => navigation.goBack() }]);
    } catch (err) {
      console.error("❌ 서버 전송 실패:", err.response?.data || err.message);
      Alert.alert("전송 실패", "서버로 결제 정보를 전달하는 데 실패했습니다.");
    }
  };

  const handleMessage = async (e) => {
    console.log("📩 수신 메시지 (원본):", e.nativeEvent.data);

    try {
      const data = JSON.parse(e.nativeEvent.data);
      console.log("🔍 파싱된 결제 데이터:", JSON.stringify(data, null, 2));

      if (data.success) {
        // 결제 성공 시 받을 수 있는 모든 데이터 로깅

        setPaymentData(data);
      } else {
        console.log("❌ 결제 실패 정보:", {
          error_code: data.error_code,
          error_msg: data.error_msg,
        });
        Alert.alert("결제 실패", data.error_msg || "알 수 없는 오류");
      }
    } catch (err) {
      console.log("🔵 메시지 파싱 오류 또는 비정상 데이터:", e.nativeEvent.data);
      console.error("파싱 에러:", err);
    }
  };

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
          buyer_name: "홍길동",
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
    <WebView
      originWhitelist={["*"]}
      source={{ html }}
      onMessage={handleMessage}
      onShouldStartLoadWithRequest={handleUrlScheme}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
};

export default PaymentScreen;
