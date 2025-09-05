// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { Layout } from './shared/components/layouts/Layout';
import Landing from './pages/onboarding/Landing';
import Signup from './pages/onboarding/Signup';
import Login from './pages/onboarding/Login';
import SelectView from './pages/onboarding/SelectView';
import Mypage from './pages/Mypage';
import CalendarPage from './pages/CalenderPage';
import ModifyPage from './pages/Cal_ModifyPage';
import DetailPage from './pages/Cal_DetailPage';
import CreatePage from './pages/Cal_CreatePage';
import Splash from './pages/Splash';

function NotFound() {
  return <div style={{ padding: 24 }}>Not Found</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Splash next="/onboarding" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/onboarding" element={<Landing />} />
          <Route path="/onboarding/signup" element={<Signup />} />
          <Route path="/onboarding/login" element={<Login />} />
          <Route path="/onboarding/select" element={<SelectView />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route
            path="/calendar/modify/:nickname/:date"
            element={<ModifyPage />}
          />
          <Route
            path="/calendar/detail/:nickname/:date"
            element={<DetailPage />}
          />
          <Route path="/calendar/create/:nickname" element={<CreatePage />} />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
