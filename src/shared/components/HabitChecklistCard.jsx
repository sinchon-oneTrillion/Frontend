import { useState } from 'react';

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

export const HabitchecklistCard = ({ onClose }) => {
  const mockData = [
    { id: 1, title: '충분한 수면 취하기 (7-8시간)', completed: true },
    { id: 2, title: '규칙적인 운동하기', completed: true },
    { id: 3, title: '스트레스 관리하기', completed: false }
  ];

  const [habits, setHabits] = useState(mockData);

  const handleHabitToggle = (id) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const handleSubmit = () => {
    // Handle submit logic here
    console.log('Submitted habits:', habits);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white box-border content-stretch flex flex-col gap-[30px] items-center justify-center px-[23px] py-11 relative">
        <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none" />
      
      {habits.map((habit) => (
        <div 
          key={habit.id}
          className="bg-white box-border content-stretch flex gap-2.5 h-[59px] items-center justify-start px-3.5 py-[17px] relative shrink-0 w-60 cursor-pointer"
          onClick={() => handleHabitToggle(habit.id)}
        >
          <div aria-hidden="true" className="absolute border-2 border-[#212121] border-solid inset-0 pointer-events-none" />
          <div className="content-stretch flex gap-3 items-center justify-start relative shrink-0">
            <RadioButton 
              checked={habit.completed}
              onClick={() => handleHabitToggle(habit.id)}
            />
            <span className="text-[#212121] text-sm flex-1">
              {habit.title}
            </span>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-[#212121] box-border content-stretch flex gap-1 items-center justify-center px-3 py-2.5 relative rounded-[4px] shrink-0 cursor-pointer"
      >
        <div className="font-medium leading-[0] relative shrink-0 text-[14px] text-nowrap text-white tracking-[1.25px] uppercase">
          <p className="leading-[16px] whitespace-pre">BUTTON</p>
        </div>
      </button>
      </div>
    </div>
  );
};
