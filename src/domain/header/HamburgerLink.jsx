import React from "react";
import style from "./HamburgerLinkStyle.module.css"
import { Link } from "react-router-dom";

const HamburgerLink = React.memo(({ link, name, setHamburgerIsClicked }) => {
  const handleClick = () => {
    setHamburgerIsClicked(false);
  };

  return (
    <Link className={style["link"]} to={link} onClick={handleClick}>{name}</Link>
  );
});

export default HamburgerLink