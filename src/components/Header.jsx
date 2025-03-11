import { useContext } from "react";
import { LanguageContext, ThemeContext } from "../App";
import style from "./HeaderStyle.module.css"

function Header() {

  // Context
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);

  return (
    <div className={style["container"]}>
      <div>{theme}</div>
      <div>{language}</div>
      <div>헤더입니다.</div>
    </div>
  );
}

export default Header