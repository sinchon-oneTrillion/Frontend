// src/apis/cards.js
import client from './client';

const rethrow = (label, err) => {
  console.groupCollapsed(`%c[API ERR] ${label}`, 'color:#ef4444');
  console.log('✗ message:', err?.message);
  console.log('✗ response.status:', err?.response?.status);
  console.log('✗ response.data:', err?.response?.data);
  console.groupEnd();
  throw new Error(
    err?.response?.data?.message || err?.message || 'Request failed'
  );
};

/** 카드 초기 리스트 선택
 * POST /api/cards/choice/{nickname}
 * body: { cards: string[] }
 * res:  { httpStatus: "CREATED", card_count: number }
 */
export const chooseInitialCards = async (nickname, cards = []) => {
  if (!nickname) throw new Error('닉네임이 필요합니다');
  const url = `/api/cards/choice/${encodeURIComponent(nickname)}`;
  const body = { cards };

  console.groupCollapsed('%c[API REQ] chooseInitialCards', 'color:#0ea5e9');
  console.log('→ url:', url);
  console.log('→ body:', body);
  console.groupEnd();

  try {
    const { data, status } = await client.post(url, body);

    console.groupCollapsed('%c[API RES] chooseInitialCards', 'color:#22c55e');
    console.log('✓ status:', status);
    console.log('✓ data:', data); // { httpStatus, card_count }
    console.groupEnd();

    return data;
  } catch (err) {
    rethrow('chooseInitialCards', err);
  }
};
