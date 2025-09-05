import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import { Login } from './pages/Login';
import CalenderPage from './pages/CalenderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/login" element={<Login />} />
          <Route path="/calendar" element={<CalenderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
