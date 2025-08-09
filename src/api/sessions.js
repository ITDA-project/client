import api from "./api"; // 우리가 설정한 중앙 axios 인스턴스

/**
 * 세션(모임)을 종료 처리하는 API
 * @param {object} data - { roomId, sessionId }
 * @returns {Promise}
 */
export const endSessionAPI = (data) => {
  return api.post("/sessions/end", data);
};
