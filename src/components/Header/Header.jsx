import { useContext, useState } from "react";
import { LanguageContext } from "../../App";
import { Link } from "react-router-dom";

import style from "./HeaderStyle.module.css"
import logoImage from "../../assets/LogoImage.svg"
import logoText from "../../assets/LogoText.svg"
import notificationIcon_Unread from "../../assets/NotificationIcon-Unread.svg"
import notificationIcon_Read from "../../assets/NotificationIcon-Read.svg"
import HeaderLink from "./HeaderLink";
import HeaderButton from "./HeaderButton";
import Hamburger from "./Hamburger";

function Header(props) {

  // Context
  const { language } = useContext(LanguageContext);

  // State
  const [isClicked, setIsClicked] = useState(false);

  // 햄버거 클릭 함수
  function clickHamburger() {
    setIsClicked(!isClicked);
  }

  return (
    <div>
      <div id={style["main-container"]}>

        <div id={style["left-container"]}>

          <Link id={style["logo"]} to="/">
            <img src={logoImage} id={style["logo-image"]}/>
            <img src={logoText} id={style["logo-text"]}/>
          </Link>
          <div className={style["link"]}><HeaderLink link="/my-challenge" name="나의 도전" /></div>
          <div className={style["link"]}><HeaderLink link="/challenges" name="챌린지" /></div>
          <div className={style["link"]}><HeaderLink link="/purchase-plan" name="요금제" /></div>

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
            <div className={style["button"]}><HeaderButton link="/join" name="회원가입" /></div>
            <div className={style["button"]}><HeaderButton link="/login" name="로그인" /></div>
            <Hamburger clickHamburgerFunction={clickHamburger} />
          </div>
        }

      </div>
    </div>
  );
}

export default Header