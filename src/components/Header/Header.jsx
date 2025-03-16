import { useContext } from "react";
import { LanguageContext, ThemeContext } from "../../App";
import { Link } from "react-router-dom";

import style from "./HeaderStyle.module.css"
import logoImage_light from "../../assets/LogoImage-Light.svg"
import HeaderLink from "./HeaderLink";

function Header() {

  // Context
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);

  return (
    <div id={style["container"]}>

      <div id={style["left-container"]}>

        <Link id={style["logo"]} to="/">
          <img src={logoImage_light} id={style["logo-image"]}/>
          <div id={style["logo-text"]}>Challenge.with</div>
        </Link>
        <div className={style["link"]}><HeaderLink link="/my-challenge" name="나의 도전" /></div>
        <div className={style["link"]}><HeaderLink link="/challenges" name="챌린지" /></div>
        <div className={style["link"]}><HeaderLink link="/purchase-plan" name="요금제" /></div>

      </div>

      <div id={style["right-container"]}>

        <img src={logoImage_light} id={style["notification-icon"]}/>
        <img src={logoImage_light} id={style["login-icon"]}/>

      </div>

    </div>
  );
}

export default Header