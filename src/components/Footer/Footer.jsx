import { useContext } from "react";
import { LanguageContext } from "../../App";

function Footer() {

  const { language, setLaunguage } = useContext(LanguageContext);

  return (
    <div>
      푸더입니다.
    </div>
  );
}

export default Footer