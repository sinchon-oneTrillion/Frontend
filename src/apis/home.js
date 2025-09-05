import axios from 'axios';

//체크리스트 전체 선택 유무 확인

export const getHomeStatus = async (nickname) => {
  try {
    const response = await axios.get(`/home`);
    return response.data;
  } catch (error) {
    console.log('홈 상태 정보 가져오는데 실패했습니다: ', error);
    throw error;
  }
};

// 습관 카드 리스트 가져오기
export const getHabitCards = async (nickname) => {
  try {
    const encodedNickname = encodeURIComponent(nickname);
    const response = await axios.get(`/api/cards/${encodedNickname}`);
    return response.data;
  } catch (error) {
    console.error('습관 데이터를 가져오는데 실패했습니다:', error);
    throw error;
  }
};

// 완료된 습관 카드 전송
export const completeHabitCards = async (nickname, cards) => {
  try {
    const encodedNickname = encodeURIComponent(nickname);
    const response = await axios.post(
      `/api/cards/complete/${encodedNickname}`,
      {
        cards,
      }
    );
    return response.data;
  } catch (error) {
    console.error('습관 완료 전송에 실패했습니다:', error);
    throw error;
  }
};
