// src/apis/mypage.js
import client from './client';

const toStringArray = (v) => (Array.isArray(v) ? v.map(String) : []);

const rethrow = (label, err) => {
  console.groupCollapsed('%c[API ERR] ' + label, 'color:#ef4444');
  console.log('✗ message:', err?.message);
  console.log('✗ response.status:', err?.response?.status);
  console.log('✗ response.data:', err?.response?.data);
  console.groupEnd();
  throw new Error(
    err?.response?.data?.message || err?.message || 'Request failed'
  );
};

/** 마이페이지 조회
 * GET /api/mypage/{nickname}
 * res: { httpStatus, userId, cards: [{list:string, achieve:boolean}, ...] }
 */
export const getMypage = async (nickname) => {
  if (!nickname) throw new Error('에러: 닉네임이 필요합니다');
  const url = `/api/mypage/${encodeURIComponent(nickname)}`;
  const params = { nickname };

  console.groupCollapsed('%c[API REQ] getMypage', 'color:#0ea5e9');
  console.log('→ url:', url);
  console.log('→ params:', params);
  console.groupEnd();

  try {
    const { data, status } = await client.get(url, { params });
    console.groupCollapsed('%c[API RES] getMypage', 'color:#22c55e');
    console.log('✓ status:', status);
    console.log('✓ data:', data);
    console.groupEnd();
    return data; // { httpStatus, userId, cards:[{list,achieve}] }
  } catch (err) {
    rethrow('getMypage', err);
  }
};

/** 마이페이지 수정
 * PATCH /api/mypage/{nickname}
 * body: { nickname, add_cards: string[], remove_cards: string[] }
 * res : { status, message, nickname, cards: string[] }
 */
export const patchMypage = async (
  nickname,
  add_cards = [],
  remove_cards = []
) => {
  if (!nickname) throw new Error('닉네임이 필요합니다');
  const url = `/api/mypage/${encodeURIComponent(nickname)}`;
  const body = {
    nickname,
    add_cards: toStringArray(add_cards),
    remove_cards: toStringArray(remove_cards),
  };

  console.groupCollapsed('%c[API REQ] patchMypage', 'color:#0ea5e9');
  console.log('→ url:', url);
  console.log('→ body:', body);
  console.groupEnd();

  try {
    const { data, status } = await client.patch(url, body);
    console.groupCollapsed('%c[API RES] patchMypage', 'color:#22c55e');
    console.log('✓ status:', status);
    console.log('✓ data:', data);
    console.groupEnd();
    return data; // { status, message, nickname, cards }
  } catch (err) {
    rethrow('patchMypage', err);
  }
};
