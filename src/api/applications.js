import api from "./api"; // 중앙 axios 인스턴스

/**
 * 모임에 지원서를 제출하는 API
 * @param {string} postId - 지원할 포스트의 ID
 * @param {object} applicationData - { content: '지원 내용' }
 * @returns {Promise}
 */
export const submitApplicationAPI = (postId, applicationData) => {
  return api.post(`/posts/${postId}/form`, applicationData);
};

/**
 * 특정 포스트의 신청서 목록 조회
 * @param {string|number} postId
 * @returns {Promise}
 */
export const listApplicationsAPI = (postId, config = {}) => api.get(`/posts/${postId}/form/list`, config);

/**
 * 특정 신청서 상세 조회
 */
export const getApplicationAPI = (postId, formId, config = {}) => api.get(`/posts/${postId}/form/${formId}`, config);

/**
 * 신청서 상태 변경 (accept/refuse)
 */
export const updateApplicationStatusAPI = (postId, formId, status, config = {}) =>
  api.patch(`/posts/${postId}/form/${formId}/status/${status}`, {}, config);
