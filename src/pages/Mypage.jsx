// src/pages/Mypage.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../shared/components/layouts/Container';
import { getMypage, patchMypage } from '../apis/mypage';

const DEFAULT_CARDS = [
  '두피 5분 마사지 하기',
  '비오틴 포함 영양제 챙겨먹기',
  '견과류 한 줌 먹기',
  '두피 자외선 차단하기',
  '오늘 하루 기분 일기 쓰기',
];

const normalize = (s) => (s || '').replace(/\s+/g, '').trim();
const uniqByNormalize = (arr) => {
  const seen = new Set();
  const out = [];
  for (const s of arr) {
    const k = normalize(s);
    if (k && !seen.has(k)) {
      seen.add(k);
      out.push(s);
    }
  }
  return out;
};
const mapToCatalogLabels = (names, catalog) => {
  const map = new Map(catalog.map((lbl) => [normalize(lbl), lbl]));
  return names.map((n) => map.get(normalize(n))).filter(Boolean);
};

export default function Mypage() {
  const navigate = useNavigate();
  const nicknameParam = localStorage.getItem('onboarding_nickname') || '';

  // 렌더에 쓰는 카드 카탈로그(서버+기본 합집합)
  const [catalog, setCatalog] = useState(DEFAULT_CARDS);

  const [nickname, setNickname] = useState('');
  const [origCards, setOrigCards] = useState([]); // 서버 기준 활성값
  const [selected, setSelected] = useState([]); // 현재 토글 상태
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        const rawCards = Array.isArray(data?.cards) ? data.cards : [];

        // 서버 응답 형태 파악 (객체 배열 vs 문자열 배열)
        const looksObject =
          rawCards.length > 0 &&
          typeof rawCards[0] === 'object' &&
          rawCards[0] !== null &&
          'list' in rawCards[0];

        let allFromServer = [];
        let selectedFromServer = [];

        if (looksObject) {
          // 같은 list 중복 제거 + achieve는 OR 집계
          const byKey = new Map(); // key = normalize(list) -> { list, achieve }
          for (const item of rawCards) {
            const list = String(item?.list || '').trim();
            if (!list) continue;
            const key = normalize(list);
            const prev = byKey.get(key);
            const ach = Boolean(item?.achieve);
            byKey.set(key, { list, achieve: prev?.achieve || ach });
          }
          const merged = Array.from(byKey.values());
          allFromServer = merged.map((v) => v.list);
          selectedFromServer = merged
            .filter((v) => v.achieve)
            .map((v) => v.list);
        } else {
          // 혹시 문자열 배열로 올 수도 있으므로 방어
          allFromServer = rawCards.map(String);
          selectedFromServer = rawCards.map(String);
        }

        // 카탈로그: 기본 + 서버 전체
        const tmpCatalog = uniqByNormalize([
          ...DEFAULT_CARDS,
          ...allFromServer,
        ]);

        // 초기 선택: 서버 활성 → 카탈로그 라벨로 매핑
        let initSelected = mapToCatalogLabels(selectedFromServer, tmpCatalog);

        // 폴백: 서버 활성값이 하나도 없으면 로컬스토리지 사용
        if (initSelected.length === 0) {
          const local = JSON.parse(
            localStorage.getItem('onboarding_choices') || '[]'
          );
          initSelected = mapToCatalogLabels(local, tmpCatalog);
        }

        setCatalog(tmpCatalog);
        setNickname(nicknameParam);
        setOrigCards(initSelected);
        setSelected(initSelected);

        // 디버깅
        console.groupCollapsed('%c[MYPAGE INIT]', 'color:#6366f1');
        console.table(rawCards);
        console.log('allFromServer:', allFromServer);
        console.log('selectedFromServer:', selectedFromServer);
        console.log('tmpCatalog:', tmpCatalog);
        console.log('initSelected(final):', initSelected);
        console.groupEnd();
      } catch (e) {
        setNickname('');
        setCatalog(DEFAULT_CARDS);
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

      // 서버로는 문자열만 보냄
      const data = await patchMypage(nicknameParam, addCards, removeCards);
      // 패치 응답은 문자열 배열이라고 가정 (백엔드 명세)
      let serverSelected = Array.isArray(data?.cards) ? data.cards : [];

      // 혹시 객체 형태로 올 경우도 방어
      if (
        serverSelected.length > 0 &&
        typeof serverSelected[0] === 'object' &&
        serverSelected[0] !== null &&
        'list' in serverSelected[0]
      ) {
        serverSelected = serverSelected.map((it) => String(it?.list || ''));
      }

      // 카탈로그에 서버 최종 선택도 합치기(혹시 기본 리스트에 없는 문자열 대비)
      const nextCatalog = uniqByNormalize([...catalog, ...serverSelected]);

      // 서버 최종 선택을 카탈로그 라벨로 매핑해서 화면 즉시 반영
      const synced = mapToCatalogLabels(serverSelected, nextCatalog);

      setCatalog(nextCatalog);
      setOrigCards(synced); // 기준값을 갱신
      setSelected(synced); // 화면 즉시 동기화
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
        {catalog.map((label) => {
          const active = selectedSet.has(label);
          return (
            <li
              key={label}
              onClick={() => toggle(label)}
              className={`relative flex items-center w-[283px] h-11
                          border bg-white px-4 cursor-pointer transition
                          ${active ? 'border-black/70' : 'border-gray-300 hover:bg-gray-50'}`}
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
