import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout = () => {
  const location = useLocation();
  // 로그인 페이지에서는 Navbar 숨김
  const hideNavbar = location.pathname === '/onboarding';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </>
  );
};
