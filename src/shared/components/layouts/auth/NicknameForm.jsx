// src/shared/components/layouts/auth/NicknameForm.jsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../Container';
import { signup, login } from '../../../../apis/auth';

function getUUID() {
  if (typeof window === 'undefined') return '';
  const KEY = 'onboarding_uuid';
  let v = localStorage.getItem(KEY);
  if (!v) {
    v = crypto.randomUUID();
    localStorage.setItem(KEY, v);
  }
  return v;
}

function validate(n) {
  const t = n.trim();
  const re = /^[a-zA-Z0-9가-힣_-]{2,12}$/;
  if (!t) return '닉네임을 입력해 주세요.';
  if (!re.test(t)) return '2~12자, 한/영/숫자, (_,-)만 가능해요.';
  return '';
}

/** props.mode: "signup" | "login" */
export default function NicknameForm({ mode = 'signup' }) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const uuid = useMemo(() => getUUID(), []);

  const title = mode === 'signup' ? '회원가입' : '로그인';
  const buttonText = mode === 'signup' ? '회원가입' : '로그인';

  async function handleSubmit(e) {
    e.preventDefault();

    const msg = validate(nickname);
    if (msg) {
      setError(msg);
      return;
    }

    const nn = nickname.trim();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await signup(nn); // POST /api/users/signup
        console.log('[Signup Response]', res);
        if (typeof res?.user_id !== 'undefined') {
          localStorage.setItem('onboarding_user_id', String(res.user_id));
        }
        localStorage.setItem('onboarding_nickname', nn);
        localStorage.setItem('auth_mode', 'signup');
        localStorage.removeItem('onboarding_choices');
        navigate('/onboarding/select');
      } else {
        const res = await login(nn); // POST /api/users/login
        console.log('[Login Response]', res);
        localStorage.setItem('onboarding_nickname', res?.nickname || nn);
        localStorage.setItem('auth_mode', 'login');
        navigate('/home');
      }
    } catch (err) {
      // ---- 에러 분기 처리 ----
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message || err?.message || '';

      if (
        mode === 'login' &&
        (status === 404 ||
          /not\s*found|존재하지|없(습니다|어요)/i.test(serverMsg))
      ) {
        alert('등록되어있지 않은 유저입니다. 회원가입을 해주세요.');
      } else if (
        mode === 'signup' &&
        (status === 409 || /이미|중복|duplicate/i.test(serverMsg))
      ) {
        alert('이미 등록되어있는 유저입니다. 다른 닉네임을 입력해주세요.');
      } else {
        alert(serverMsg || '요청 실패');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="max-w-[375px] mx-auto">
      <h1 className="mb-10 text-center text-[30px] leading-[36px] font-semibold">
        {title}
      </h1>

      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[375px]">
        <input
          type="text"
          placeholder="NICKNAME"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setError(validate(e.target.value));
          }}
          maxLength={12}
          className="block mx-auto h-[44px] w-[238px] rounded-md bg-white px-5 uppercase
                     tracking-[0.25em] placeholder-gray-400 text-gray-700 outline-none"
        />

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/onboarding')}
            className="h-[36px] w-[85px] rounded-lg bg-white text-[#020202] uppercase tracking-[0.2em] font-semibold border border-black"
          >
            뒤로
          </button>
          <button
            type="submit"
            disabled={!!error || nickname.trim().length < 2 || loading}
            className={`h-[36px] w-[85px] rounded-lg bg-[#020202] text-white uppercase tracking-[0.2em] font-semibold ${
              !error && nickname.trim().length >= 2 && !loading
                ? 'bg-black hover:opacity-90'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? '처리 중…' : buttonText}
          </button>
        </div>
      </form>
    </Container>
  );
}
