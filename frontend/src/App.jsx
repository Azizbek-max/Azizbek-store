import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Product from './pages/Product'
import Header from './components/Header'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Header />
      <main id="main" role="main" className="container mx-auto p-4 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<Product />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
