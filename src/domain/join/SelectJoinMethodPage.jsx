import { useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../../App";
import style from "./SelectJoinMethodPageStyle.module.css"
import logoImage from "../../assets/LogoImage.svg"
import googleIcon from "../../assets/GoogleIcon.svg"
import kakaoIcon from "../../assets/KakaoIcon.svg"
import naverIcon from "../../assets/NaverIcon.svg"

function SelectJoinMethodPage() {

  // Context
  const { language } = useContext(LanguageContext);

  // 구글 로그인
  function googleLogin() {
    window.location.href = serverUrl + "/oauth2/authorization/google";
  }

  // 카카오 로그인
  function kakaoLogin() {
    window.location.href = serverUrl + "/oauth2/authorization/kakao";
  }

  // 네이버 로그인
  function naverLogin() {
    window.location.href = serverUrl + "/oauth2/authorization/naver";
  }

  return (
    <div id={style["container"]}>
      <div id={style["sub-container"]}>
        
        <img id={style["logo-image"]} src={logoImage} />

        <Link id={style["email-join-link"]} to="/join">
          이메일로 회원가입
        </Link>

        <div id={style["or-container"]}>
          <div className={style["or-line"]}></div>
          <div id={style["or-text"]}>또는</div>
          <div className={style["or-line"]}></div>
        </div>

        <div id={style["oauth2-container"]}>
          <img src={googleIcon} className={style["oauth2-icon"]} onClick={googleLogin} />
          <img src={kakaoIcon} className={style["oauth2-icon"]} onClick={kakaoLogin} />
          <img src={naverIcon} className={style["oauth2-icon"]} onClick={naverLogin} />
        </div>

        <div id={style["login-container"]}>
          <div id={style["login-description"]}>계정이 이미 존재하시나요?</div>
          <Link id={style["login-link"]} to="/login">로그인</Link>
        </div>

      </div>
    </div>
  );
}

export default SelectJoinMethodPage