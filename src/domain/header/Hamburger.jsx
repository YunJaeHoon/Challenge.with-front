import style from "./HamburgerStyle.module.css"
import hamburgerIcon from "../../assets/HamburgerIcon.svg"
import { LanguageContext } from "../../App";
import { useContext, useState } from "react";

function Hamburger(props) {
  return (
    <button id={style["hamburger-container"]} onClick={props.clickHamburgerFunction}>
      <img src={hamburgerIcon} id={style["hamburger-icon"]}/>
    </button>
  );
}

export default Hamburger