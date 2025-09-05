// src/apis/auth.js
import client from './client';

export const signup = async (nickname) => {
  if (!nickname) throw new Error('닉네임이 필요합니다');

  const url = '/api/users/signup';
  const body = { nickname };

  console.groupCollapsed('%c[API REQ] signup', 'color:#0ea5e9');
  console.log('→ url:', url);
  console.log('→ body:', body);
  console.groupEnd();

  try {
    const { data, status } = await client.post(url, body);
    console.groupCollapsed('%c[API RES] signup', 'color:#22c55e');
    console.log('✓ status:', status);
    console.log('✓ data:', data);
    console.groupEnd();
    return data; // { status, user_id, message }
  } catch (err) {
    console.groupCollapsed('%c[API ERR] signup', 'color:#ef4444');
    console.log('✗ message:', err?.message);
    console.log('✗ response.status:', err?.response?.status);
    console.log('✗ response.data:', err?.response?.data);
    console.groupEnd();
    throw err;
  }
};

export const login = async (nickname) => {
  if (!nickname) throw new Error('닉네임이 필요합니다');

  const url = '/api/users/login';
  const body = { nickname };

  console.groupCollapsed('%c[API REQ] login', 'color:#0ea5e9');
  console.log('→ url:', url);
  console.log('→ body:', body);
  console.groupEnd();

  try {
    const { data, status } = await client.post(url, body);
    console.groupCollapsed('%c[API RES] login', 'color:#22c55e');
    console.log('✓ status:', status);
    console.log('✓ data:', data);
    console.groupEnd();
    return data; // { status, nickname, message }
  } catch (err) {
    console.groupCollapsed('%c[API ERR] login', 'color:#ef4444');
    console.log('✗ message:', err?.message);
    console.log('✗ response.status:', err?.response?.status);
    console.log('✗ response.data:', err?.response?.data);
    console.groupEnd();
    throw err;
  }
};
