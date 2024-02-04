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
import ReservationForm from './routes/ReservationForm';
import ChooseCustomer from './routes/ChooseCustomer';
import CreateCustomer from './routes/CreateCustomer';
import SmsSettings from './routes/SmsSettings';
import SMSTemplateDetails from './routes/SMSTemplateDetails';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { CustomersProvider } from './contexts/CustomersContext';
import { ReservationSchemaProvider } from './contexts/ReservationSchemaContext';

function App() {
  return (
    <div data-theme='night' className="h-screen ">
      <UserProvider>
        <CustomersProvider>
          <ReservationSchemaProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signin" element={<SignUp />} />
                <Route path="/home" element={<Home />} />
                <Route path='/reservation' element={<Reservation />} />
                <Route path='/customers' element={<Costumers />} />
                <Route path='/chooseCustomer' element={<ChooseCustomer />} />
                <Route path='/createCustomer' element={<CreateCustomer />} />
                <Route path='/reservationDetails' element={<ReservationDetails />} />
                <Route path='/reservationForm' element={<ReservationForm />} />
                <Route path='/message' element={<Message />} />
                <Route path='/costumerDetails' element={<CostumerDetails />} />
                <Route path='/settings' element={<Settings />} />
                <Route path='/schemaSettings' element={<SchemaSettings />} />
                <Route path='/generalSettings' element={<GeneralSettings />} />
                <Route path='/pitchSettings' element={<PitchSettings />} />
                <Route path='/pitchDetails' element={<PitchDetails />} />
                <Route path='/smsSettings' element={<SmsSettings />} />
                <Route path='/smsTemplateDetails' element={<SMSTemplateDetails />} />
              </Routes>
            </BrowserRouter>
          </ReservationSchemaProvider>
        </CustomersProvider>
      </UserProvider>
    </div>
  );
}

export default App;
