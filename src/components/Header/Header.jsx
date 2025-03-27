import { useContext, useState } from "react";
import { LanguageContext } from "../../App";
import { Link } from "react-router-dom";

import style from "./HeaderStyle.module.css"
import logoImage from "../../assets/LogoImage.svg"
import logoText from "../../assets/LogoText.svg"
import notificationIcon_Unread from "../../assets/NotificationIcon-Unread.svg"
import notificationIcon_Read from "../../assets/NotificationIcon-Read.svg"
import loginIcon from "../../assets/LoginIcon.svg"
import HeaderLink from "./HeaderLink";
import HeaderButton from "./HeaderButton";
import Hamburger from "./Hamburger";
import HamburgerLink from "./HamburgerLink";

function Header(props) {

  // Context
  const { language } = useContext(LanguageContext);

  // State
  const [hamburgerIsClicked, setHamburgerIsClicked] = useState(false);

  // 햄버거 클릭 함수
  function clickHamburger() {
    setHamburgerIsClicked(!hamburgerIsClicked);
  }

  return (
    <div id={style["header-container"]}>
      <div id={style["main-container"]}>

        <div id={style["left-container"]}>

          <Link id={style["logo"]} to="/">
            <img src={logoImage} id={style["logo-image"]}/>
            <img src={logoText} id={style["logo-text"]}/>
          </Link>
          <div className={style["header-link"]}><HeaderLink link="/my-challenge" name="나의 도전" /></div>
          <div className={style["header-link"]}><HeaderLink link="/challenges" name="챌린지" /></div>
          <div className={style["header-link"]}><HeaderLink link="/purchase-plan" name="요금제" /></div>

        </div>

        {
          !props.isLogin ?

          <div id={style["right-container"]}>
            <img src={notificationIcon_Unread} id={style["notification-icon"]} />
            <span id={style["profile-icon"]}>프로필</span>
            <Hamburger clickHamburgerFunction={clickHamburger} />
          </div>
          
          :

          <div id={style["right-container"]}>
            <Link id={style["login-button"]} to="/login">
              <img src={loginIcon} id={style["login-icon"]} />
            </Link>
            <Hamburger clickHamburgerFunction={clickHamburger} />
          </div>
        }

      </div>
      {
        <div id={style["hamburger-list-container"]} className={hamburgerIsClicked ? style["active"] : ""}>
          <div id={style["hamburger-list"]}>
            
          <div className={style["hamburger-link"]}><HamburgerLink link="/my-challenge" name="나의 도전" /></div>
          <div className={style["hamburger-link"]}><HamburgerLink link="/challenges" name="챌린지" /></div>
          <div className={style["hamburger-link"]}><HamburgerLink link="/purchase-plan" name="요금제" /></div>

          </div>
        </div>
      }
    </div>
  );
}

export default Header