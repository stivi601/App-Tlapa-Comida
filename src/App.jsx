import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';

// Lazy loading de las aplicaciones principales
const CustomerApp = React.lazy(() => import('./pages/CustomerApp'));
const RestaurantApp = React.lazy(() => import('./pages/RestaurantApp'));
const DeliveryApp = React.lazy(() => import('./pages/DeliveryApp'));
const AdminApp = React.lazy(() => import('./pages/AdminApp'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Privacy = React.lazy(() => import('./pages/Privacy'));

import { AppProvider } from './context/AppContext';
import { SocketProvider } from './context/SocketContext';

// Componente de carga simple
const Loading = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#666'
  }}>
    Cargando aplicación...
  </div>
);

function App() {
  return (
    <AppProvider>
      <SocketProvider>
        <BrowserRouter>
          <div className="app-container">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/customer/*" element={<CustomerApp />} />
                <Route path="/restaurant/*" element={<RestaurantApp />} />
                <Route path="/delivery/*" element={<DeliveryApp />} />
                <Route path="/admin/*" element={<AdminApp />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </SocketProvider>
    </AppProvider>
  );
}

export default App;
