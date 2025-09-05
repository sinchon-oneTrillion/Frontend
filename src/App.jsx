import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import CalendarPage from './pages/CalenderPage';
import ModifyPage from './pages/Cal_ModifyPage';
import DetailPage from './pages/Cal_DetailPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route
            path="/calendar/modify/:nickname/:date"
            element={<ModifyPage />}
          />
          <Route
            path="/calendar/detail/:nickname/:date"
            element={<DetailPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
