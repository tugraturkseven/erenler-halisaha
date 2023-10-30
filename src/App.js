import Home from './routes/Home'
import Login from './routes/Login'
import Reservation from './routes/Reservation';
import Costumers from './routes/Costumers';
import ReservationDetails from './routes/ReservationDetails';
import Message from './routes/Message';
import CostumerDetails from './routes/CostumerDetails';
import SignIn from './routes/SignIn';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



function App() {
  return (
    <div data-theme='night' className="h-screen p-8">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path='/reservation' element={<Reservation />} />
          <Route path='/costumers' element={<Costumers />} />
          <Route path='/reservationDetails' element={<ReservationDetails />} />
          <Route path='/message' element={<Message />} />
          <Route path='/costumerDetails' element={<CostumerDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
