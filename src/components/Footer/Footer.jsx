import { useContext } from "react";
import { LanguageContext } from "../../App";

function Footer() {

  const { language, setLaunguage } = useContext(LanguageContext);

  return (
    <div>
      푸터입니다.
    </div>
  );
}

export default Footer