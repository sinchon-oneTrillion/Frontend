import { useNavigate, useLocation } from 'react-router-dom';
import logotext from '../../../assets/logotext.png';


function CalendarIcon({ isActive }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M5 0H7V1H5V0ZM15 0H17V1H15V0ZM21 4V3H18V1H17V6H15V1H14V3H8V1H7V6H5V1H4V3H1V4H0V21H1V22H21V21H22V4H21ZM20 7V10H17V7H20ZM20 15H17V12H20V15ZM20 20H17V17H20V20ZM2 17H5V20H2V17ZM2 12H5V15H2V12ZM15 15H12V12H15V15ZM10 15H7V12H10V15ZM7 17H10V20H7V17ZM12 17H15V20H12V17ZM15 10H12V7H15V10ZM10 7V10H7V7H10ZM5 10H2V7H5V10Z" fill="#FFF600"/>
    </svg>
  );
}

function HomeIcon({ isActive }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 19 21" fill="none">
      <path d="M9.5 0.5C9.92626 0.500001 10.2937 0.624648 10.6201 0.875977L10.623 0.878906L17.748 6.27832L17.752 6.28125C17.9835 6.45282 18.1663 6.67129 18.3008 6.94238C18.4348 7.21278 18.5006 7.49634 18.5 7.79883V18.5996C18.5 19.1275 18.3194 19.5673 17.9463 19.9443C17.5735 20.321 17.1421 20.5005 16.626 20.5H13.0625C12.8541 20.5 12.7023 20.4345 12.5732 20.3037C12.4755 20.2046 12.4129 20.0912 12.3877 19.9502L12.375 19.7988V13.7998C12.375 13.3354 12.2137 12.9221 11.8877 12.5938C11.5623 12.2661 11.1514 12.1007 10.6885 12.0996H8.3125C7.84821 12.0996 7.43659 12.2649 7.11133 12.5947C6.78733 12.9233 6.62608 13.3357 6.625 13.7988V19.7998C6.625 20.0152 6.55807 20.1719 6.42773 20.3037C6.29762 20.4352 6.14554 20.5005 5.93848 20.5H2.375C1.85723 20.5 1.42567 20.3201 1.05371 19.9443C0.681567 19.5683 0.500682 19.1289 0.5 18.5996V7.7998C0.500028 7.49687 0.566887 7.21317 0.701172 6.94238C0.835765 6.671 1.01721 6.45278 1.24805 6.28125L1.25195 6.27832L8.37695 0.878906L8.37988 0.875977C8.70632 0.62465 9.07374 0.5 9.5 0.5Z" fill="#FFF600" stroke="#FFF600"/>
    </svg>
  );
}

function MyPageIcon({ isActive }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21" fill="none">
      <path d="M11 19.8462C16.523 19.8462 21 15.7136 21 10.6154C21 5.51726 16.523 1.38464 11 1.38464C5.477 1.38464 1 5.51726 1 10.6154C1 15.7136 5.477 19.8462 11 19.8462Z" stroke="#FFF600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 10.1538C11.663 10.1538 12.2989 9.91071 12.7678 9.47793C13.2366 9.04515 13.5 8.45818 13.5 7.84614C13.5 7.23411 13.2366 6.64714 12.7678 6.21436C12.2989 5.78158 11.663 5.53845 11 5.53845C10.337 5.53845 9.70107 5.78158 9.23223 6.21436C8.76339 6.64714 8.5 7.23411 8.5 7.84614C8.5 8.45818 8.76339 9.04515 9.23223 9.47793C9.70107 9.91071 10.337 10.1538 11 10.1538Z" fill="#FFF600" stroke="#FFF600" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M4.01099 17.2302C4.18299 14.8251 6.35099 12.9231 8.99999 12.9231H13C15.6455 12.9231 17.8115 14.82 17.9885 17.2205" stroke="#FFF600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function NavbarItem({ label, path, isActive, onClick, icon: Icon }) {
  return (
    <div 
      className="content-stretch flex flex-col items-center justify-start relative shrink-0 cursor-pointer"
      onClick={onClick}
    >
      <Icon isActive={isActive} />
      <div 
        className="font-['Roboto:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[10px] text-center text-nowrap tracking-[-0.24px] text-[#FFF600]"
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
      isActive: location.pathname === '/calendar',
      icon: CalendarIcon
    },
    {
      label: 'Home',
      path: '/home',
      onClick: handleHomeClick,
      isActive: location.pathname === '/home',
      icon: HomeIcon
    },
    {
      label: 'My Page',
      path: '/mypage',
      onClick: handleMyPageClick,
      isActive: location.pathname === '/mypage',
      icon: MyPageIcon
    }
  ];

  return (
    <div className="bg-black content-stretch flex flex-col items-start justify-start fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-[#020202] h-px shrink-0 w-full" />
      <div className="content-stretch flex gap-[98px] items-center justify-center relative shrink-0 w-full h-16">
        {navItems.map((item, index) => (
          <NavbarItem
            key={index}
            label={item.label}
            path={item.path}
            isActive={item.isActive}
            onClick={item.onClick}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
}

function TopNavbar() {

  
  return (
    <div className="bg-[#FFF600] content-stretch flex flex-col items-start justify-start fixed top-0 left-0 right-0 z-50">
      <div className="content-stretch flex items-center justify-center relative shrink-0 w-full h-16">
        <img src={logotext} alt="로고글씨" className="w-50 h-auto" />
      </div>
      <div className="bg-[#020202] h-px shrink-0 w-full z-50" />
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