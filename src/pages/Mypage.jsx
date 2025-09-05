// src/pages/Mypage.jsx
import { useEffect, useMemo, useState } from 'react';
import Container from '../shared/components/layouts/Container';

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
  const [error, setError] = useState('');

  async function fetchMyPage(nick) {
    const res = await fetch(`/mypage/${encodeURIComponent(nick)}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || '마이페이지 조회 실패');
    return data; // { status, message, nickname, cards }
  }

  async function patchMyPage(nick, addCards, removeCards) {
    const res = await fetch(`/mypage/${encodeURIComponent(nick)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname: nick,
        add_cards: addCards,
        remove_cards: removeCards,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || '마이페이지 수정 실패');
    return data; // { status, message, nickname, cards }
  }

  useEffect(() => {
    if (!nicknameParam) {
      setError('닉네임 정보를 찾을 수 없습니다. 온보딩부터 진행해 주세요.');
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const data = await fetchMyPage(nicknameParam);

        setNickname(data?.nickname || nicknameParam);

        const serverCards = Array.isArray(data?.cards) ? data.cards : [];
        const normalizedSet = new Set(serverCards.map(normalize));
        const initSelected = ALL_CARDS.filter((label) =>
          normalizedSet.has(normalize(label))
        );

        setOrigCards(initSelected);
        setSelected(initSelected);
      } catch (e) {
        setError(e?.message || '마이페이지 조회 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [nicknameParam]);

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

  const toggle = (label) => {
    setSelected((s) =>
      s.includes(label) ? s.filter((x) => x !== label) : [...s, label]
    );
  };

  const complete = async () => {
    if (!hasChanges || saving) {
      // window.location.href = '/';
      return;
    }
    try {
      setSaving(true);
      const data = await patchMyPage(nicknameParam, addCards, removeCards);

      const serverCards = Array.isArray(data?.cards) ? data.cards : [];
      const normalizedSet = new Set(serverCards.map(normalize));
      const synced = ALL_CARDS.filter((label) =>
        normalizedSet.has(normalize(label))
      );

      setOrigCards(synced);
      setSelected(synced);
      setNickname(data?.nickname || nicknameParam);

      window.location.href = '/';
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
  if (error) {
    return (
      <Container className="max-w-[720px] mx-auto">
        <div className="py-10 text-red-600">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="max-w-[720px] mx-auto">
      {/* 닉네임(서버 값) */}
      <section className="mb-8">
        <h2 className="mb-2 text-base text-gray-700">닉네임</h2>
        <div className="text-xl font-semibold tracking-[0.25em] uppercase">
          {nickname || '-'}
        </div>
      </section>

      {/* 제목 */}

      <h3 className="mb-6 text-[18px] font-semibold">
        내가 형성하고 싶은 습관
        <p className="text-red-600 font-medium">습관목록을 수정합니다</p>
      </h3>

      {/* 카드 리스트: 항상 토글 가능 */}
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

      {/* 완료(서버 반영) */}
      <div className="mt-12 flex items-center justify-center">
        <button
          type="button"
          onClick={complete}
          disabled={!hasChanges || saving}
          className={`h-12 w-28 rounded-lg text-white ${
            hasChanges && !saving
              ? 'bg-black hover:opacity-90'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {saving ? '반영 중…' : '완료'}
        </button>
      </div>
    </Container>
  );
}
