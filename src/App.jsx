import { BrowserRouter,Route, Routes } from 'react-router-dom'
import './App.css'

import {Login} from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/login" element={<Login/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
