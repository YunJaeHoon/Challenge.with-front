import { useContext, useState } from "react";
import style from "./ResetPasswordPageStyle.module.css"
import { LanguageContext } from "../../App";
import { sendApi } from "../../utils/apiUtil";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

function ResetPasswordPage() {

  const navigate = useNavigate();

  // Context
  const { language } = useContext(LanguageContext);

  // State
  const [email, setEmail] = useState("");                   // 이메일
  const [code, setCode] = useState("");                     // 인증번호
  const [sendingCode, setSendingCode] = useState(false);    // 이메일 인증번호 전송을 기다리고 있는가?
  const [sentCode, setSentCode] = useState(false);          // 이메일 인증번호 전송이 완료되었는가?
  const [checkingCode, setCheckingCode] = useState(false);  // 이메일 인증번호 확인을 기다리고 있는가?
  const [errorMessage, setErrorMessage] = useState("");     // 이메일 에러 메시지

  // 이메일 타이핑
  function changeEmail(e) {
    setEmail(e.target.value);
    setSentCode(false);
    setCheckingCode(false);
  }

  // 인증번호 타이핑
  function changeCode(e) { setCode(e.target.value); }

  // 인증번호 전송
  async function sendCode(e) {
    e.preventDefault();

    setSendingCode(true);
    setSentCode(false);
    setCheckingCode(false);
    setErrorMessage("");
    setCode("");

    try {
      await sendApi(
        "/api/send-verification-code",
        "POST",
        true,
        {"email": email}
      );

      setSentCode(true);
      setErrorMessage("");
    } catch(error) {
      setSentCode(false);
      setErrorMessage("이메일 전송 중 에러가 발생하였습니다.");
    } finally {
      setSendingCode(false);
    }
  }

  // 인증번호 확인
  async function checkCode(e) {
    e.preventDefault();

    setCheckingCode(true);
    setErrorMessage("");

    try {
      await sendApi(
        "/api/check-verification-code/reset-password",
        "POST",
        false,
        {"email": email, "code": code}
      );

      await sendApi(
        "/api/user/reset-password",
        "POST",
        false,
        {"email": email, "code": code}
      );

      alert("비밀번호 초기화를 성공적으로 마쳤습니다. 이메일을 확인해주세요.");
      navigate("/login");
    } catch(error) {
      const errorCode = error.response.data.code;

      if(errorCode === "WRONG_VERIFICATION_CODE") {
        setErrorMessage("인증번호를 틀렸습니다.");
      } else if(errorCode === "TOO_MANY_WRONG_VERIFICATION_CODE") {
        setErrorMessage("인증번호를 5회 이상 틀렸습니다.\n인증번호를 재전송 해주시기 바랍니다.");
        setSentCode(false);
      } else if(errorCode === "EXPIRED_VERIFICATION_CODE") {
        setErrorMessage("시간이 초과되었습니다.\n인증번호를 재전송 해주시기 바랍니다.");
        setSentCode(false);
      } else if(errorCode === "VERIFICATION_CODE_NOT_FOUND") {
        setErrorMessage("예기치 않은 에러가 발생하였습니다.\n인증번호를 재전송 해주시기 바랍니다.");
        setSentCode(false);
      } else if(errorCode === "USER_NOT_FOUND") {
        setErrorMessage("해당 이메일로 만들어진 계정이 존재하지 않습니다.\n회원가입을 진행해주시기 바랍니다.");
        setSentCode(false);
      } else {
        setErrorMessage("예기치 않은 에러가 발생하였습니다.");
      }
    } finally {
      setCheckingCode(false);
    }
  }

  return(
    <div id={style["container"]}>
      <div id={style["sub-container"]}>
    
        <div id={style["title"]}>비밀번호 초기화</div>
        <div id={style["sub-title"]}>비밀번호가 무작위 문자열로 초기화되어 이메일로 전송됩니다.</div>

        <div className={style["input-container"]}>
          <input
            className={style["input"]}
            type="email"
            name="email"
            value={email}
            onChange={changeEmail}
            placeholder={language == "KOREAN" ? "이메일" : "Email"}
            disabled={sendingCode || checkingCode ? true : false}
            required
          />
          <button
            id={style["send-code-button"]}
            className={sendingCode ? style["deactivated-send-code-button"] : style["activated-send-code-button"]}
            type="button"
            onClick={sendCode}
            disabled={sendingCode ? true : false}
          >
            {sendingCode ? "전송중..." : "인증번호 전송"}
          </button>
        </div>
        {
          sentCode ? (
            
          <div className={style["input-container"]}>
            <input
              className={style["input"]}
              type="text"
              name="code"
              value={code}
              onChange={changeCode}
              placeholder={language == "KOREAN" ? "인증번호" : "Verification code"}
              disabled={!sentCode || sendingCode || checkingCode ? true : false}
              required
            />
          </div>
          
          ) : <div></div>
        }

        <div id={style["error-message"]}>{errorMessage}</div>

        <button
          id={style["check-code-button"]}
          className={sentCode && !sendingCode && !checkingCode ? style["activated-check-code-button"] : style["deactivated-check-code-button"]}
          type="button"
          onClick={checkCode}
          disabled={!sentCode || sendingCode || checkingCode ? true : false}
        >
          {
            checkingCode ?
            <ScaleLoader height={20} color="#FFFFFF" /> :
            language == "KOREAN" ? "인증번호 확인" : "Submit"
          }
        </button>

      </div>
    </div>
  );
}

export default ResetPasswordPage;