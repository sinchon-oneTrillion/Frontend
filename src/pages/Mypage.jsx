import { useEffect, useMemo, useState } from 'react';
import Container from '../shared/components/layouts/Container';

const ALL_CARDS = [
  '검은 콩 먹기',
  '두피마사지 10번 하기',
  '하루 물 2L 마시기',
  '머리에게 칭찬하기',
];

export default function Mypage() {
  const nickname = localStorage.getItem('onboarding_nickname') || '';

  const [origCards, setOrigCards] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem('onboarding_choices') || '[]'
    );
    setOrigCards(saved);
    setSelected(saved);
  }, []);

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const hasChanges = useMemo(() => {
    const a = [...origCards].sort().join('|');
    const b = [...selected].sort().join('|');
    return a !== b;
  }, [origCards, selected]);

  const toggle = (label) =>
    setSelected((s) =>
      s.includes(label) ? s.filter((x) => x !== label) : [...s, label]
    );

  const saveLocal = () => {
    localStorage.setItem('onboarding_choices', JSON.stringify(selected));
    alert('로컬에 저장했습니다. (API 없음)');
    setOrigCards(selected);
  };

  const done = () => {
    saveLocal();
    window.location.href = '/';
  };

  return (
    <Container className="max-w-[720px] mx-auto">
      <section className="mb-8">
        <h2 className="mb-2 text-base text-gray-700">닉네임</h2>
        <div className="text-xl font-semibold tracking-[0.25em] uppercase">
          {nickname || '-'}
        </div>
      </section>

      <h3 className="mb-6 text-[18px] font-semibold">
        내가 형성하고 싶은 습관
      </h3>

      <ul className="space-y-4">
        {ALL_CARDS.map((label) => {
          const active = selectedSet.has(label);
          return (
            <li
              key={label}
              onClick={() => toggle(label)}
              className={`relative w-full cursor-pointer rounded-xl border bg-white p-5 transition
                ${active ? 'border-black/70' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <span className="text-[15px] pr-10">{label}</span>
              <span
                aria-hidden
                className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border
                  ${active ? 'border-black bg-black' : 'border-gray-300 bg-white'}`}
              />
            </li>
          );
        })}
      </ul>

      <div className="mt-12 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={saveLocal}
          disabled={!hasChanges}
          className={`h-12 w-28 rounded-lg text-white ${
            hasChanges ? 'bg-gray-400' : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          수정
        </button>
        <button
          type="button"
          onClick={done}
          disabled={!hasChanges}
          className={`h-12 w-28 rounded-lg text-white ${
            hasChanges
              ? 'bg-black hover:opacity-90'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          완료
        </button>
      </div>
    </Container>
  );
}
