// src/pages/Mypage.jsx
import { useEffect, useMemo, useState } from 'react';
import Container from '../shared/components/layouts/Container';
import { getMypage, patchMypage } from '../apis/mypage';

const ALL_CARDS = [
  '검은 콩 먹기',
  '두피마사지 10번 하기',
  '하루 물 2L 마시기',
  '머리에게 칭찬하기',
];

const normalize = (s) => (s || '').replace(/\s+/g, '').trim();

export default function Mypage() {
  const nicknameParam = localStorage.getItem('onboarding_nickname') || '';

  const [nickname, setNickname] = useState('');
  const [origCards, setOrigCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // 화면에는 표시하지 않지만 내부적으로만 사용

  // 초기 조회
  useEffect(() => {
    if (!nicknameParam) {
      setErrorMsg('닉네임 정보를 찾을 수 없어 임시로 [-]로 표시합니다.');
      setNickname('');
      setOrigCards([]);
      setSelected([]);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const data = await getMypage(nicknameParam);
        setNickname(data?.nickname || '');

        const serverCards = Array.isArray(data?.cards) ? data.cards : [];
        const normalizedSet = new Set(serverCards.map(normalize));
        const initSelected = ALL_CARDS.filter((label) =>
          normalizedSet.has(normalize(label))
        );

        setOrigCards(initSelected);
        setSelected(initSelected);
        setErrorMsg('');
      } catch (e) {
        // 실패해도 화면은 계속 렌더. 배너는 안 보임.
        setErrorMsg(e?.message || '마이페이지 조회 실패.');
        setNickname('');
        setOrigCards([]);
        setSelected([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [nicknameParam]);

  // 비교/토글
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const origSet = useMemo(() => new Set(origCards), [origCards]);

  const addCards = useMemo(
    () => selected.filter((c) => !origSet.has(c)),
    [selected, origSet]
  );
  const removeCards = useMemo(
    () => origCards.filter((c) => !selectedSet.has(c)),
    [origCards, selectedSet]
  );
  const hasChanges = addCards.length > 0 || removeCards.length > 0;

  const toggle = (label) =>
    setSelected((s) =>
      s.includes(label) ? s.filter((x) => x !== label) : [...s, label]
    );

  // 저장
  const save = async () => {
    if (saving) return;

    if (!nicknameParam) {
      alert(
        '닉네임 정보가 없어 저장할 수 없습니다. 로그인/회원가입을 진행해 주세요.'
      );
      return;
    }

    if (!hasChanges) {
      alert('수정을 해주세요. (변경된 항목이 없습니다)');
      return;
    }

    try {
      setSaving(true);

      console.groupCollapsed('%c[PATCH PAYLOAD]', 'color:#f59e0b');
      console.log('nickname:', nicknameParam);
      console.log('add_cards:', addCards);
      console.log('remove_cards:', removeCards);
      console.groupEnd();

      const data = await patchMypage(nicknameParam, addCards, removeCards);

      const serverCards = Array.isArray(data?.cards) ? data.cards : [];
      const normalizedSet = new Set(serverCards.map(normalize));
      const synced = ALL_CARDS.filter((label) =>
        normalizedSet.has(normalize(label))
      );

      setOrigCards(synced);
      setSelected(synced);
      setNickname(data?.nickname || '');
      alert('수정이 반영되었습니다.');
    } catch (e) {
      alert(e?.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="max-w-[720px] mx-auto">
        <div className="py-10">로딩 중…</div>
      </Container>
    );
  }

  return (
    <Container className="max-w-[720px] mx-auto !pt-16 md:!pt-20">
      <section className="-mt-2 mb-8">
        <h2 className="mb-2 text-base text-gray-700">닉네임</h2>
        <div className="text-[20px] font-light tracking-[0.25em] uppercase text-gray-400">
          {nickname && nickname.trim() ? nickname : '로그인을 해주세요'}
        </div>
      </section>

      <h3 className="mb-6 text-[18px] font-semibold whitespace-nowrap">
        내가 형성하고 싶은 습관 <span className="text-red-500">[수정하기]</span>
      </h3>

      <ul className="space-y-4">
        {ALL_CARDS.map((label) => {
          const active = selectedSet.has(label);
          return (
            <li
              key={label}
              onClick={() => toggle(label)}
              className={`relative w-full rounded-xl border bg-white p-5 transition cursor-pointer
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

      <div className="mt-12 flex items-center justify-center">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className={`h-12 w-28 rounded-lg text-white ${
            hasChanges && !saving ? 'bg-black hover:opacity-90' : 'bg-gray-400'
          }`}
        >
          {saving ? '반영 중…' : '완료'}
        </button>
      </div>
    </Container>
  );
}
