import './App.css'
import Header from './components/header'
import Footer from './components/footer'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { useEffect } from 'react'
import axios from 'axios'
import ErrorPage from './pages/ErrorPage'

function App() {
  return (
    <div>

      <Header />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>

      <Footer />

    </div>
  )
}

export default App
