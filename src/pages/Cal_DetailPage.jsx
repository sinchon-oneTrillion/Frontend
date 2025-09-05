import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ChevronLeftIcon from '../assets/icons/Calender_chevron-left-md.svg';
import ChevronRightIcon from '../assets/icons/Calender_chevron-right-md.svg';
import DeleteIcon from '../assets/icons/ModifyPage_Image_Delete.png';
import UploadPhotoIcon from '../assets/icons/UploadPage_photo.svg';
import DonutProgress from '../shared/components/DonutProgress';
import { uploadImage, createCalendarDetail } from '../apis/calendar';

function CreatePage() {
  const { nickname } = useParams(); // date는 URL 파라미터에서 제거
  const location = useLocation(); // state에서 date 받아오기
  const navigate = useNavigate();
  const [memo, setMemo] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(
    location.state?.dateData?.achivement_rate || 0
  ); // 진행률 상태 - 전달받은 데이터 사용
  const containerRef = useRef(null);

  // state에서 선택된 날짜 가져오기, 없으면 오늘 날짜
  const selectedDate =
    location.state?.selectedDate || new Date().toISOString().split('T')[0];

  // 날짜 문자열을 Date 객체로
  const currentDate = new Date(selectedDate);

  // 날짜를 월/일 형태로
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // 0부터 시작하므로 +1
    const day = date.getDate();
    return `${month}/${day}`;
  };

  useEffect(() => {
    // 날짜가 변경되면 상태 초기화
    setMemo('');
    setImageFile(null);
    setImagePreview(null);
    setProgressPercentage(location.state?.dateData?.achivement_rate || 0);
  }, [selectedDate, location.state?.dateData]);

  // 전날 이동
  const prevDate = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevDateString = prevDay.toISOString().split('T')[0];
    navigate(`/calendar/create/${nickname}`, {
      state: { selectedDate: prevDateString },
    });
  };

  // 다음날 이동
  const nextDate = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDateString = nextDay.toISOString().split('T')[0];
    navigate(`/calendar/create/${nickname}`, {
      state: { selectedDate: nextDateString },
    });
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

  // 이미지 삭제 핸들러
  const handleImageDelete = () => {
    setImageFile(null);
    setImagePreview(null);
    // 파일 input 초기화
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // 확인 버튼 클릭 핸들러 (등록)
  const handleConfirm = async () => {
    setLoading(true);
    try {
      let pictureUrl = null;

      // 새 이미지가 있으면 업로드 (삭제된 경우는 null로 전송)
      if (imageFile) {
        const uploadData = await uploadImage(nickname, imageFile);
        if (uploadData.status === 200) {
          pictureUrl = uploadData.image_url;
        }
      }

      // 캘린더 상세 등록 (POST /calendar/{nickname})
      const data = await createCalendarDetail(nickname, {
        picture: pictureUrl, // null이면 이미지 없음으로 처리
        memo: memo,
        date: selectedDate,
      });

      if (data.status === 201) {
        // 성공시 상세 페이지로 이동
        navigate(`/calendar/detail/${nickname}/${selectedDate}`, {
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

  // 자동 스크롤 기능
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollDirection = 1; // 1: 아래로, -1: 위로
    let isScrolling = true;

    const autoScroll = () => {
      if (!isScrolling) return;
    };
  }, []);

  // ————————————————————————————————————————————————————————

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white py-10 overflow-y-auto hide-scrollbar"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-center mb-2">
        <button
          onClick={prevDate}
          className="p-2 hover:bg-gray-200 rounded transition-colors cursor-pointer"
          disabled={loading}
        >
          <img src={ChevronLeftIcon} alt="Previous Date" className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-black">
            {formatDate(selectedDate)}
          </h1>
        </div>
        <button
          onClick={nextDate}
          className="p-2 hover:bg-gray-200 rounded transition-colors cursor-pointer"
          disabled={loading}
        >
          <img src={ChevronRightIcon} alt="Next Date" className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-lg p-6 space-y-3">
        {/* 달성률 표시 */}
        <div className="text-center">
          <div className="relative inline-block">
            <DonutProgress
              percentage={progressPercentage}
              size={90}
              strokeWidth={15}
            />
          </div>
          <label className="block text-sm font-medium text-gray-700">
            달성률
          </label>
        </div>

        {/* 이미지 업로드란 */}
        <div>
          <div className="border-1 border-gray-800 h-70 max-h-70 rounded-lg p-5 text-center hover:border-gray-400 transition-colors relative mb-8 overflow-hidden bg-[#E2E2E2]">
            {imagePreview ? (
              <div className="h-full flex flex-col justify-between">
                {/* 삭제 버튼 */}
                <button
                  onClick={handleImageDelete}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10"
                  type="button"
                >
                  <img src={DeleteIcon} alt="이미지 삭제" className="w-5 h-5" />
                </button>

                {/* 이미지 영역  */}
                <div className="flex-1 flex items-center justify-center min-h-0">
                  <img
                    src={imagePreview}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>

                {/* 버튼으로 구현함 - 하단 고정 */}
                <div className="mt-3">
                  <button
                    onClick={() =>
                      document.getElementById('image-upload').click()
                    }
                    className="text-blue-500 hover:text-blue-600 text-sm"
                    type="button"
                  >
                    다른 사진 선택
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="cursor-pointer h-full flex items-center justify-center"
                onClick={() => document.getElementById('image-upload').click()}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 text-gray-400 mb-2">
                    <img
                      src={UploadPhotoIcon}
                      alt="Upload Photo"
                      className="w-12 h-12"
                    />
                  </div>
                </div>
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
            className="w-full h-10 p-1 border border-gray-800 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="flex justify-center pt-4 mt-5">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            이전
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors ml-4"
            disabled={loading}
          >
            {loading ? '저장 중...' : '수정'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
