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

    // 오늘 날짜 (9/5 형식)
    const today = new Date();
    const month = today.getMonth() + 1; // getMonth()는 0부터 시작하니까 +1
    const day = today.getDate();
    const formattedDate = `${month}/${day}`;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-300 space-y-6 pt-20">
      {/* 실천 n일째 박스 */}
      <div className="w-[200px] h-[25px] bg-white border rounded-md shadow flex items-center justify-center">
        <span className="text-sm font-medium">실천 n일째</span>
      </div>

      {/* Today */}
      <div className="mt-auto flex flex-col items-center space-y-4">
        <div className="flex flex-col items-center text-lg font-semibold">
        Today
        <div className="text-black text-sm">{formattedDate}</div>
        </div>
        <button className="cursor-pointer" onClick={handleHomeButtonClick}>
          <img src={skin1} alt="머리" className="w-40 h-auto" />
        </button>
        </div>

      {showPopup && <HabitchecklistCard onClose={handleClosePopup} />}
    </div>
  );
};