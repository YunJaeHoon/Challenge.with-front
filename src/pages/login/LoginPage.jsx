import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { AccountRoleContext, LanguageContext } from "../../App";
import axios from "axios";
import style from "./LoginPageStyle.module.css"
import logoImage from "../../assets/LogoImage.svg"
import emailIcon from "../../assets/EmailIcon.svg"
import passwordIcon from "../../assets/PasswordIcon.svg"
import openEyesIcon from "../../assets/OpenEyesIcon.svg"
import closeEyesIcon from "../../assets/CloseEyesIcon.svg"
import googleIcon from "../../assets/GoogleIcon.svg"
import kakaoIcon from "../../assets/KakaoIcon.svg"
import naverIcon from "../../assets/NaverIcon.svg"
import { sendApi } from "../../utils/apiUtil";


function LoginPage() {

  const serverUrl = import.meta.env.VITE_BACKEND_SERVER_URL;
  const navigate = useNavigate();
  const location = useLocation();

  // Context
  const { language } = useContext(LanguageContext);
  const { setAccountRole } = useContext(AccountRoleContext);

  // state
  const [email, setEmail] = useState("");                                           // 이메일
  const [password, setPassword] = useState("");                                     // 비밀번호
  const [errorMessage, setErrorMessage] = useState(location.state?.errorMessage);   // 에러 메시지
  const [rememberMe, setRememberMe] = useState(false);                              // 로그인 정보를 저장하는가?
  const [passwordVisibility, setPasswordVisibility] = useState(false);              // 비밀번호가 보이는가?
  const [isWaitingLogin, setIsWaitingLogin] = useState(false);                      // 로그인을 기다리고 있는가?

  function changeEmail(e) { setEmail(e.target.value); }           // 이메일 타이핑
  function changePassword(e) { setPassword(e.target.value); }     // 비밀번호 타이핑

  // 비밀번호 보기
  function changePasswordVisibility() {
    setPasswordVisibility(!passwordVisibility);
  }

  // 로그인 정보 저장
  function changeRememberMe() {
    setRememberMe(!rememberMe);
  }

  // 로그인
  function login(e) {
    e.preventDefault();
    setIsWaitingLogin(true);

    axios.post("/api/login", {
      "email": email,
      "password": password,
      "remember-me": rememberMe
    }, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
    .then((response) => {
      const accessToken = response.data?.data?.accessToken;

      axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
      window.localStorage.setItem("accessToken", accessToken);

      const getRole = async () => {
        const role = await sendApi("/api/user/role", "GET", true, {});
        setAccountRole(role);
      };

      getRole();

      navigate("/")
    })
    .catch((error) => {
      setErrorMessage(error.response?.data?.message ?? "예기치 못한 에러가 발생하였습니다.");
      setIsWaitingLogin(false);
    });
  }

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

        <form id={style["form-container"]} onSubmit={login}>

          <div className={style["input-container"]}>
            <img src={emailIcon} className={style["icon"]}/>
            <input className={style["input"]} type="email" name="email" value={email} onChange={changeEmail} placeholder={language == "KOREAN" ? "이메일" : "Email"} required />
          </div>

          <div className={style["input-container"]}>
            <img src={passwordIcon} className={style["icon"]}/>
            <input className={style["input"]} type={passwordVisibility ? "text" : "password"} name="password" value={password} onChange={changePassword} placeholder={language == "KOREAN" ? "비밀번호" : "Password"} required />
            <img id={style["password-visibility-icon"]} src={passwordVisibility ? openEyesIcon : closeEyesIcon} onClick={changePasswordVisibility} />
          </div>

          <div id={style["additional-container"]}>

            <div id={style["remember-me-container"]}>
              <div id={style["remember-me-description"]}>로그인 정보 저장</div>
              <div id={style["remember-me-checkbox"]} className={rememberMe ? style["remember-me-checkbox-checked"] : style["remember-me-checkbox-unchecked"]} onClick={changeRememberMe}></div>
            </div>

            <div id={style["reset-password-container"]}>
              <Link id={style["reset-password-link"]} to="/reset-password">비밀번호를 잊으셨나요?</Link>
            </div>

          </div>

          <div id={style["error-message"]}>
            {errorMessage}
          </div> 

          <button id={style["login-button"]} className={isWaitingLogin ? style["deactivated-login-button"] : style["activated-login-button"]} type="submit" disabled={isWaitingLogin ? true : false}>
            {
              isWaitingLogin ?
              <ScaleLoader height={20} color="#FFFFFF" /> :
              language == "KOREAN" ? "로그인" : "Login"
            }
          </button>

        </form>

        <div id={style["or-container"]}>
          <div id={style["or-line"]}></div>
          <div id={style["or-text"]}>또는</div>
          <div id={style["or-line"]}></div>
        </div>

        <div id={style["oauth2-container"]}>
          <img src={googleIcon} className={style["oauth2-icon"]} onClick={googleLogin} />
          <img src={kakaoIcon} className={style["oauth2-icon"]} onClick={kakaoLogin} />
          <img src={naverIcon} className={style["oauth2-icon"]} onClick={naverLogin} />
        </div>

        <div id={style["join-container"]}>
          <div id={style["join-description"]}>Challenge.with이 처음이신가요?</div>
          <Link id={style["join-link"]} to="/join">계정 생성</Link>
        </div>

      </div>
    </div>
  );
}

export default LoginPage