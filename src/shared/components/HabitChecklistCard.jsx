import { useState } from 'react';

export const HabitchecklistCard = ({ onClose }) => {
  const mockData = [
    { id: 1, title: '충분한 수면 취하기 (7-8시간)', completed: false },
    { id: 2, title: '규칙적인 운동하기', completed: false },
    { id: 3, title: '스트레스 관리하기', completed: true }
  ];

  const [habits, setHabits] = useState(mockData);

  const handleCheckboxChange = (id) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[1000]">
      <div className="bg-gray-500 p-5 rounded-lg relative max-w-md max-h-[80vh] overflow-auto">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 bg-transparent border-none text-xl cursor-pointer"
        >
          ×
        </button>
        <div className="mt-6">
          <h2 className="text-white text-lg font-bold mb-4">새치 예방 습관 체크리스트</h2>
          <div className="space-y-3">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`habit-${habit.id}`}
                  checked={habit.completed}
                  onChange={() => handleCheckboxChange(habit.id)}
                  className="w-4 h-4"
                />
                <label 
                  htmlFor={`habit-${habit.id}`}
                  className={`text-white ${habit.completed ? 'line-through opacity-60' : ''}`}
                >
                  {habit.title}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
