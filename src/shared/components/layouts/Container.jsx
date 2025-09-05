// src/shared/components/layouts/Container.jsx
import { useLocation } from 'react-router-dom';

export default function Container({ children, className = '', bgClassName }) {
  const { pathname } = useLocation();

  const autoBg = pathname.startsWith('/onboarding')
    ? 'bg-gradient-to-b from-[#FFF600] to-[#FFBC2B]'
    : 'bg-gray-50';

  const bg = bgClassName ?? autoBg;

  return (
    <div className={`min-h-screen ${bg}`}>
      <div
        className={`px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 py-6 pt-32 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
