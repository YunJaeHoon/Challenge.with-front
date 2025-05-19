import { createContext, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import style from "./AppStyle.module.css"
import Header from './domain/header/Header.jsx'
import Footer from './domain/footer/Footer.jsx'
import HomePage from './domain/home/HomePage.jsx'
import LoginPage from './domain/login/LoginPage.jsx'
import axios from 'axios'
import OAuth2CallbackPage from './domain/login/OAuth2CallbackPage.jsx'
import { sendApi } from './utils/apiUtil.js'
import SelectJoinMethodPage from './domain/join/pages/SelectJoinMethodPage.jsx'
import JoinPage from './domain/join/pages/JoinPage.jsx'
import ResetPasswordPage from './domain/reset-password/ResetPasswordPage.jsx'
import MyChallengePage from './domain/my-challenge/pages/MyChallengePage.jsx'

// Context API
export const LanguageContext = createContext();
export const AccountRoleContext = createContext();

function App() {

  // Context
  const [language, setLanguage] = useState("KOREAN");
  const [accountRole, setAccountRole] = useState(null);

  // Access token 재발급 및 계정 권한 확인
  useEffect(() => {

    const getAccountRole = async () => {
      try {

        const accessTokenDto = await sendApi("/api/reissue-access-token", "POST", false, {});

        if (accessTokenDto) {
          const accessToken = accessTokenDto.accessToken;
  
          axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
          window.localStorage.setItem("accessToken", accessToken);
        }

      } finally {

        try {
          const accountRoleDto = await sendApi("/api/user/role", "GET", true, {});
          setAccountRole(accountRoleDto.role);
        } catch (e) {
          setAccountRole(undefined);
        }
        
      }
    };
  
    getAccountRole();

  }, []);  

  return (
    <div id={style["container"]}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
      <AccountRoleContext.Provider value={{ accountRole, setAccountRole }}>

        <Header isLogin={true} />
        
        <div id={style["content"]}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/oauth2-callback" element={<OAuth2CallbackPage />} />
            <Route path="/join/method" element={<SelectJoinMethodPage />} />
            <Route path="/join" element={<JoinPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/my-challenge" element={<MyChallengePage />} />
          </Routes>
        </div>

        <Footer />

      </AccountRoleContext.Provider>
      </LanguageContext.Provider>
    </div>
  )
}

export default App
