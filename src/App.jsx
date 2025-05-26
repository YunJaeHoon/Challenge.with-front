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
import { getCookie } from './utils/cookieUtil.js'
import MyProfilePage from './domain/my-profile/MyProfilePage.jsx'

// Context API
export const LanguageContext = createContext();
export const AccountBasicInfoContext = createContext();

function App() {

  // Context
  const [language, setLanguage] = useState("KOREAN");
  const [accountBasicInfo, setAccountBasicInfo] = useState(null);

  // Access token 재발급 및 계정 권한 확인
  useEffect(() => {

    const initializeAccount = async () => {
      await reissueAccessToken();
      await getAccountRole();
    };
  
    initializeAccount();
  }, []);

  // Access token 재발급 함수
  const reissueAccessToken = async () => {
    try {
      await sendApi("/api/reissue-access-token", "POST", false, {});
      const accessToken = getCookie("accessToken");

      if(accessToken)
      {
        axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
        window.localStorage.setItem("accessToken", accessToken);
      }
    } catch (e) {
      console.error("Access token 재발급 실패:", e);
    }
  };

  // 사용자 기본 정보 조회 함수
  const getAccountRole = async () => {
    try {
      const accountBasicInfoDto = await sendApi("/api/user/basic-info", "GET", true, {});
      setAccountBasicInfo(accountBasicInfoDto);
    } catch (e) {
      setAccountBasicInfo(undefined);
    }
  };

  return (
    <div id={style["container"]}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
      <AccountBasicInfoContext.Provider value={{ accountBasicInfo, setAccountBasicInfo }}>

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
            <Route path="/my-profile" element={<MyProfilePage />} />
          </Routes>
        </div>

        <Footer />

      </AccountBasicInfoContext.Provider>
      </LanguageContext.Provider>
    </div>
  )
}

export default App
