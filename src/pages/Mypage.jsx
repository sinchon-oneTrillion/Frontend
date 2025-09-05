// src/pages/Mypage.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const nicknameParam = localStorage.getItem('onboarding_nickname') || '';

  const [nickname, setNickname] = useState('');
  const [origCards, setOrigCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- 초기 조회 ---
  // --- 초기 조회 ---
  useEffect(() => {
    if (!nicknameParam) {
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
        // API: { httpStatus, userId, cards:[{list, achieve}] }
        const serverCards = Array.isArray(data?.cards) ? data.cards : [];

        // 1) 서버에서 achieve=true 인 라벨만 뽑기
        const serverSelected = serverCards
          .filter((c) => c?.achieve)
          .map((c) => String(c?.list || ''));

        // 2) ALL_CARDS와 정확히 매핑(공백 제거 normalize 사용)
        const labelMap = new Map(ALL_CARDS.map((lbl) => [normalize(lbl), lbl]));
        const mappedFromServer = serverSelected
          .map((lbl) => labelMap.get(normalize(lbl)))
          .filter(Boolean); // ALL_CARDS에 없는 라벨은 제거

        // 3) 폴백: 서버에서 매칭되는 게 없으면 로컬스토리지 선택값 사용
        let initSelected = mappedFromServer;
        if (initSelected.length === 0) {
          const local = JSON.parse(
            localStorage.getItem('onboarding_choices') || '[]'
          );
          initSelected = local
            .map((lbl) => labelMap.get(normalize(lbl)))
            .filter(Boolean);
        }

        setNickname(nicknameParam);
        setOrigCards(initSelected);
        setSelected(initSelected);

        // 디버깅 로그(원인 파악에 도움)
        console.groupCollapsed('%c[MYPAGE INIT]', 'color:#6366f1');
        console.log('serverSelected raw:', serverSelected);
        console.log('mappedFromServer:', mappedFromServer);
        console.log(
          'fallback local:',
          JSON.parse(localStorage.getItem('onboarding_choices') || '[]')
        );
        console.log('initSelected(final):', initSelected);
        console.groupEnd();
      } catch (e) {
        setNickname('');
        setOrigCards([]);
        setSelected([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [nicknameParam]);

  // --- 비교/토글 ---
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

  // --- 저장 ---
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
      const data = await patchMypage(nicknameParam, addCards, removeCards);

      const serverSelected = Array.isArray(data?.cards) ? data.cards : [];
      const setFromServer = new Set(serverSelected.map(normalize));
      const synced = ALL_CARDS.filter((label) =>
        setFromServer.has(normalize(label))
      );

      setOrigCards(synced);
      setSelected(synced);
      setNickname(data?.nickname || nicknameParam);
      alert('수정이 반영되었습니다.');
    } catch (e) {
      alert(e?.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // --- UI ---
  if (loading) {
    return (
      <Container className="max-w-[720px] mx-auto">
        <div className="py-10">로딩 중…</div>
      </Container>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('onboarding_nickname');
    localStorage.removeItem('auth_mode');
    localStorage.removeItem('onboarding_user_id');
    localStorage.removeItem('onboarding_choices');
    navigate('/onboarding', { replace: true });
  };

  return (
    <Container
      className="max-w-[720px] mx-auto !pt-16 md:!pt-20"
      bgClassName="bg-gradient-to-b from-[#FFF600] to-[#FFBC2B]"
    >
      <section className="-mt-[81px] mb-8">
        <h3 className="text-[20px] mt-[81px] mb-2 font-bold ml-[53px] text-[#000000]">
          닉네임
        </h3>
        <div className="text-[20px] font-light uppercase text-[#000000] ml-[53px]">
          {nickname && nickname.trim() ? nickname : '로그인을 해주세요'}
        </div>
      </section>

      <h3 className="mb-5 text-[18px] font-semibold whitespace-nowrap ml-[53px]">
        내가 형성하고 싶은 습관은?{' '}
        <p className="text-red-500 font-medium text-[14px]">수정하기</p>
      </h3>

      <ul className="space-y-4 ml-[47px]">
        {ALL_CARDS.map((label) => {
          const active = selectedSet.has(label);
          return (
            <li
              key={label}
              onClick={() => toggle(label)}
              className={`relative flex items-center w-[283px] h-11
                          border bg-white px-4 cursor-pointer transition
                          ${active ? 'border-white/70' : 'border-white/70 hover:bg-gray-50'}`}
            >
              {/* 왼쪽 토글 */}
              <span
                aria-hidden
                className={`mr-3 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border
                            ${active ? 'border-black' : 'border-gray-300'}`}
              >
                {active && <span className="h-3 w-3 rounded-full bg-black" />}
              </span>
              <span className="text-[15px]">{label}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-12 flex items-center justify-center">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className={`h-[36px] w-[85px] rounded-lg text-white ${
            hasChanges && !saving ? 'bg-black hover:opacity-90' : 'bg-gray-400'
          }`}
        >
          {saving ? '반영 중…' : '완료'}
        </button>
      </div>

      <section className="mt-10 mb-5 text-center">
        <span
          role="button"
          tabIndex={0}
          onClick={handleLogout}
          onKeyDown={(e) =>
            (e.key === 'Enter' || e.key === ' ') && handleLogout()
          }
          className="inline-block text-sm text-gray-600 cursor-pointer hover:underline hover:text-gray-900"
        >
          로그아웃
        </span>
      </section>
    </Container>
  );
}
