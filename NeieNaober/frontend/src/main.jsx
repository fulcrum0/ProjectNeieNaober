import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Index from './pages/Index.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Login from './pages/Login.jsx'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/over-ons" element={<AboutUs />} />
        <Route path="/klantportaal" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)