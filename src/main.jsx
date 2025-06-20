import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import './styles/forced-colors.css';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import { ThemeContext } from './context/ThemeContext.jsx';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
  console.error('Google Client ID is not configured. Please check your .env file.');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <ThemeContext>
          <SocketProvider>
            <App />
            <Toaster position="top-right" />
          </SocketProvider>
        </ThemeContext>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);