import React, { useState } from 'react';
import ChevronLeftIcon from '../assets/icons/Calender_chevron-left-md.svg';
import ChevronRightIcon from '../assets/icons/Calender_chevron-right-md.svg';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // 1일이 무슨 요일인지
  const startDayIndex = startOfMonth.getDay();
  // 해당 월 마지막 날짜
  const daysInMonth = endOfMonth.getDate();

  // 날짜 배열 생성 (7x6 그리드로 맞추기 위해 42개 셀 생성)
  const totalCells = 42;
  const daysArray = Array.from({ length: totalCells }, (_, i) => {
    const dayNumber = i - startDayIndex + 1;
    if (i < startDayIndex || dayNumber > daysInMonth) {
      return null;
    }
    return dayNumber;
  });

  // 이전·다음 달 이동 함수
  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );

  // 월과 년도 포맷팅
  const monthYear = currentDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-gray-300 rounded-lg shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">{monthYear}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <img
              src={ChevronLeftIcon}
              alt="Previous month"
              className="w-5 h-5"
            />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <img src={ChevronRightIcon} alt="Next month" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 캘린더 그리드 */}
      <div className="p-4">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1">
          {daysArray.map((day, idx) => (
            <div
              key={idx}
              className={`
                h-10 flex items-center justify-center text-sm cursor-pointer rounded
                ${day ? 'hover:bg-gray-100' : ''}
                ${
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear()
                    ? 'bg-blue-500 text-white font-medium'
                    : ''
                }
                ${day ? 'text-gray-900' : ''}
              `}
            >
              {day && (
                <div className="relative">
                  {day}
                  {/* 체크마크 아이콘 (예시로 일부 날짜에 추가) */}
                  {(day === 1 ||
                    day === 2 ||
                    day === 3 ||
                    day === 4 ||
                    day === 5 ||
                    day === 6) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center">
                      <svg
                        className="w-2 h-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  {/* 동그라미 표시 (예시로 일부 날짜에 추가) */}
                  {(day === 10 || day === 11 || day === 12) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-2 border-green-500 rounded-full bg-white"></div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
