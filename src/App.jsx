import { createContext, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import style from "./AppStyle.module.css"
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/Login/LoginPage'
import axios from 'axios'
import OAuth2CallbackPage from './pages/login/OAuth2CallbackPage'

// Context API
export const ThemeContext = createContext();
export const LanguageContext = createContext();

function App() {

  // Context
  const [theme, setTheme] = useState("LIGHT");
  const [language, setLanguage] = useState("KOREAN");

  return (
    <div id={style["container"]}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>

        <Header isLogin={true} />
        
        <div id={style["content"]}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/oauth2-callback" element={<OAuth2CallbackPage />} />
          </Routes>
        </div>

        <Footer />

      </LanguageContext.Provider>
      </ThemeContext.Provider>
    </div>
  )
}

export default App
