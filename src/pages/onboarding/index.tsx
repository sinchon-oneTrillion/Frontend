// src/pages/onboarding/index.tsx
import { useMemo, useState } from 'react';

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
function validate(n: string) {
  const t = n.trim();
  const re = /^[a-zA-Z0-9가-힣_-]{2,12}$/;
  if (!t) return '닉네임을 입력해 주세요.';
  if (!re.test(t)) return '2~12자, 한/영/숫자, (_,-)만 가능해요.';
  return '';
}

export default function OnboardingIndex() {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const uuid = useMemo(() => getUUID(), []);
  const canSubmit =
    !error && nickname.trim().length >= 2 && nickname.trim().length <= 12;

  return (
    <div>

        <h1 className="mb-10 text-center text-[30px] leading-[36px] font-semibold">
        닉네임을 입력해주세요
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const msg = validate(nickname);
          if (msg) return setError(msg);
          localStorage.setItem('onboarding_nickname', nickname.trim());
          window.location.href = '/onboarding/select';
        }}
        className="mx-auto w-full max-w-md"
      >
        <input
          type="text"
          placeholder="NICKNAME"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setError(validate(e.target.value));
          }}
          maxLength={12}
          className= "block mx-auto h-[44px] w-[238px] rounded-md bg-white px-5 uppercase
             tracking-[0.25em] placeholder-gray-400 text-gray-700
             outline-none"/>
      
        {/* <p
          className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}
        >
          {error || '공백은 자동으로 제거돼요.'}
        </p> */}

        <div className="mt-12 flex items-center justify-center gap-6">
          <a
            href="/"
            className="h-12 w-36 rounded-lg bg-gray-300 text-white uppercase tracking-[0.2em] font-semibold flex items-center justify-center"
          >
            버튼1
          </a>
          <button
            type="submit"
            disabled={!canSubmit}
            className={`h-12 w-36 rounded-lg text-white uppercase tracking-[0.2em] font-semibold ${
              canSubmit
                ? 'bg-black hover:opacity-90'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            다음
          </button>
        </div>
      </form>
    </div>
  );
}
