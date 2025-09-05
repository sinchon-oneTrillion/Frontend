import api from './instace.js';

// 카드 리스트 조회
export const getCards = async (nickname) => {
  try {
    const response = await api.get(`/api/main/cards/${nickname}`);
    return response.data;
  } catch (error) {
    console.error('API 호출 실패:', error.response?.data || error.message);
    console.error(
      '요청 URL:',
      `https://saechi.shop/api/main/cards/${nickname}`
    );
    throw error;
  }
};

// 카드 완료 등록
export const submitCardCompletion = async (nickname, cards) => {
  const response = await api.post(`/api/main/check/${nickname}`, { cards });
  return response.data;
};

// 이미지 업로드
export const uploadImage = async (nickname, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await api.post(`/calendar/${nickname}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 캘린더 상세 등록
export const createCalendarDetail = async (nickname, data) => {
  const response = await api.post(`/calendar/${nickname}`, data);
  return response.data;
};

// 캘린더 상세 조회
export const getCalendarDetail = async (nickname, date) => {
  const response = await api.get(`/calendar/${nickname}/${date}`);
  return response.data;
};

// 캘린더 월별 조회
export const getCalendarMonth = async (nickname, month) => {
  const response = await api.get(`/calendar/${nickname}/${month}`);
  return response.data;
};

// 캘린더 상세 수정 (PATCH)
export const updateCalendarDetail = async (nickname, date, data) => {
  const response = await api.patch(`/calendar/${nickname}/${date}`, data);
  return response.data;
};
