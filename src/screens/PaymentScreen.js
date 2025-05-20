import React from "react";
import { WebView } from "react-native-webview";
import { Alert, Linking, Platform } from "react-native";
import axios from "axios";

const PaymentScreen = ({ route, navigation }) => {
  const { amount, title } = route.params;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <script src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js"></script>
        <script>
          document.addEventListener("DOMContentLoaded", function () {
            var IMP = window.IMP;
            IMP.init("imp35072674");
            window.ReactNativeWebView.postMessage("🟡 IMP 초기화 완료");

            IMP.request_pay({
              pg: "html5_inicis",
              pay_method: "card",
              merchant_uid: "order_" + new Date().getTime(),
              name: "결제 테스트", // 나중에 수정
              amount: ${amount},
              buyer_name: "테스트",// 나중에 수정
              buyer_tel: "01012345678"// 나중에 수정
            }, function (rsp) {
              window.ReactNativeWebView.postMessage("🟢 결제 콜백 도착");

              if (rsp.success) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  success: true,
                  imp_uid: rsp.imp_uid,
                  merchant_uid: rsp.merchant_uid,
                  paid_amount: rsp.paid_amount
                }));
              } else {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  success: false,
                  error_msg: rsp.error_msg
                }));
              }
            });
          });
        </script>
      </head>
      <body>
      </body>
    </html>
  `;

  const handleMessage = async (e) => {
    console.log("📩 수신 메시지:", e.nativeEvent.data);

    try {
      const data = JSON.parse(e.nativeEvent.data);

      if (data.success) {
        const { imp_uid, merchant_uid, paid_amount } = data;

        console.log("✅ imp_uid:", imp_uid);
        console.log("✅ merchant_uid:", merchant_uid);
        console.log("✅ amount:", paid_amount);

        try {
          await axios.post("https://10.0.2.2:8080/api/payments/verify", {
            impUid: imp_uid,
            merchantUid: merchant_uid,
            //amount: paid_amount, 이건 안넘겨도 되나?..
          });

          Alert.alert("결제 성공", "서버에 결제 정보가 전달되었습니다.", [{ text: "확인", onPress: () => navigation.goBack() }]);
        } catch (err) {
          console.error("❌ 서버 전송 실패:", err);
          Alert.alert("전송 실패", "서버로 결제 정보를 전달하는 데 실패했습니다.");
        }
      } else {
        Alert.alert("결제 실패", data.error_msg);
      }
    } catch (err) {
      console.log("🔵 단순 메시지:", e.nativeEvent.data);
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
