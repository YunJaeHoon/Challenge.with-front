import { useContext, useEffect, useState } from "react";
import { AccountBasicInfoContext, LanguageContext } from "../../App";
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
  const { accountBasicInfo } = useContext(AccountBasicInfoContext);
  const { language } = useContext(LanguageContext);

  // State
  const [hamburgerIsClicked, setHamburgerIsClicked] = useState(false);          // 햄버거를 클릭했는가?
  const [notificationIsClicked, setNotificationIsClicked] = useState(false);    // 알림을 클릭했는가?

  // 햄버거 클릭 함수
  function clickHamburger() {
    setHamburgerIsClicked(!hamburgerIsClicked);
    setNotificationIsClicked(false);
  }

  // 알림 클릭 함수
  function clickNotification() {
    setNotificationIsClicked(!notificationIsClicked);
    setHamburgerIsClicked(false);
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
          accountBasicInfo === null ? (

            <div id={style["right-container"]}>
              <div id={style["loading-right-container"]}></div>
            </div>

          ) : accountBasicInfo === undefined ? (

            <div id={style["right-container"]}>
              <Link id={style["login-button"]} to="/login">
                <img src={loginIcon} id={style["login-icon"]} />
              </Link>
              <Hamburger clickHamburgerFunction={clickHamburger} />
            </div>

          ) : (

            <div id={style["right-container"]}>
              <img id={style["notification-icon"]} src={accountBasicInfo.countUnreadNotification > 0 ? notificationIcon_Unread : notificationIcon_Read} onClick={clickNotification} />
              <Link to="/my-profile">
                <img src={accountBasicInfo.profileImageUrl} id={style["profile-icon"]} />
              </Link>
              <Hamburger clickHamburgerFunction={clickHamburger} />
            </div>

          )
        }

      </div>
      
      {/* 햄버거 메뉴 */}
      <div id={style["hamburger-list-container"]} className={hamburgerIsClicked ? style["active"] : ""}>
        <div id={style["hamburger-list"]}>

          {
            accountBasicInfo === null || accountBasicInfo === undefined ? (
              <div id={style["hamburger-button-container"]}>
                <Link id={style["hamburger-join-button"]} className={style["hamburger-button"]} to="/join/method" onClick={() => {setHamburgerIsClicked(false);}}>회원가입</Link>
                <Link id={style["hamburger-login-button"]} className={style["hamburger-button"]} to="/login" onClick={() => {setHamburgerIsClicked(false);}}>로그인</Link>
              </div>
            ) : (
              <div><HamburgerLink link="/my-profile" name="프로필" setHamburgerIsClicked={setHamburgerIsClicked} /></div>
            )
          }
          
          <div><HamburgerLink link="/my-challenge" name="나의 도전" setHamburgerIsClicked={setHamburgerIsClicked} /></div>
          <div><HamburgerLink link="/challenges" name="챌린지" setHamburgerIsClicked={setHamburgerIsClicked} /></div>
          <div><HamburgerLink link="/purchase-plan" name="요금제" setHamburgerIsClicked={setHamburgerIsClicked} /></div>

        </div>
      </div>

      {/* 알림 리스트 */}
      {
        (accountBasicInfo !== null && accountBasicInfo !== undefined) ?
        <NotificationList isClicked={notificationIsClicked} /> : ""
      }

    </div>
  );
}

export default Header