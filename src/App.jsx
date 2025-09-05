import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Layout } from './shared/components/layouts/Layout';
import { Home } from './pages/Home';
import OnboardingLayout from './pages/onboarding/Layout';
import OnboardingIndex from './pages/onboarding/index';
import SelectView from './pages/onboarding/SelectView';
// import Mypage from './pages/Mypage/page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/onboarding" element={<OnboardingLayout />}>
          <Route index element={<OnboardingIndex />} />
          <Route path="select" element={<SelectView />} />
          </Route>
          {/* <Route path="/mypage" element={<Mypage />} /> */}
          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}