import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import CustomerApp from './pages/CustomerApp';
import RestaurantApp from './pages/RestaurantApp';
import DeliveryApp from './pages/DeliveryApp';
import AdminApp from './pages/AdminApp';

import { AppProvider } from './context/AppContext';

import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <AppProvider>
      <SocketProvider>
        <BrowserRouter>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/customer/*" element={<CustomerApp />} />
              <Route path="/restaurant/*" element={<RestaurantApp />} />
              <Route path="/delivery/*" element={<DeliveryApp />} />
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </SocketProvider>
    </AppProvider>
  );
}

export default App;
