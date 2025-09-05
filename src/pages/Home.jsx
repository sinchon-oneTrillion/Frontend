import { useState, useEffect } from 'react';
import { HabitchecklistCard } from '../shared/components/HabitChecklistCard';
import { getHomeStatus } from '../apis/home';
import face1 from '../assets/face1.png';
import face2 from '../assets/face2.png';

export const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const nickname = localStorage.getItem('onboarding_nickname') || "사용자닉네임";

  useEffect(() => {
    const fetchHomeStatus = async () => {
      try {
        const data = await getHomeStatus(nickname);
        if (data && typeof data.is_achieved === 'boolean') {
          setIsCompleted(data.is_achieved);
        }
      } catch (error) {
        console.log('홈 상태 가져오기 실패:', error);
      }
    };

    fetchHomeStatus();
  }, [nickname]);

  const handleHomeButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleHabitsCompleted = async () => {
    try {
      const data = await getHomeStatus(nickname);
      if (data && typeof data.is_achieved === 'boolean') {
        setIsCompleted(data.is_achieved);
      }
    } catch (error) {
      console.log('홈 상태 업데이트 실패:', error);
      setIsCompleted(true);
    }
    setShowPopup(false);
  };

  // 랜덤 격려글 배열
  const encouragementMessages = [
    "우리, 오늘도 머리를 지켜봐요!",
    "건강한 모발을 위한 하루 시작!",
    "새치 예방, 오늘도 화이팅!",
    "당신의 머리카락이 고마워해요!",
    "꾸준함이 만드는 아름다운 모발!",
    "오늘도 멋진 헤어를 위해!",
    "모발 관리의 달인이 되어봐요!",
    "새치 없는 윤기나는 머리카락!",
    "오늘 하루도 모발 건강 챙기세요!"
  ];

  // 랜덤 격려글 선택
  const getRandomMessage = () => {
    return encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
  };

    // 오늘 날짜 (9/5 형식)
    const today = new Date();
    const month = today.getMonth() + 1; // getMonth()는 0부터 시작하니까 +1
    const day = today.getDate();
    const formattedDate = `${month}/${day}`;

  return (
    <div className="flex flex-col items-center h-full bg-gradient-to-b from-[#FFF600] to-[#FFBC2B] overflow-hidden">
      {/* 랜덤 격려글 */}
      <div className="flex items-center justify-center mt-20" style={{
        borderRadius: '2px',
        background: 'rgba(255, 252, 252, 0.50)',
        width: '290px',
        height: '51px',
        flexShrink: 0
      }}>
        <span className="text-lg text-semibold font-medium" style={{color: '#000', opacity: 1}}>{getRandomMessage()}</span>
      </div>

      {/* Today */}
      <div className="flex flex-col items-center space-y-4 mt-auto mb-0">
        <div className="text-white flex flex-col items-center" style={{
          color: '#FFF',
          fontFamily: 'Roboto',
          fontSize: '40px',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: '100%',
          letterSpacing: '-0.32px'
        }}>
        Today
        <div style={{
          color: '#FFF',
          fontFamily: 'Roboto',
          fontSize: '20px',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: '100%',
          letterSpacing: '-0.32px',
          marginTop: '10px'
        }}>{formattedDate}</div>
        </div>
        <button className="cursor-pointer" onClick={handleHomeButtonClick}>
          <img src={isCompleted ? face2 : face1} alt="머리" className="w-80 h-auto" />
        </button>
        </div>

      {showPopup && <HabitchecklistCard onClose={handleClosePopup} onComplete={handleHabitsCompleted} />}
    </div>
  );
};