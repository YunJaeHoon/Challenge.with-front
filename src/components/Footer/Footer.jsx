import { useContext } from "react";
import { LanguageContext, ThemeContext } from "../../App";

function Footer() {

  const { theme, setTheme } = useContext(ThemeContext);
  const { language, setLaunguage } = useContext(LanguageContext);

  return (
    <div>
      푸더입니다.
    </div>
  );
}

export default Footer