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

// ... 다른 신청 관련 API 함수들 ...
