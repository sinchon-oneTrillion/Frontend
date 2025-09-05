import { useNavigate, useLocation } from 'react-router-dom';

function NavbarIcon({ isActive }) {
  return (
    <div className="relative size-9">
      <div className="absolute left-2 rounded-[6px] size-5 top-2">
        <div 
          aria-hidden="true" 
          className={`absolute border-2 border-solid inset-0 pointer-events-none rounded-[6px] ${
            isActive ? 'border-[#020202]' : 'border-[#424242]'
          }`} 
        />
      </div>
    </div>
  );
}

function NavbarItem({ label, path, isActive, onClick }) {
  return (
    <div 
      className="content-stretch flex flex-col items-center justify-start relative shrink-0 cursor-pointer"
      onClick={onClick}
    >
      <NavbarIcon isActive={isActive} />
      <div 
        className={`font-['Roboto:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[10px] text-center text-nowrap tracking-[-0.24px] ${
          isActive ? 'text-[#020202]' : 'text-[#212121]'
        }`}
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="leading-[normal] whitespace-pre">{label}</p>
      </div>
    </div>
  );
}

function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCalendarClick = () => {
    navigate('/calendar');
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleMyPageClick = () => {
    navigate('/mypage');
  };

  const navItems = [
    {
      label: 'calender',
      path: '/calendar',
      onClick: handleCalendarClick,
      isActive: location.pathname === '/calendar'
    },
    {
      label: 'Home',
      path: '/home',
      onClick: handleHomeClick,
      isActive: location.pathname === '/home'
    },
    {
      label: 'My Page',
      path: '/mypage',
      onClick: handleMyPageClick,
      isActive: location.pathname === '/mypage'
    }
  ];

  return (
    <div className="bg-white content-stretch flex flex-col items-start justify-start fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-[#020202] h-px shrink-0 w-full" />
      <div className="content-stretch flex gap-[98px] items-center justify-center relative shrink-0 w-full h-16">
        {navItems.map((item, index) => (
          <NavbarItem
            key={index}
            label={item.label}
            path={item.path}
            isActive={item.isActive}
            onClick={item.onClick}
          />
        ))}
      </div>
    </div>
  );
}

function TopNavbar() {

  
  return (
    <div className="bg-white content-stretch flex flex-col items-start justify-start fixed top-0 left-0 right-0 z-50">
      <div className="content-stretch flex items-center justify-center relative shrink-0 w-full h-16">
        <div className="font-['Roboto:Medium',_sans-serif] font-medium text-[#212121] text-lg">
          캐치새치
        </div>
      </div>
      <div className="bg-[#020202] h-px shrink-0 w-full" />
    </div>
  );
}

export const Navbar = () => {
  return (
    <>
      <TopNavbar />
      <BottomNavbar />
    </>
  );
}