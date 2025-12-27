import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/tailwind.css'
import './i18n'
import { HelmetProvider } from 'react-helmet-async'
import { initGA } from './ga'

// Initialize Google Analytics if VITE_GA_MEASUREMENT_ID is set
initGA()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
