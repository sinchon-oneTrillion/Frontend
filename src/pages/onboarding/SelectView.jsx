// src/pages/onboarding/SelectView.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../../shared/components/layouts/Container';

const OPTIONS = [
  { id: 'a', label: '검은 콩 먹기' },
  { id: 'b', label: '두피마사지 10번 하기' },
  { id: 'c', label: '하루 물 2L 마시기' },
];

export default function SelectView() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(
    JSON.parse(localStorage.getItem('onboarding_choices') || '[]')
  );

  const toggle = (label) =>
    setSelected((s) =>
      s.includes(label) ? s.filter((x) => x !== label) : [...s, label]
    );

  function saveAndGo() {
    localStorage.setItem('onboarding_choices', JSON.stringify(selected));
    navigate('/main');
  }

  return (
    <Container>
      <h1 className="mb-10 text-center text-[30px] leading-[36px] font-semibold">
        내가 형성하고 싶은 습관
      </h1>

      <ul className="grid grid-cols-1 gap-3 max-w-md mx-auto">
        {OPTIONS.map((o) => {
          const active = selected.includes(o.label);
          return (
            <li
              key={o.id}
              onClick={() => toggle(o.label)}
              className={`relative w-full cursor-pointer rounded-xl border p-4 transition
                ${active ? 'border-black bg-black/5' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <span className="text-sm pr-10">{o.label}</span>
              <span
                aria-hidden
                className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border
                  ${active ? 'border-black bg-black' : 'border-gray-300 bg-white'}`}
              />
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex items-center justify-center gap-6">
        <a
          href="/onboarding"
          className="h-12 w-36 rounded-lg bg-gray-300 text-white uppercase tracking-[0.2em] font-semibold flex items-center justify-center"
        >
          이전
        </a>
        <button
          onClick={saveAndGo}
          disabled={!selected.length}
          className={`h-12 w-36 rounded-lg text-white uppercase tracking-[0.2em] font-semibold ${
            selected.length
              ? 'bg-black hover:opacity-90'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          완료
        </button>
      </div>
    </Container>
  );
}
