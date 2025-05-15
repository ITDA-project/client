import React from "react";
import { WebView } from "react-native-webview";
import { Alert } from "react-native";

const PaymentScreen = ({ route }) => {
  const { pg, amount, title } = route.params;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js"></script>
      <script>
        document.addEventListener("DOMContentLoaded", function () {
          var IMP = window.IMP;
          IMP.init("imp57080566");

          IMP.request_pay({
            pg: "${pg}",
            pay_method: "card",
            merchant_uid: "order_" + new Date().getTime(),
            name: "${title}",
            amount: ${amount},
            buyer_name: "홍길동",
            buyer_tel: "01012345678"
          }, function (rsp) {
            if (rsp.success) {
              window.ReactNativeWebView.postMessage("✅ 결제 성공: " + rsp.imp_uid);
            } else {
              window.ReactNativeWebView.postMessage("❌ 결제 실패: " + rsp.error_msg);
            }
          });
        });
      </script>
    </head>
    <body></body>
    </html>
  `;

  return <WebView originWhitelist={["*"]} source={{ html }} onMessage={(e) => Alert.alert("결제 결과", e.nativeEvent.data)} />;
};

export default PaymentScreen;
