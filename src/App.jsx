import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import OnboardingPage from './pages/onboarding/page';
import Mypage from './pages/onboarding/mypage/page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" />

          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/mypage" element={<Mypage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
