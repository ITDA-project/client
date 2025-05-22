import React from "react";
import { WebView } from "react-native-webview";
import { Alert, Linking, Platform } from "react-native";
import axios from "axios";

const PaymentScreen = ({ route, navigation }) => {
  const { amount, title } = route.params;

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
        console.log("결제 요청");
        IMP.request_pay({
          pg: "html5_inicis",
          pay_method: "card",
          merchant_uid: "mid_" + new Date().getTime(),
          name: "${title}",
          amount: ${amount},
          buyer_email: "test@example.com",
          buyer_name: "홍길동",
          buyer_tel: "010-1234-5678",
          buyer_addr: "서울시 강남구",
          buyer_postcode: "123-456",
          m_redirect_url: "https://iamport.app/redirect",
        }, function(rsp) {
          window.ReactNativeWebView?.postMessage(JSON.stringify(rsp));
        });
      }

      setTimeout(requestPay, 100); // 로딩 안정화를 위해 딜레이 추가
    </script>
  </body>
  </html>
  `;

  const handleMessage = async (e) => {
    console.log("📩 수신 메시지 (원본):", e.nativeEvent.data);

    try {
      const data = JSON.parse(e.nativeEvent.data);

      if (data.success) {
        const { imp_uid, merchant_uid, paid_amount } = data;

        console.log("✅ imp_uid:", imp_uid);
        console.log("✅ merchant_uid:", merchant_uid);
        console.log("✅ amount:", paid_amount);

        try {
          await axios.post("http://10.0.2.2:8080/api/payments/verify", {
            impUid: imp_uid,
            merchantUid: merchant_uid,
          });

          Alert.alert("결제 성공", "서버에 결제 정보가 전달되었습니다.", [{ text: "확인", onPress: () => navigation.goBack() }]);
        } catch (err) {
          console.error("❌ 서버 전송 실패:", err);
          Alert.alert("전송 실패", "서버로 결제 정보를 전달하는 데 실패했습니다.");
        }
      } else {
        Alert.alert("결제 실패", data.error_msg || "알 수 없는 오류");
      }
    } catch (err) {
      console.log("🔵 메시지 파싱 오류 또는 비정상 데이터:", e.nativeEvent.data);
    }
  };

  const handleUrlScheme = (event) => {
    const url = event.url;

    if (url.startsWith("http") || url.startsWith("https")) return true;

    if (url.startsWith("intent://") || url.startsWith("ispmobile://") || url.startsWith("supertoss://") || url.startsWith("v3mobileplusweb://")) {
      if (Platform.OS === "android") {
        try {
          Linking.openURL(url);
        } catch (e) {
          Alert.alert("앱 실행 실패", "필요한 앱이 설치되지 않았습니다.");
        }
      }
      return false;
    }

    return true;
  };

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
