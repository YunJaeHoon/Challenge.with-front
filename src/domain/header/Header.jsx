import { useContext, useEffect, useState } from "react";
import { AccountRoleContext, LanguageContext } from "../../App";
import { Link } from "react-router-dom";

import style from "./HeaderStyle.module.css"
import logoImage from "../../assets/LogoImage.svg"
import logoText from "../../assets/LogoText.svg"
import notificationIcon_Unread from "../../assets/NotificationIcon-Unread.svg"
import notificationIcon_Read from "../../assets/NotificationIcon-Read.svg"
import loginIcon from "../../assets/LoginIcon.svg"
import HeaderLink from "./HeaderLink";
import Hamburger from "./Hamburger";
import HamburgerLink from "./HamburgerLink";
import { sendApi } from "../../utils/apiUtil";
import NotificationList from "./NotificationList";

function Header() {

  // Context
  const { accountRole } = useContext(AccountRoleContext);
  const { language } = useContext(LanguageContext);

  // State
  const [hamburgerIsClicked, setHamburgerIsClicked] = useState(false);          // 햄버거를 클릭했는가?
  const [notificationIsClicked, setNotificationIsClicked] = useState(false);    // 알림을 클릭했는가?

  const [email, setEmail] = useState("");                                       // 이메일
  const [nickname, setNickname] = useState("");                                 // 닉네임
  const [profileImageUrl, setProfileImageUrl] = useState("");                   // 프로필 이미지 URL
  const [isPremium, setIsPremium] = useState(false);                            // 프리미엄인가?
  const [countUnreadNotification, setCountUnreadNotification] = useState(0);    // 읽지 않은 알림 개수

  // 사용자 기본 정보 가져오기
  useEffect(() => {
    
    const getBasicUserInfo = async () => {
      const basicUserInfo = await sendApi("/api/user/basic-info", "GET", true, {});

      if(basicUserInfo)
      {
        setEmail(basicUserInfo.email);
        setNickname(basicUserInfo.nickname);
        setProfileImageUrl(basicUserInfo.profileImageUrl);
        setIsPremium(basicUserInfo.isPremium);
        setCountUnreadNotification(basicUserInfo.countUnreadNotification);
      }
    }
    
    getBasicUserInfo();

  }, [accountRole]);

  // 햄버거 클릭 함수
  function clickHamburger() {
    setHamburgerIsClicked(!hamburgerIsClicked);
  }

  // 알림 클릭 함수
  function clickNotification() {
    setNotificationIsClicked(!notificationIsClicked);
  }

  return (
    <div id={style["header-container"]}>
      <div id={style["main-container"]}>

        {/* 헤더 왼쪽 컨테이너 */}
        <div id={style["left-container"]}>

          <Link id={style["logo"]} to="/">
            <img src={logoImage} id={style["logo-image"]}/>
            <img src={logoText} id={style["logo-text"]}/>
          </Link>
          <div className={style["header-link"]}><HeaderLink link="/my-challenge" name="나의 도전" /></div>
          <div className={style["header-link"]}><HeaderLink link="/challenges" name="챌린지" /></div>
          <div className={style["header-link"]}><HeaderLink link="/purchase-plan" name="요금제" /></div>

        </div>

        {/* 헤더 오른쪽 컨테이너 */}
        {
          accountRole === null ? (

            <div id={style["right-container"]}>
              <div id={style["loading-right-container"]}></div>
            </div>

          ) : accountRole === undefined ? (

            <div id={style["right-container"]}>
              <Link id={style["login-button"]} to="/login">
                <img src={loginIcon} id={style["login-icon"]} />
              </Link>
              <Hamburger clickHamburgerFunction={clickHamburger} />
            </div>

          ) : (

            <div id={style["right-container"]}>
              <img id={style["notification-icon"]} src={countUnreadNotification > 0 ? notificationIcon_Unread : notificationIcon_Read} onClick={clickNotification} />
              <img src={profileImageUrl} id={style["profile-icon"]} />
              <Hamburger clickHamburgerFunction={clickHamburger} />
            </div>

          )
        }

      </div>
      
      {/* 햄버거 메뉴 */}
      <div id={style["hamburger-list-container"]} className={hamburgerIsClicked ? style["active"] : ""}>
        <div id={style["hamburger-list"]}>
          
          <div className={style["hamburger-link"]}><HamburgerLink link="/my-challenge" name="나의 도전" /></div>
          <div className={style["hamburger-link"]}><HamburgerLink link="/challenges" name="챌린지" /></div>
          <div className={style["hamburger-link"]}><HamburgerLink link="/purchase-plan" name="요금제" /></div>

        </div>
      </div>

      {/* 알림 리스트 */}
      {
        notificationIsClicked ?
        <NotificationList /> :
        ""
      }
      

    </div>
  );
}

export default Header