import { Link } from "react-router-dom";

import style from "./HeaderButtonStyle.module.css"
import { useContext } from "react";
import { LanguageContext, ThemeContext } from "../../App";

function HeaderButton(props) {

  // Context
  const { language } = useContext(LanguageContext);

  return (
    <Link id={style["button"]} to={props.link}>{props.name}</Link>
  );
}

export default HeaderButton