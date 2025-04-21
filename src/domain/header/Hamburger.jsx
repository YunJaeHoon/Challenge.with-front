import style from "./HamburgerStyle.module.css"
import hamburgerIcon from "../../assets/HamburgerIcon.svg"
import React from "react";

const Hamburger = React.memo(({ clickHamburgerFunction }) => {
  return (
    <button id={style["hamburger-container"]} onClick={clickHamburgerFunction}>
      <img src={hamburgerIcon} id={style["hamburger-icon"]}/>
    </button>
  );
});

export default Hamburger