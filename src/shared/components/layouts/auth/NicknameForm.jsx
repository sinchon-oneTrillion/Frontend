import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../Container';

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

  const title = mode === 'signup' ? '닉네임으로 회원가입' : '닉네임으로 로그인';
  const buttonText = mode === 'signup' ? '회원가입' : '로그인';

  function handleSubmit(e) {
    e.preventDefault();
    const msg = validate(nickname);
    if (msg) return setError(msg);

    setLoading(true);
    const nn = nickname.trim();
    localStorage.setItem('auth_mode', mode);
    localStorage.setItem('onboarding_nickname', nn);
    if (mode === 'signup') {
      localStorage.removeItem('onboarding_choices');
    }

    const nextPath = mode === 'login' ? '/main' : '/onboarding/select';
    setTimeout(() => navigate(nextPath), 100);
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
            className="h-12 w-36 rounded-lg bg-gray-300 text-white uppercase tracking-[0.2em] font-semibold"
          >
            뒤로
          </button>
          <button
            type="submit"
            disabled={!!error || nickname.trim().length < 2 || loading}
            className={`h-12 w-36 rounded-lg text-white uppercase tracking-[0.2em] font-semibold ${
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
