import './App.css'
import Header from './components/header'
import Footer from './components/footer'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { createContext, useEffect, useState } from 'react'
import axios from 'axios'

// Context API
export const ThemeContext = createContext();
export const LanguageContext = createContext();

function App() {

  // Context
  const [theme, setTheme] = useState("LIGHT");
  const [language, setLanguage] = useState("KOREAN");

  return (
    <div>
      <ThemeContext.Provider value={{ theme, setTheme }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>

        <Header />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>

        <Footer />

      </LanguageContext.Provider>
      </ThemeContext.Provider>
    </div>
  )
}

export default App
