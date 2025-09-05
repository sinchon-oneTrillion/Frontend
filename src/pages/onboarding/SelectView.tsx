import { useState } from 'react';

const OPTIONS = [
  { id: 'opt_a', label: '옵션 A' },
  { id: 'opt_b', label: '옵션 B' },
  { id: 'opt_c', label: '옵션 C' },
];

export default function SelectView() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="mb-10 text-center text-[30px] leading-[36px] font-semibold">
        내가 형성하고 싶은 습관
      </h1>
      <ul className="grid grid-cols-1 gap-3">
        {OPTIONS.map((o) => {
          const active = selected.includes(o.id);
          return (
            <li
              key={o.id}
              onClick={() => toggle(o.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === 'Enter' || e.key === ' ') && toggle(o.id)
              }
              className={`flex items-center gap-3 rounded-xl border p-4 transition cursor-pointer
    ${active ? 'border-black bg-black/5' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <span className="text-sm">{o.label}</span>

              <span
                aria-hidden
                className={`ml-auto h-5 w-5 rounded-full border shrink-0
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
          onClick={() => {
            localStorage.setItem(
              'onboarding_choices',
              JSON.stringify(selected)
            );
            window.location.href = '/mypage';
          }}
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
    </div>
  );
}
