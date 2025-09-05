import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '../assets/icons/Calender_chevron-left-md.svg';
import ChevronRightIcon from '../assets/icons/Calender_chevron-right-md.svg';
import DonutProgress from '../shared/components/DonutProgress';

function ModifyPage() {
  const { nickname, date } = useParams();
  const navigate = useNavigate();
  const [memo, setMemo] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [completedCards, setCompletedCards] = useState([]);

  // 날짜 문자열을 Date 객체로
  const currentDate = new Date(date);

  // 날짜를 월/일 형태로
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // 0부터 시작하므로 +1
    const day = date.getDate();
    return `${month}/${day}`;
  };

  // 카드 리스트 조회
  const fetchCardData = async () => {
    try {
      const response = await fetch(`/api/main/cards/${nickname}`);
      const data = await response.json();

      if (data.status === 200) {
        setCardData(data.cards);
      }
    } catch (error) {
      console.error('카드 데이터 조회 실패:', error);
    }
  };

  // 달성률 계산
  const calculateAchievementRate = () => {
    if (cardData.length === 0) return 0;
    return Math.round((completedCards.length / cardData.length) * 100);
  };

  // 완료된 카드 체크/해제
  const toggleCardCompletion = (card) => {
    setCompletedCards((prev) =>
      prev.includes(card) ? prev.filter((c) => c !== card) : [...prev, card]
    );
  };

  // 카드 완료 등록 API 호출
  const submitCardCompletion = async () => {
    try {
      const response = await fetch(`/api/main/check/${nickname}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cards: completedCards,
        }),
      });

      const data = await response.json();
      if (data.status !== 200) {
        console.error('카드 완료 등록 실패:', data.message);
      }
    } catch (error) {
      console.error('카드 완료 등록 실패:', error);
    }
  };

  useEffect(() => {
    fetchCardData();
  }, [nickname]);

  // 전날 이동
  const prevDate = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevDateString = prevDay.toISOString().split('T')[0];
    navigate(`/calendar/modify/${nickname}/${prevDateString}`);
  };

  // 다음날 이동
  const nextDate = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDateString = nextDay.toISOString().split('T')[0];
    navigate(`/calendar/modify/${nickname}/${nextDateString}`);
  };

  // 이미지 파일 선택 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 업로드 API 호출
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`/calender/${nickname}/image`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.status === 200) {
        return data.image_url;
      } else {
        throw new Error(data.message || '이미지 업로드 실패');
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      throw error;
    }
  };

  // 확인 버튼 클릭 핸들러
  const handleConfirm = async () => {
    setLoading(true);
    try {
      let pictureUrl = null;

      // 새 이미지가 있으면 업로드
      if (imageFile) {
        pictureUrl = await uploadImage(imageFile);
      }

      // 카드 완료 등록
      await submitCardCompletion();

      // 캘린더 상세 등록
      const response = await fetch(`/calendar/${nickname}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          picture: pictureUrl,
          memo: memo,
          date: date,
        }),
      });

      const data = await response.json();

      if (data.status === 201) {
        // 성공시 상세 페이지로 이동
        navigate(`/calendar/detail/${nickname}/${date}`, {
          state: {
            picture: data.picture,
            memo: data.memo,
            date: data.date,
          },
        });
      } else {
        alert(data.message || '저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    navigate('/calendar');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-center mb-8">
          <button
            onClick={prevDate}
            className="p-2 hover:bg-gray-200 rounded transition-colors cursor-pointer"
            disabled={loading}
          >
            <img
              src={ChevronLeftIcon}
              alt="Previous Date"
              className="w-5 h-5"
            />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-black">{formatDate(date)}</h1>
          </div>
          <button
            onClick={nextDate}
            className="p-2 hover:bg-gray-200 rounded transition-colors cursor-pointer"
            disabled={loading}
          >
            <img src={ChevronRightIcon} alt="Next Date" className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* 달성률 표시 */}
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <DonutProgress
                percentage={calculateAchievementRate()}
                size={60}
              />
            </div>
            <label className="block text-sm font-medium text-gray-700">
              달성률: {calculateAchievementRate()}%
            </label>
          </div>

          {/* 카드 리스트 */}
          <div>
            <div className="space-y-3">
              {cardData.map((card, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`card-${index}`}
                    checked={completedCards.includes(card)}
                    onChange={() => toggleCardCompletion(card)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`card-${index}`}
                    className={`text-sm ${
                      completedCards.includes(card)
                        ? 'line-through text-gray-500'
                        : 'text-gray-700'
                    }`}
                  >
                    {card}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 이미지 업로드란 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사진
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    className="mx-auto max-w-full max-h-100 rounded-lg"
                  />
                  <button
                    onClick={() =>
                      document.getElementById('image-upload').click()
                    }
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    다른 사진 선택
                  </button>
                </div>
              ) : (
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    document.getElementById('image-upload').click()
                  }
                >
                  <div className="mx-auto w-12 h-12 text-gray-400 mb-2">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">사진올리기</p>
                  <p className="text-xs text-gray-400 mt-1">
                    클릭하여 이미지를 업로드하세요
                  </p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Text Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              오늘의 한마디
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full h-10 p-1 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* 버튼들 */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors ml-4"
              disabled={loading}
            >
              {loading ? '저장 중...' : '확인'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModifyPage;
