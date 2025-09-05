import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Mypage from './pages/Onboarding/Mypage/page';
import Onboarding from './pages/Onboarding/page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" />

          <Route path="/Onboarding" element={<Onboarding />} />
          <Route path="/mypage" element={<Mypage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
