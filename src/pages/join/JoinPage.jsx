import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../App";
import { sendApi } from "../../utils/apiUtil";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import style from "./JoinPageStyle.module.css"
import joinConditionTrueIcon from "../../assets/JoinConditionTrueIcon.svg"
import joinConditionFalseIcon from "../../assets/JoinConditionFalseIcon.svg"
import openEyesIcon from "../../assets/OpenEyesIcon.svg"
import closeEyesIcon from "../../assets/CloseEyesIcon.svg"

function JoinPage() {

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;                  // 이메일 정규식
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/;   // 비밀번호 정규식
  const nicknameRegex = /^[a-zA-Z0-9가-힣]+$/;                      // 닉네임 정규식

  // Context
  const { language } = useContext(LanguageContext);

  // State
  const [email, setEmail] = useState("");                                         // 이메일
  const [code, setCode] = useState("");                                           // 인증번호
  const [password, setPassword] = useState("");                                   // 비밀번호
  const [checkPassword, setCheckPassword] = useState("");                         // 비밀번호 확인
  const [nickname, setNickname] = useState("");                                   // 닉네임
  const [serviceTerm, setServiceTerm] = useState("");                             // 서비스 이용약관
  const [privacyTerm, setPrivacyTerm] = useState("");                             // 개인정보처리방침

  const [sendingCode, setSendingCode] = useState(false);                          // 이메일 인증번호 전송을 기다리고 있는가?
  const [sentCode, setSentCode] = useState(false);                                // 이메일 인증번호 전송이 완료되었는가?
  const [checkingCode, setCheckingCode] = useState(false);                        // 이메일 인증번호 확인을 기다리고 있는가?
  const [checkedCode, setCheckedCode] = useState(false);                          // 이메일 인증번호 확인이 완료되었는가?

  const [validEmailFormat, setValidEmailFormat] = useState(false);                // 올바른 이메일 형식인가?
  const [validPasswordLength, setValidPasswordLength] = useState(false);          // 올바른 비밀번호 길이인가?
  const [validPasswordFormat, setValidPasswordFormat] = useState(false);          // 올바른 비밀번호 형식인가?
  const [validNicknameLength, setValidNicknameLength] = useState(false);          // 올바른 닉네임 길이인가?
  const [validNicknameFormat, setValidNicknameFormat] = useState(false);          // 올바른 닉네임 길이인가?

  const [passwordIsVisible, setPasswordIsVisible] = useState(false);              // 비밀번호가 보이는가?
  const [checkPasswordIsVisible, setCheckPasswordIsVisible] = useState(false);    // 비밀번호 확인이 보이는가?
  const [passwordIsEqual, setPasswordIsEqual] = useState(true);                   // 비밀번호와 비밀번호 확인이 동일한가?

  const [agreeOrNotAllTerm, setAgreeOrNotAllTerm] = useState(false);                        // 약관 전체 동의
  const [agreeOrNotServiceTerm, setAgreeOrNotServiceTerm] = useState(false);                // 서비스 이용약관 동의
  const [agreeOrNotPrivacyTerm, setAgreeOrNotPrivacyTerm] = useState(false);                // 개인정보 수집 및 이용 동의
  const [agreeOrNotEmailMarketingTerm, setAgreeOrNotEmailMarketingTerm] = useState(false);  // 이메일 마케팅 수신 동의

  const [emailErrorMessage, setEmailErrorMessage] = useState("");                 // 이메일 에러 메시지
  const [joinErrorMessage, setJoinErrorMessage] = useState("");                   // 회원가입 에러 메시지

  const [joining, setJoining] = useState(false);                                  // 회원가입을 기다리고 있는가?

  // 서비스 이용약관 및 개인정보처리방침 불러오기
  useEffect(() => {

    fetch("./terms/서비스이용약관.md")
      .then((res) => res.text())
      .then((md) => setServiceTerm(md));

    fetch("./terms/개인정보처리방침.md")
      .then((res) => res.text())
      .then((md) => setPrivacyTerm(md));

  }, []);

  // 인증번호 타이핑
  function changeCode(e) { setCode(e.target.value); }

  // 이메일 타이핑
  function changeEmail(e) {
    setEmail(e.target.value);
    setSentCode(false);
    setCheckingCode(false);
    setCheckedCode(false);
    
    if(emailRegex.test(e.target.value))
      setValidEmailFormat(true);
    else
      setValidEmailFormat(false);
  }

  // 비밀번호 타이핑
  function changePassword(e) {
    const inputText = e.target.value;

    setPassword(inputText);

    if(inputText.length >= 8 && inputText.length <= 20)
      setValidPasswordLength(true);
    else
      setValidPasswordLength(false);

    if(passwordRegex.test(inputText))
      setValidPasswordFormat(true);
    else
      setValidPasswordFormat(false);

    if(inputText === checkPassword)
      setPasswordIsEqual(true);
    else
      setPasswordIsEqual(false);
  }

  // 비밀번호 확인 타이핑
  function changeCheckPassword(e) {
    const inputText = e.target.value;

    setCheckPassword(inputText);

    if(password === inputText)
      setPasswordIsEqual(true);
    else
      setPasswordIsEqual(false);
  }

  // 닉네임 타이핑
  function changeNickname(e) {
    const inputText = e.target.value;

    setNickname(inputText);

    if(inputText.length >= 2 && inputText.length <= 12)
      setValidNicknameLength(true);
    else
      setValidNicknameLength(false);

    if(nicknameRegex.test(inputText))
      setValidNicknameFormat(true);
    else
      setValidNicknameFormat(false);
  }

  // 비밀번호 보기
  function viewPassword() {
    setPasswordIsVisible(!passwordIsVisible);
  }

  // 비밀번호 확인 보기
  function viewCheckPassword() {
    setCheckPasswordIsVisible(!checkPasswordIsVisible);
  }

  // 약관 전체 동의
  function agreeAllTerm() {
    const value = agreeOrNotAllTerm;

    if(value)
    {
      setAgreeOrNotAllTerm(false);
      setAgreeOrNotServiceTerm(false);
      setAgreeOrNotPrivacyTerm(false);
      setAgreeOrNotEmailMarketingTerm(false);
    }
    else
    {
      setAgreeOrNotAllTerm(true);
      setAgreeOrNotServiceTerm(true);
      setAgreeOrNotPrivacyTerm(true);
      setAgreeOrNotEmailMarketingTerm(true);
    }
  }

  // 서비스 이용약관 동의
  function agreeServiceTerm() {
    const value = agreeOrNotServiceTerm;

    setAgreeOrNotServiceTerm(!value);

    if(!value && agreeOrNotPrivacyTerm && agreeOrNotEmailMarketingTerm)
      setAgreeOrNotAllTerm(true);
    else
      setAgreeOrNotAllTerm(false);
  }

  // 개인정보 수집 및 이용 동의
  function agreePrivacyTerm() {
    const value = agreeOrNotPrivacyTerm;

    setAgreeOrNotPrivacyTerm(!value);

    if(agreeOrNotServiceTerm && !value && agreeOrNotEmailMarketingTerm)
      setAgreeOrNotAllTerm(true);
    else
      setAgreeOrNotAllTerm(false);
  }

  // 이메일 마케팅 수신 동의
  function agreeEmailMarketingTerm() {
    const value = agreeOrNotEmailMarketingTerm;

    setAgreeOrNotEmailMarketingTerm(!value);

    if(agreeOrNotServiceTerm && agreeOrNotPrivacyTerm && !value)
      setAgreeOrNotAllTerm(true);
    else
      setAgreeOrNotAllTerm(false);
  }

  // 인증번호 전송
  async function sendCode(e) {
    e.preventDefault();

    setSendingCode(true);
    setSentCode(false);
    setCheckingCode(false);
    setCheckedCode(false);
    setEmailErrorMessage("");
    setCode("");

    if(!emailRegex.test(email))
    {
      setSendingCode(false);
      setSentCode(false);
      setEmailErrorMessage("이메일 형식에 맞지 않습니다.");

      return;
    }

    try {

      await sendApi(
        "/api/send-verification-code",
        "POST",
        true,
        {"email": email}
      );

      setSentCode(true);
      setEmailErrorMessage("");

    } catch(error) {

      setSentCode(false);
      setEmailErrorMessage("이메일 전송 중 에러가 발생하였습니다.");

    } finally {

      setSendingCode(false);
      
    }
  }

  // 인증번호 확인
  async function checkCode(e) {
    e.preventDefault();

    setCheckingCode(true);
    setCheckedCode(false);
    setEmailErrorMessage("");

    try {
      await sendApi(
        "/api/check-verification-code/join",
        "POST",
        false,
        {"email": email, "code": code}
      );

      setCheckedCode(true);
    } catch(error) {
      const errorCode = error.response.data.code;
      setCheckedCode(false);

      if(errorCode === "WRONG_VERIFICATION_CODE") {
        setEmailErrorMessage("인증번호를 틀렸습니다.");
      } else if(errorCode === "TOO_MANY_WRONG_VERIFICATION_CODE") {
        setEmailErrorMessage("인증번호를 5회 이상 틀렸습니다.\n인증번호를 재전송 해주시기 바랍니다.");
        setSentCode(false);
      } else if(errorCode === "EXPIRED_VERIFICATION_CODE") {
        setEmailErrorMessage("시간이 초과되었습니다.\n인증번호를 재전송 해주시기 바랍니다.");
        setSentCode(false);
      } else if(errorCode === "VERIFICATION_CODE_NOT_FOUND") {
        setEmailErrorMessage("예기치 않은 에러가 발생하였습니다.\n인증번호를 재전송 해주시기 바랍니다.");
        setSentCode(false);
      } else if(errorCode === "ALREADY_EXISTING_USER") {
        setEmailErrorMessage("이미 사용 중인 이메일입니다.\n다른 이메일을 사용해주시기 바랍니다.");
        setSentCode(false);
        setEmail("");
        setValidEmail(false);
      } else {
        setEmailErrorMessage("예기치 않은 에러가 발생하였습니다.");
      }
    } finally {
      setCheckingCode(false);
    }
  }

  // 회원가입
  function join(e) {
    e.preventDefault();
    setJoining(true);
    setJoinErrorMessage("");

    if(!validEmailFormat) {
      setJoinErrorMessage("이메일을 형식에 맞게 입력해주시기 바랍니다.");
      setJoining(false);
      return;
    } else if(!checkedCode) {
      setJoinErrorMessage("이메일 인증번호 확인을 받아야 합니다.");
      setJoining(false);
      return;
    } else if(!validPasswordLength || !validPasswordFormat) {
      setJoinErrorMessage("비밀번호를 형식에 맞게 입력해주시기 바랍니다.");
      setJoining(false);
      return;
    } else if(!validNicknameLength || !validNicknameFormat) {
      setJoinErrorMessage("닉네임을 형식에 맞게 입력해주시기 바랍니다.");
      setJoining(false);
      return;
    } else if(!passwordIsEqual) {
      setJoinErrorMessage("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setJoining(false);
      return;
    } else if(!agreeOrNotServiceTerm) {
      setJoinErrorMessage("서비스 이용약관에 동의해주시기 바랍니다.");
      setJoining(false);
      return;
    } else if(!agreeOrNotPrivacyTerm) {
      setJoinErrorMessage("개인정보처리방침에 동의해주시기 바랍니다.");
      setJoining(false);
      return;
    }

    const tryJoin = async () => {
      try {
        await sendApi(
          "/api/join",
          "POST",
          false,
          {
            "email": email,
            "password": password,
            "nickname": nickname,
            "allowEmailMarketing": agreeOrNotEmailMarketingTerm,
            "code": code
          }
        );
  
        alert("회원가입을 성공적으로 마쳤습니다.");
        navigate("/login");
      } catch(error) {
        const errorCode = error.response.data.code;
        setCheckedCode(false);
  
        if(
          errorCode === "VERIFICATION_CODE_NOT_FOUND" ||
          errorCode === "WRONG_VERIFICATION_CODE" ||
          errorCode === "TOO_MANY_WRONG_VERIFICATION_CODE"
        ) {
          setJoinErrorMessage("이메일 오류가 발생하였습니다.\n인증번호를 다시 인증받으시기 바랍니다.");
          setSendingCode(false);
          setSentCode(false);
          setCheckingCode(false);
          setCheckedCode(false);
        } else if(errorCode === "ALREADY_EXISTING_USER") {
          setJoinErrorMessage("이미 사용 중인 이메일입니다.\n다른 이메일을 사용해주시기 바랍니다.");
          setSendingCode(false);
          setSentCode(false);
          setCheckingCode(false);
          setCheckedCode(false);
        } else if(errorCode === "INVALID_PASSWORD_FORMAT") {
          setJoinErrorMessage("비밀번호를 형식에 맞게 입력해주시기 바랍니다.");
          setJoining(false);
          return;
        } else if(errorCode === "INVALID_NICKNAME_FORMAT") {
          setJoinErrorMessage("닉네임을 형식에 맞게 입력해주시기 바랍니다.");
          setJoining(false);
          return;
        } else {
          setEmailErrorMessage("예기치 않은 에러가 발생하였습니다.");
        }
      } finally {
        setJoining(false);
      }
    }

    tryJoin();
  }

  return (
    <div id={style["container"]}>
      <div id={style["sub-container"]}>

        <div id={style["title"]}>회원가입</div>

        <form id={style["form-container"]} onSubmit={join}>

          <div className={style["item-title-container"]}>
            <div className={style["item-title"]}>이메일</div>
            <div className={style["item-error-message"]}>{emailErrorMessage}</div>
          </div>
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
                disabled={!sentCode || sendingCode || checkingCode || checkedCode ? true : false}
                required
              />
              <button
                id={style["check-code-button"]}
                className={
                  checkedCode ? style["success-check-code-button"] :
                  checkingCode ? style["deactivated-check-code-button"] :
                  style["activated-check-code-button"]
                }
                type="button"
                onClick={checkCode}
                disabled={!sentCode || sendingCode || checkingCode || checkedCode ? true : false}
              >
                {
                  checkedCode ? "확인 완료" :
                  checkingCode ? "확인중..." :
                  "확인"
                }
              </button>
            </div> 
            
            ) : <div></div>
          }
          <div className={style["condition-container"]}>
            <div className={style["condition-sub-container"]}>
              <img className={style["condition-icon"]} src={validEmailFormat ? joinConditionTrueIcon : joinConditionFalseIcon} />
              <div className={style["condition-description"]}>이메일 형식을 따라야합니다.</div>
            </div>
            <div className={style["condition-sub-container"]}>
              <img className={style["condition-icon"]} src={checkedCode ? joinConditionTrueIcon : joinConditionFalseIcon} />
              <div className={style["condition-description"]}>인증번호 확인을 받아야합니다.</div>
            </div>
          </div>

          <div className={style["item-title-container"]}>
            <div className={style["item-title"]}>비밀번호</div>
          </div>
          <div className={style["input-container"]}>
            <input
              className={style["input"]}
              type={passwordIsVisible ? "text" : "password"}
              name="password"
              value={password}
              onChange={changePassword}
              placeholder={language == "KOREAN" ? "비밀번호" : "Password"}
              required
            />
            <img
              className={style["view-password-button"]}
              src={passwordIsVisible ? openEyesIcon : closeEyesIcon}
              onClick={viewPassword}
            />
          </div>
          <div className={style["condition-container"]}>
            <div className={style["condition-sub-container"]}>
              <img className={style["condition-icon"]} src={validPasswordLength ? joinConditionTrueIcon : joinConditionFalseIcon} />
              <div className={style["condition-description"]}>8 ~ 20자</div>
            </div>
            <div className={style["condition-sub-container"]}>
              <img className={style["condition-icon"]} src={validPasswordFormat ? joinConditionTrueIcon : joinConditionFalseIcon} />
              <div className={style["condition-description"]}>영문, 숫자, 특수문자를 전부 포함해야 합니다.</div>
            </div>
          </div>

          <div className={style["item-title-container"]}>
            <div className={style["item-title"]}>비밀번호 확인</div>
          </div>
          <div className={style["input-container"]}>
            <input
              className={style["input"]}
              type={checkPasswordIsVisible ? "text" : "password"}
              name="checkPassword"
              value={checkPassword}
              onChange={changeCheckPassword}
              placeholder={language == "KOREAN" ? "비밀번호 확인" : "Confirm Password"}
              required
            />
            <img
              className={style["view-password-button"]}
              src={checkPasswordIsVisible ? openEyesIcon : closeEyesIcon}
              onClick={viewCheckPassword}
            />
          </div>
          <div className={style["condition-container"]}>
            <div className={style["condition-sub-container"]}>
              <img className={style["condition-icon"]} src={passwordIsEqual ? joinConditionTrueIcon : joinConditionFalseIcon} />
              <div className={style["condition-description"]}>비밀번호와 비밀번호 확인이 동일해야 합니다.</div>
            </div>
          </div>

          <div className={style["item-title-container"]}>
            <div className={style["item-title"]}>닉네임</div>
          </div>
          <div className={style["input-container"]}>
            <input
              className={style["input"]}
              type="text"
              name="nickname"
              value={nickname}
              onChange={changeNickname}
              placeholder={language == "KOREAN" ? "닉네임" : "Nickname"}
              required
            />
          </div>
          <div className={style["condition-container"]}>
            <div className={style["condition-sub-container"]}>
              <img className={style["condition-icon"]} src={validNicknameLength ? joinConditionTrueIcon : joinConditionFalseIcon} />
              <div className={style["condition-description"]}>2 ~ 12자</div>
            </div>
            <div className={style["condition-sub-container"]}>
              <img className={style["condition-icon"]} src={validNicknameFormat ? joinConditionTrueIcon : joinConditionFalseIcon} />
              <div className={style["condition-description"]}>영문, 한글, 숫자만 허용됩니다.</div>
            </div>
          </div>

          <div className={style["item-title-container"]}>
            <div className={style["item-title"]}>약관 동의</div>
          </div>
          <div className={style["all-agree-container"]}>
            <div className={style["all-agree-description"]}>전체 동의</div>
            <div
              className={`
                ${style["term-agree-checkbox"]}
                ${agreeOrNotAllTerm ? style["term-agree-checkbox-checked"] : style["term-agree-checkbox-unchecked"]}
              `}
              onClick={agreeAllTerm}
            ></div>
          </div>
          <div className={style["term-container"]}>
            <div className={style["term-title-container"]}>
              <div className={style["term-title"]}>서비스 이용약관 (필수)</div>
              <div className={style["term-agree-container"]}>
                <div className={style["term-agree-description"]}>동의</div>
                <div
                  className={`
                    ${style["term-agree-checkbox"]}
                    ${agreeOrNotServiceTerm ? style["term-agree-checkbox-checked"] : style["term-agree-checkbox-unchecked"]}
                  `}
                  onClick={agreeServiceTerm}
                ></div>
              </div>
            </div>
            <div className={style["term-detail"]}>
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 style={{ fontSize: "1.2rem" }} {...props} />,
                  h2: ({ node, ...props }) => <h1 style={{ fontSize: "1rem" }} {...props} />,
                  p: ({ node, ...props }) => <p style={{ fontSize: "0.8rem"}} {...props} />,
                  ul: ({ node, ...props }) => <ul style={{ fontSize: "0.8rem"}} {...props} />,
                  ol: ({ node, ...props }) => <ol style={{ fontSize: "0.8rem"}} {...props} />,
                  li: ({ node, ...props }) => <li style={{ fontSize: "0.8rem"}} {...props} />,
                }}
              >
                {serviceTerm}
              </ReactMarkdown>
            </div>
          </div>
          <div className={style["term-container"]}>
            <div className={style["term-title-container"]}>
              <div className={style["term-title"]}>개인정보 수집 및 이용 동의 (필수)</div>
              <div className={style["term-agree-container"]}>
                <div className={style["term-agree-description"]}>동의</div>
                <div
                  className={`
                    ${style["term-agree-checkbox"]}
                    ${agreeOrNotPrivacyTerm ? style["term-agree-checkbox-checked"] : style["term-agree-checkbox-unchecked"]}
                  `}
                  onClick={agreePrivacyTerm}
                ></div>
              </div>
            </div>
            <div className={style["term-detail"]}>
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 style={{ fontSize: "1.2rem" }} {...props} />,
                  h2: ({ node, ...props }) => <h1 style={{ fontSize: "1rem" }} {...props} />,
                  p: ({ node, ...props }) => <p style={{ fontSize: "0.8rem"}} {...props} />,
                  ul: ({ node, ...props }) => <ul style={{ fontSize: "0.8rem"}} {...props} />,
                  ol: ({ node, ...props }) => <ol style={{ fontSize: "0.8rem"}} {...props} />,
                  li: ({ node, ...props }) => <li style={{ fontSize: "0.8rem"}} {...props} />,
                }}
              >
                {privacyTerm}
              </ReactMarkdown>
            </div>
          </div>
          <div className={style["term-container"]}>
            <div className={style["term-title-container"]}>
              <div className={style["term-title"]}>이메일 마케팅 수신 동의 (선택)</div>
              <div className={style["term-agree-container"]}>
                <div className={style["term-agree-description"]}>동의</div>
                <div
                  className={`
                    ${style["term-agree-checkbox"]}
                    ${agreeOrNotEmailMarketingTerm ? style["term-agree-checkbox-checked"] : style["term-agree-checkbox-unchecked"]}
                  `}
                  onClick={agreeEmailMarketingTerm}
                ></div>
              </div>
            </div>
            <div className={style["selective-term-detail"]}>
              서비스와 관련된 이벤트 안내, 고객 혜택 등 다양한 정보를 제공합니다.
            </div>
          </div>

          <div id={style["join-error-message"]}>
            {joinErrorMessage}
          </div>
          <button
            id={style["join-button"]}
            className={joining ? style["deactivated-join-button"] : style["activated-join-button"]}
            type="submit"
            disabled={joining ? true : false}
          >
            {
              joining ?
              <ScaleLoader height={20} color="#FFFFFF" /> :
              language == "KOREAN" ? "회원가입" : "Sign up"
            }
          </button>

        </form>
        
      </div>
    </div>
  );
}

export default JoinPage;