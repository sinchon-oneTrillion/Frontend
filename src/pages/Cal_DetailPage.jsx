import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import DonutProgress from '../shared/components/DonutProgress';

function DetailPage() {
  const { nickname, date } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardData, setCardData] = useState([]);
  const [achievementRate, setAchievementRate] = useState(0);

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

  // 상세 데이터 조회
  const fetchDetailData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/calender/${nickname}/${date}`);
      const data = await response.json();
      
      if (data.status === 201) {
        setDetailData(data);
        // 달성률도 함께 가져온다고 가정
        setAchievementRate(data.achievement_rate || 0);
      } else if (response.status === 404) {
        setError('조회할 데이터가 없습니다.');
      } else {
        setError(data.message || '데이터를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('상세 데이터 조회 실패:', error);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardData();
    
    // location.state에 데이터가 있으면 사용, 없으면 API 호출
    if (location.state) {
      setDetailData(location.state);
      setAchievementRate(location.state.achievement_rate || 0);
      setLoading(false);
    } else {
      fetchDetailData();
    }
  }, [nickname, date, location.state]);

  // 뒤로 가기
  const handleBack = () => {
    navigate('/calendar');
  };

  // 수정하기
  const handleEdit = () => {
    navigate(`/calendar/modify/${nickname}/${date}`, {
      state: detailData
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로 가기
          </button>
          <h1 className="text-xl font-bold text-gray-800">{date}</h1>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            수정
          </button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* 달성률 표시 */}
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <DonutProgress percentage={achievementRate} size={60} />
            </div>
            <label className="block text-sm font-medium text-gray-700">
              달성률: {achievementRate}%
            </label>
          </div>

          {/* 메모 섹션 */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">메모</h2>
            {detailData?.memo ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{detailData.memo}</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 italic">메모가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 이미지 섹션 */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">사진</h2>
            {detailData?.picture ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <img
                  src={detailData.picture}
                  alt="업로드된 이미지"
                  className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="w-16 h-16 mx-auto text-gray-400 mb-2">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 italic">이미지가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 하단 버튼들 */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handleBack}
              className="px-6 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              목록으로
            </button>
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              수정하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
