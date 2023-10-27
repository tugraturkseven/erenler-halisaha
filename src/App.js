import Home from './routes/Home'
import Login from './routes/Login'
import Reservation from './routes/Reservation';
import Costumers from './routes/Costumers';
import ReservationDetails from './routes/ReservationDetails';

import { BrowserRouter, Routes, Route } from 'react-router-dom';



function App() {
  return (
    <div data-theme='night' className="h-screen p-8">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path='/reservation' element={<Reservation />} />
          <Route path='/costumers' element={<Costumers />} />
          <Route path='/reservationDetails' element={<ReservationDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
