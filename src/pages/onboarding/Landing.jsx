// src/pages/onboarding/Landing.jsx
import { useNavigate } from 'react-router-dom';
import Container from '../../shared/components/layouts/Container';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <Container className="max-w-[375px] mx-auto">
      <h1 className="mb-10 text-center text-[30px] leading-[36px] font-semibold">
        온보딩
      </h1>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/onboarding/signup')}
          className="h-12 rounded-lg bg-black text-white font-semibold"
        >
          회원가입
        </button>
        <button
          onClick={() => navigate('/onboarding/login')}
          className="h-12 rounded-lg bg-gray-800 text-white font-semibold"
        >
          로그인
        </button>
      </div>
    </Container>
  );
}
