// src/pages/onboarding/SelectView.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../../shared/components/layouts/Container';
import { chooseInitialCards } from '../../apis/cards';

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
  const [saving, setSaving] = useState(false);

  const toggle = (label) =>
    setSelected((s) =>
      s.includes(label) ? s.filter((x) => x !== label) : [...s, label]
    );

  async function saveAndGo() {
    if (!selected.length || saving) return;

    const nickname = localStorage.getItem('onboarding_nickname') || '';
    if (!nickname) {
      alert('닉네임 정보가 없습니다. 로그인/회원가입 후 진행해 주세요.');
      navigate('/onboarding');
      return;
    }

    try {
      setSaving(true);
      // 선택값 서버 반영이 필요하면 유지
      await chooseInitialCards(nickname, selected);
      localStorage.setItem('onboarding_choices', JSON.stringify(selected));
      navigate('/home');
    } catch (e) {
      alert(e?.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container className="max-w-[375px] mx-auto">
      <h1 className="mb-10 text-center text-[20px] leading-[36px] font-medium">
        내가 형성하고 싶은 습관은?
      </h1>

      <ul className="grid grid-cols-1 gap-3 max-w-md mx-auto place-items-center">
        {OPTIONS.map((o) => {
          const active = selected.includes(o.label);
          return (
            <li
              key={o.id}
              onClick={() => toggle(o.label)}
              className={`flex w-[283px] h-[44px] items-center  border p-4 cursor-pointer transition
                          bg-white shadow-sm
                          ${active ? 'border-black/70' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <span
                aria-hidden
                className={`mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border
                            ${active ? 'border-black' : 'border-gray-400'}`}
              >
                {active && <span className="h-3 w-3 rounded-full bg-black" />}
              </span>

              <span className="text-sm">{o.label}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => navigate('/onboarding')}
          className="h-[36px] w-[85px] rounded-lg bg-white text-[#020202] uppercase tracking-[0.2em] font-semibold border border-black"
        >
          뒤로
        </button>

        <button
          onClick={saveAndGo}
          disabled={!selected.length || saving}
          className={`h-[36px] w-[85px] rounded-lg bg-black text-white font-semibold ${
            selected.length && !saving
              ? 'bg-black hover:opacity-90'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {saving ? '저장 중…' : '완료'}
        </button>
      </div>
    </Container>
  );
}
