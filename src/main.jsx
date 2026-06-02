import React from 'react'
import ReactDOM from 'react-dom/client'
import VaultrApp from './VaultrApp.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <VaultrApp />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>,
)
