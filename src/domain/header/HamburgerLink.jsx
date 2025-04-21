import React from "react";
import style from "./HamburgerLinkStyle.module.css"
import { Link } from "react-router-dom";

const HamburgerLink = React.memo(({ link, name }) => {
  return (
    <Link className={style["link"]} to={link}>{name}</Link>
  );
});

export default HamburgerLink