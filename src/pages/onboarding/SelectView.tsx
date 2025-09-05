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
              className={`relative w-full cursor-pointer rounded-xl border p-4 transition
    ${active ? 'border-black bg-black/5' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <span className="text-sm pr-10"> {o.label} </span>

              <span
                className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border
      ${active ? 'border-black bg-black' : 'border-gray-300 bg-white'}`}
                aria-hidden
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
            window.location.href = '/';
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
