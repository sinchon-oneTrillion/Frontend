import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../shared/components/Calendar';

function CalendarPage() {
  const navigate = useNavigate();
  const [nickname] = useState('abcde'); // 실제 앱에서는 context나 props로 받아올듯?

  const handleDateClick = (dateString, dateData) => {
    // dateData: Calendar 컴포넌트에서 전달받은 해당 날짜의 데이터
    if (dateData && (dateData.has_picture || dateData.has_memo)) {
      // Case 1: 등록된 텍스트나 사진이 있으면 DetailPage로 이동
      navigate(`/calendar/detail/${nickname}/${dateString}`, {
        state: {
          selectedDate: dateString,
          dateData: dateData,
        },
      });
    } else {
      // Case 2: 등록된 텍스트나 사진이 없으면 CreatePage로 이동
      // API 명세서에 맞춰 date를 state로 전달
      navigate(`/calendar/create/${nickname}`, {
        state: {
          selectedDate: dateString,
          dateData: dateData,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF600] py-10">
      <div className="container mx-auto px-4">
        <Calendar nickname={nickname} onDateClick={handleDateClick} />
      </div>
    </div>
  );
}

export default CalendarPage;
