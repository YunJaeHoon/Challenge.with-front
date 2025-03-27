import { useContext } from "react";
import style from "./HamburgerLinkStyle.module.css"
import { Link } from "react-router-dom";
import { LanguageContext } from "../../App";

function HamburgerLink(props) {

  // Context
  const { language } = useContext(LanguageContext);

  return (
    <Link id={style["link"]} to={props.link}>{props.name}</Link>
  );
}

export default HamburgerLink