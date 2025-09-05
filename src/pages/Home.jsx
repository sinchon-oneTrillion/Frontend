import { useState } from 'react';
import { HabitchecklistCard } from '../shared/components/HabitChecklistCard';
import skin1 from '../assets/skin1.png';

export const Home = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleHomeButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
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
    "건강한 습관이 예쁜 머리를 만들어요",
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
    <div className="flex flex-col items-center h-full bg-gray-300 overflow-hidden">
      {/* 랜덤 격려글 */}
      <div className="w-[300px] h-[50px] bg-white border rounded-md shadow flex items-center justify-center mt-20">
        <span className="text-lg font-medium">{getRandomMessage()}</span>
      </div>

      {/* Today */}
      <div className="flex flex-col items-center space-y-4 mt-auto mb-0">
        <div className="flex flex-col items-center text-2xl font-semibold">
        Today
        <div className="text-black text-2xl">{formattedDate}</div>
        </div>
        <button className="cursor-pointer" onClick={handleHomeButtonClick}>
          <img src={skin1} alt="머리" className="w-80 h-auto" />
        </button>
        </div>

      {showPopup && <HabitchecklistCard onClose={handleClosePopup} />}
    </div>
  );
};