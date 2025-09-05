// src/pages/onboarding/Landing.jsx
import { useNavigate } from 'react-router-dom';
import Container from '../../shared/components/layouts/Container';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <Container className="max-w-[375px] mx-auto">
      <div className="flex items-center justify-center gap-4 mt-[30vh]">
        <button
          onClick={() => navigate('/onboarding/login')}
          className="h-12 w-28 rounded-lg bg-white text-[#020202] font-semibold border border-blakc
          "
        >
          로그인
        </button>
        <button
          onClick={() => navigate('/onboarding/signup')}
          className="h-12 w-28 rounded-lg bg-black text-white font-semibold"
        >
          회원가입
        </button>
      </div>
    </Container>
  );
}
