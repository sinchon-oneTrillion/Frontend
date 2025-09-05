import React, { useState, useEffect } from 'react';
import ChevronLeftIcon from '../../assets/icons/Calender_chevron-left-md.svg';
import ChevronRightIcon from '../../assets/icons/Calender_chevron-right-md.svg';
import DonutProgress from './DonutProgress';
import { getCalendarMonth } from '../../apis/calendar';

function Calendar({ nickname = 'abcde', onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const totalCells = 42;
  const daysArray = Array.from({ length: totalCells }, (_, i) => {
    const dayNumber = i - startDayIndex + 1;
    if (i < startDayIndex || dayNumber > daysInMonth) {
      return null;
    }
    return dayNumber;
  });

  // 캘린더 데이터 조회 함수
  const fetchCalendarData = async () => {
    setLoading(true);
    setError(null);
    try {
      const month = currentDate.getMonth() + 1; // 1-12 형식
      const data = await getCalendarMonth(nickname, month);

      if (data.status === 200) {
        setCalendarData(data.calendar);
      } else {
        setError(data.message || '캘린더 데이터를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('캘린더 데이터조회 실패:', error);

      // —————————————————————— Mock Data ———————————————————————

      if (
        error.response?.status === 404 ||
        error.code === 'ERR_BAD_REQUEST' ||
        error.code === 'ERR_NETWORK'
      ) {
        console.log('백엔드 연결 실패, Mock Data 사용');
        setCalendarData([
          {
            date: '2025-09-01',
            has_picture: false,
            has_memo: true,
            achivement_rate: 50,
          },
          {
            date: '2025-09-06',
            has_picture: true,
            has_memo: true,
            achivement_rate: 75,
          },
        ]);
        setError(null); // 에러 상태 클리어
      } else {
        setError('서버 오류가 발생했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  // 월 변경 시 데이터 다시 가져오기
  useEffect(() => {
    fetchCalendarData();
  }, [currentDate, nickname]);

  // 날짜별 데이터 찾기 함수
  const getDateData = (day) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarData.find((item) => item.date === dateString);
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (day) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateData = getDateData(day); // 해당 날짜의 데이터 가져오기
    if (onDateClick) {
      onDateClick(dateString, dateData); // dateData도 함께 전달
    }
  };

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
    <div className="w-full max-w-md mx-auto bg-white border border-black-500 rounded-lg relative">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6  mt-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{monthYear}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
            disabled={loading}
          >
            <img
              src={ChevronLeftIcon}
              alt="Previous month"
              className="w-5 h-5"
            />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
            disabled={loading}
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
              className="text-center text-sm font-medium text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1 ">
          {daysArray.map((day, idx) => {
            const dateData = day ? getDateData(day) : null;
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();

            // 진행률: API 데이터가 있으면 사용, 없으면 0%
            const progressPercentage = dateData ? dateData.achivement_rate : 0;

            return (
              <div
                key={idx}
                onClick={() => day && handleDateClick(day)}
                className={`
                  h-18 flex items-center justify-center text-base cursor-pointer rounded relative
                  ${day ? 'hover:bg-gray-200' : ''}
                  ${day ? 'text-gray-900' : ''}
                  ${loading ? 'opacity-50' : ''}
                `}
              >
                {day && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <span
                      className={`
                        ${isToday ? 'bg-[#FFF600] text-gray-900 font-bold px-2 py-1 rounded' : ''} 
                        ${dateData && (dateData.has_memo || dateData.has_picture) ? 'text-yellow-600 font-bold' : ''}
                      `}
                    >
                      {day}
                    </span>

                    {/* 달성률 도넛 차트 */}
                    <div className="absolute -bottom-3 -right-0.1">
                      <DonutProgress
                        percentage={progressPercentage}
                        size={40}
                        strokeWidth={8}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 로딩 오버레이 */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-sm text-gray-500">로딩 중...</div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
