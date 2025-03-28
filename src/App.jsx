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

// Context API
export const AccountRoleContext = createContext();
export const LanguageContext = createContext();

function App() {

  // Context
  const [language, setLanguage] = useState("KOREAN");
  const [accountRole, setAccountRole] = useState(null);

  // 로그인 여부 확인
  useEffect(() => {

    const getRole = async () => {
  
      try {

        // Access token 재발급
        const accessTokenDto = await sendApi("/api/reissue-access-token", "POST", false, {});
        const accessToken = accessTokenDto.accessToken;
  
        axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
        window.localStorage.setItem("accessToken", accessToken);

      } finally {

        // 권한 확인
        try {
          const role = await sendApi("/api/user/role", "GET", true, {});
          setAccountRole(role);
        } catch (error) {
          setAccountRole(undefined);
        }

      }
    };
  
    getRole();

  }, []);  

  return (
    <div id={style["container"]}>
      <AccountRoleContext.Provider value={{ accountRole, setAccountRole }}>
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
      </AccountRoleContext.Provider>
    </div>
  )
}

export default App
