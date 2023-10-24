import Home from './routes/Home'
import Login from './routes/Login'
import Reservation from './routes/Reservation';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



function App() {
  return (
    <div data-theme='night' className="h-screen p-8">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path='/reservation' element={<Reservation />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
