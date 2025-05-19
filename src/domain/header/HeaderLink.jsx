import { Link } from "react-router-dom";

import style from "./HeaderLinkStyle.module.css"
import React from "react";

const HeaderLink = React.memo(({ link, name }) => {
  return (
    <Link className={style["link"]} to={link}>{name}</Link>
  );
});

export default HeaderLink