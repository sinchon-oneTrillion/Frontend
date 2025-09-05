import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../shared/components/Calendar';

function CalendarPage() {
  const navigate = useNavigate();
  const [nickname] = useState('abcde'); // 실제 앱에서는 context나 props로 받아올듯?

  const handleDateClick = (dateString) => {
    // CreatePage로 이동 (새로운 캘린더 데이터 생성)
    navigate(`/calendar/create/${nickname}/${dateString}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 mt-5">
      <div className="container mx-auto px-4">
        <Calendar nickname={nickname} onDateClick={handleDateClick} />
      </div>
    </div>
  );
}

export default CalendarPage;
