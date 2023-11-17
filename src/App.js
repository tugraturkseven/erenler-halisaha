import Home from './routes/Home'
import Login from './routes/Login'
import Reservation from './routes/Reservation';
import Costumers from './routes/Costumers';
import ReservationDetails from './routes/ReservationDetails';
import Message from './routes/Message';
import CostumerDetails from './routes/CostumerDetails';
import SignUp from './routes/SignUp';
import Settings from './routes/Settings';
import SchemaSettings from './routes/SchemaSettings';
import GeneralSettings from './routes/GeneralSettings';
import PitchSettings from './routes/PitchSettings';
import PitchDetails from './routes/PitchDetails';



import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div data-theme='night' className="h-screen ">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signin" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path='/reservation' element={<Reservation />} />
          <Route path='/customers' element={<Costumers />} />
          <Route path='/reservationDetails' element={<ReservationDetails />} />
          <Route path='/message' element={<Message />} />
          <Route path='/costumerDetails' element={<CostumerDetails />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/schemaSettings' element={<SchemaSettings />} />
          <Route path='/generalSettings' element={<GeneralSettings />} />
          <Route path='/pitchSettings' element={<PitchSettings />} />
          <Route path='/pitchDetails' element={<PitchDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
