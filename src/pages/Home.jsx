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
    <div className="flex flex-col items-center h-full bg-gray-300 overflow-hidden">
      {/* 실천 n일째 박스 */}
      <div className="w-[250px] h-[30px] bg-white border rounded-md shadow flex items-center justify-center mt-6">
        <span className="text-lg font-medium">우리, 오늘도 머리를 지켜봐요!</span>
      </div>

      {/* Today */}
      <div className="flex flex-col items-center space-y-4 mt-auto mb-0">
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