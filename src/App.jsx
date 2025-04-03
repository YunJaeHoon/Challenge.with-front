import { createContext, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import style from "./AppStyle.module.css"
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/login/LoginPage.jsx'
import axios from 'axios'
import OAuth2CallbackPage from './pages/login/OAuth2CallbackPage'
import { sendApi } from './utils/apiUtil.js'
import SelectJoinMethodPage from './pages/join/SelectJoinMethodPage.jsx'
import JoinPage from './pages/join/JoinPage.jsx'
import ResetPasswordPage from './pages/reset-password/ResetPasswordPage.jsx'

// Context API
export const LanguageContext = createContext();

function App() {

  // Context
  const [language, setLanguage] = useState("KOREAN");

  // Access token 재발급
  useEffect(() => {

    const getRole = async () => {

      // Access token 재발급
      const accessTokenDto = await sendApi("/api/reissue-access-token", "POST", false, {});
      const accessToken = accessTokenDto.accessToken;

      axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
      window.localStorage.setItem("accessToken", accessToken);
      
    };
  
    getRole();

  }, []);  

  return (
    <div id={style["container"]}>
      <LanguageContext.Provider value={{ language, setLanguage }}>

        <Header isLogin={true} />
        
        <div id={style["content"]}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/oauth2-callback" element={<OAuth2CallbackPage />} />
            <Route path="/join/method" element={<SelectJoinMethodPage />} />
            <Route path="/join" element={<JoinPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </div>

        <Footer />

      </LanguageContext.Provider>
    </div>
  )
}

export default App
