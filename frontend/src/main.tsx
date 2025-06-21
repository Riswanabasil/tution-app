import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

import { Provider } from 'react-redux';
import store from './redux/store';


createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
  <GoogleOAuthProvider clientId={clientId}>
  <StrictMode>
    <App />
  </StrictMode>,
  </GoogleOAuthProvider>
  </Provider>
)
