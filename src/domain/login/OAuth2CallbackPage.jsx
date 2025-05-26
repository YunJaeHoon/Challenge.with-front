import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BarLoader, ScaleLoader } from "react-spinners";
import axios from "axios";
import style from "./OAuth2CallbackPageStyle.module.css"
import { getCookie } from "../../utils/cookieUtil";

function OAuth2CallbackPage() {

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getCookie("accessToken");

    if(accessToken)
    {
      axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
      window.localStorage.setItem("accessToken", accessToken);

      navigate("/");
    } else {
      navigate("/login", { state: { errorMessage: "예기치 못한 에러가 발생하였습니다." } });
    }
  }, [navigate]);

  return (
    <div id={style["container"]}>
      <div id={style["loading-text"]}>로그인 중입니다. 잠시만 기다려주세요.</div>
      <BarLoader width={100} height={4}/>
    </div>
  );
}

export default OAuth2CallbackPage