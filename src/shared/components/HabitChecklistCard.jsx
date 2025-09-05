import { useState, useEffect } from 'react';
import { getHabitCards, completeHabitCards } from '../../apis/home';

const imgRadioBase = "http://localhost:3845/assets/13fe777cd0f71483e930b356d82512fc8e0b1e3b.svg";
const imgRadioDot = "http://localhost:3845/assets/89f47b654e0d2e8c8d2fefec52602ce7d519887e.svg";

const RadioButton = ({ checked, onClick }) => {
  return (
    <div 
      className="relative shrink-0 size-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute inset-0">
        <img alt="" className="block max-w-none size-full" src={imgRadioBase} />
      </div>
      {checked && (
        <div className="absolute inset-1/4">
          <img alt="" className="block max-w-none size-full" src={imgRadioDot} />
        </div>
      )}
    </div>
  );
};

export const HabitchecklistCard = ({ onClose, onComplete }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 실제 로그인 시스템에서 nickname 가져오기
  const nickname = localStorage.getItem('onboarding_nickname') || "사용자닉네임";

  // Mock data for fallback
  const mockHabits = [
    { id: 1, title: "검은 콩 먹기", completed: false },
    { id: 2, title: "두피마사지 10번 하기", completed: false },
    { id: 3, title: "물 8잔 마시기", completed: false },
    { id: 4, title: "검은 콩 먹기", completed: false },
    { id: 5, title: "두피마사지 10번 하기", completed: false },
  ];

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const data = await getHabitCards(nickname);
        console.log('API 응답 데이터:', data);
        
        // API 응답 구조에 맞게 처리
        if (data && data.cards && Array.isArray(data.cards)) {
          const habitsData = data.cards.map((card, index) => ({
            id: index + 1,
            title: card.list,
            completed: card.achieve
          }));
          setHabits(habitsData);
        } else if (data && Array.isArray(data)) {
          // 만약 data 자체가 배열인 경우
          const habitsData = data.map((card, index) => ({
            id: index + 1,
            title: card.list || card.title,
            completed: card.achieve || card.completed || false
          }));
          setHabits(habitsData);
        } else {
          console.log('예상하지 못한 API 응답 구조, mock data 사용');
          setHabits(mockHabits);
        }
      } catch (error) {
        console.log('API 연결 실패, mock data 사용:', error);
        // API 연결 실패 시 mock data 사용
        setHabits(mockHabits);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [nickname]);

  const handleHabitToggle = (id) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const completedCards = habits.filter(habit => habit.completed).map(habit => habit.title);
      await completeHabitCards(nickname, completedCards);
      alert('오늘도 수고하셨습니다!');
      onComplete();
    } catch (error) {
      console.log('API 연결 실패, 로컬에서 완료 처리:', error);
      alert('오늘도 수고하셨습니다!');
      onComplete();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white box-border content-stretch flex flex-col gap-[30px] items-center justify-center px-[23px] py-11 relative">
          <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
          <div className="text-[#212121] text-sm">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="box-border content-stretch flex flex-col gap-[30px] items-center justify-center px-[40px] py-11 relative" style={{
        borderRadius: '16px',
        border: '1px solid #020202',
        background: '#FFF',
        boxShadow: '0 2px 0 0 #000'
      }}>
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
          aria-label="닫기"
          >
        ×
        </button>
      
      {habits.map((habit) => (
        <div 
          key={habit.id}
          className=" content-stretch flex gap-2.5 h-[59px] items-center justify-start px-3.5 py-[17px] relative shrink-0 w-60 cursor-pointer"
          onClick={() => handleHabitToggle(habit.id)}
        >
          <div className="content-stretch flex gap-3 items-center justify-start relative shrink-0">
            <RadioButton 
              checked={habit.completed}
              onClick={() => handleHabitToggle(habit.id)}
            />
            <span className="flex-1" style={{
              color: '#080000',
              fontFeatureSettings: '"liga" off, "clig" off',
              fontFamily: 'Roboto',
              fontSize: '18px',
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: '16px',
              letterSpacing: '1.25px',
              textTransform: 'uppercase'
            }}>
              {habit.title}
            </span>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="cursor-pointer"
        style={{
          display: 'flex',
          width: '85px',
          height: '36px',
          padding: '10px 12px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4px',
          flexShrink: 0,
          borderRadius: '4px',
          background: '#212121'
        }}
      >
        <div className="font-medium leading-[0] relative shrink-0 text-[14px] text-nowrap text-white tracking-[1.25px] uppercase">
          <p className="leading-[16px] whitespace-pre">완료</p>
        </div>
      </button>
      </div>
    </div>
  );
};
