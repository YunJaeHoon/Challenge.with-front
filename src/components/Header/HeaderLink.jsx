import { Link } from "react-router-dom";

import style from "./HeaderLinkStyle.module.css"

function HeaderLink(props) {
  return (
    <Link className={style["link"]} to={props.link}>{props.name}</Link>
  );
}

export default HeaderLink