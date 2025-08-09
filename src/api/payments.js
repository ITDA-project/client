import api from "./api"; // 우리가 설정한 중앙 axios 인스턴스

/**
 * 환불에 필요한 결제 정보(impUid, amount)를 가져오는 API
 * @param {object} data - { userId, sessionId, somoimId }
 * @returns {Promise}
 */
export const getRefundInfoAPI = (data) => {
  return api.post("/payments/info", data);
};

/**
 * 결제를 환불 처리하는 API
 * @param {object} data - { amount, impUid }
 * @returns {Promise}
 */
export const refundPaymentAPI = (data) => {
  return api.post("/payments/refund", data);
};
