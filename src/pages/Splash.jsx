// src/pages/Splash.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Splash({ next = '/onboarding', duration = 2000 }) {
  const navigate = useNavigate();

  useEffect(() => {
    const nn = localStorage.getItem('onboarding_nickname');
    const mode = localStorage.getItem('auth_mode'); // 'login' | 'signup'
    const dest = nn && mode === 'login' ? '/home' : next;

    const t = setTimeout(() => navigate(dest, { replace: true }), duration);
    return () => clearTimeout(t);
  }, [navigate, next, duration]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white">
      <img src={logo} alt="saechi" className="w-90 h-90" />
    </div>
  );
}
