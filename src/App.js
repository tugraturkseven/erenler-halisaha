import Home from "./routes/Home";
import Login from "./routes/Login";
import Reservation from "./routes/Reservation";
import Costumers from "./routes/Costumers";
import ReservationDetails from "./routes/ReservationDetails";
import Message from "./routes/Message";
import CostumerDetails from "./routes/CostumerDetails";
import SignUp from "./routes/SignUp";
import Settings from "./routes/Settings";
import SchemaSettings from "./routes/SchemaSettings";
import GeneralSettings from "./routes/GeneralSettings";
import PitchSettings from "./routes/PitchSettings";
import PitchDetails from "./routes/PitchDetails";
import ReservationForm from "./routes/ReservationForm";
import ChooseCustomer from "./routes/ChooseCustomer";
import CreateCustomer from "./routes/CreateCustomer";
import SmsSettings from "./routes/SmsSettings";
import SMSTemplateDetails from "./routes/SMSTemplateDetails";
import FinancialSettings from "./routes/FinancialSettings";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { CustomersProvider } from "./contexts/CustomersContext";
import { ReservationSchemaProvider } from "./contexts/ReservationSchemaContext";
import { DateProvider } from "./contexts/DateContext";
import { SMSTemplatesProvider } from "./contexts/SMSTemplatesContext";
import { PitchListProvider } from "./contexts/PitchListContext";
import Score from "./routes/Score";
import MatchAnnouncements from "./routes/MatchAnnouncements";
import MatchAnnouncementsDetails from "./routes/MatchAnnouncementDetails";
import Notices from "./routes/Notices";
import NoticesSettings from "./routes/NoticesSettings";
import ResetPassword from "./routes/ResetPassword";

function App() {
  return (
    <div data-theme="night" className="h-screen ">
      <UserProvider>
        <CustomersProvider>
          <ReservationSchemaProvider>
            <DateProvider>
              <BrowserRouter>
                <SMSTemplatesProvider>
                  <PitchListProvider>
                    <Routes>
                      <Route path="/" element={<Login />} />
                      <Route path="/signin" element={<SignUp />} />
                      <Route
                        path="/reset-password"
                        element={<ResetPassword />}
                      />
                      <Route path="/home" element={<Home />} />
                      <Route path="/reservation" element={<Reservation />} />
                      <Route path="/customers" element={<Costumers />} />
                      <Route
                        path="/chooseCustomer"
                        element={<ChooseCustomer />}
                      />
                      <Route
                        path="/createCustomer"
                        element={<CreateCustomer />}
                      />
                      <Route
                        path="/reservationDetails"
                        element={<ReservationDetails />}
                      />
                      <Route
                        path="/reservationForm"
                        element={<ReservationForm />}
                      />
                      <Route path="/message" element={<Message />} />
                      <Route
                        path="/costumerDetails"
                        element={<CostumerDetails />}
                      />
                      <Route path="/settings" element={<Settings />} />
                      <Route
                        path="/schemaSettings"
                        element={<SchemaSettings />}
                      />
                      <Route
                        path="/generalSettings"
                        element={<GeneralSettings />}
                      />
                      <Route
                        path="/pitchSettings"
                        element={<PitchSettings />}
                      />
                      <Route path="/pitchDetails" element={<PitchDetails />} />
                      <Route path="/smsSettings" element={<SmsSettings />} />
                      <Route
                        path="/smsTemplateDetails"
                        element={<SMSTemplateDetails />}
                      />
                      <Route path="/score" element={<Score />} />

                      <Route
                        path="/noticesSettings"
                        element={<NoticesSettings />}
                      />
                      <Route
                        path="/matchannouncements"
                        element={<MatchAnnouncements />}
                      />
                      <Route
                        path="/announcementDetails"
                        element={<MatchAnnouncementsDetails />}
                      />
                      <Route path="/notices" element={<Notices />} />
                      <Route
                        path="/financialSettings"
                        element={<FinancialSettings />}
                      />
                    </Routes>
                  </PitchListProvider>
                </SMSTemplatesProvider>
              </BrowserRouter>
            </DateProvider>
          </ReservationSchemaProvider>
        </CustomersProvider>
      </UserProvider>
    </div>
  );
}

export default App;
