import { useContext } from "react";
import { LanguageContext, ThemeContext } from "../App";

function Header() {

  // Context
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);

  return (
    <div>
      {theme}
      {language}
      헤더입니다.
    </div>
  );
}

export default Header