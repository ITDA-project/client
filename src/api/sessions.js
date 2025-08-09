import api from "./api"; // 우리가 설정한 중앙 axios 인스턴스

/**
 * 세션(모임)을 종료 처리하는 API
 * @param {object} data - { roomId, sessionId }
 * @returns {Promise}
 */
export const endSessionAPI = (data) => {
  return api.post("/sessions/end", data);
};

/**
 * 세션(모임) 시작 API
 * @param {object} data - { roomId, sessionDate, sessionTime, price, location }
 * @returns {Promise}
 */
export const startSessionAPI = (data) => {
  return api.post("/sessions/start", data);
};

/**
 * 채팅방의 활성 세션 정보 조회 API
 * @param {string|number} roomId
 * @returns {Promise}
 */
export const getActiveSessionByRoomAPI = (roomId) => {
  return api.get(`/sessions/chatroom/${roomId}/active`);
};
