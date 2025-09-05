import { BrowserRouter,Route, Routes } from 'react-router-dom'
import './App.css'
import {Login} from './pages/Login'
import {Home} from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
