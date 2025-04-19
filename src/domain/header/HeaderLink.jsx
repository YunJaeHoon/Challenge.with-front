import { Link } from "react-router-dom";

import style from "./HeaderLinkStyle.module.css"
import { useContext } from "react";
import { LanguageContext } from "../../App";

function HeaderLink(props) {

  // Context
  const { language } = useContext(LanguageContext);

  return (
    <Link id={style["link"]} to={props.link}>{props.name}</Link>
  );
}

export default HeaderLink