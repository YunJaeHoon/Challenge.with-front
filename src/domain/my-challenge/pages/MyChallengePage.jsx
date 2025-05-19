import { useContext, useEffect, useState } from "react";
import style from "./MyChallengePageStyle.module.css";
import { AccountRoleContext, LanguageContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { sendApi } from "../../../utils/apiUtil";
import { BarLoader, ScaleLoader } from "react-spinners";
import ChallengeInfo from "../components/ChallengeInfo";

function MyChallengePage() {

  const navigate = useNavigate();

  // Context
  const { accountRole } = useContext(AccountRoleContext);
  const { language } = useContext(LanguageContext);

  // State
  const [isFetching, setIsFetching] = useState(true);             // 내 챌린지 정보를 불러오는 중인가?
  const [countChallenges, setCountChallenges] = useState(0);      // 내 챌린지 개수
  const [maxChallengeCount, setMaxChallengeCount] = useState(0);  // 참가할 수 있는 최대 챌린지 개수
  const [myChallengeList, setMyChallengeList] = useState([]);     // 내 챌린지 리스트

  // 내 챌린지 불러오기
  useEffect(() => {

    setIsFetching(true);

    if(accountRole === null) {
      return;
    } else if(accountRole === undefined) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    } else {

      const getMyChallenges = async () => {
        const myChallengesData = await sendApi("/api/challenge/me/ongoing", "GET", true, {});
  
        if(myChallengesData)
        {
          setMyChallengeList(myChallengesData.challenges);
          setCountChallenges(myChallengesData.countChallenge);
          setMaxChallengeCount(myChallengesData.maxChallengeCount);
        }

        setIsFetching(false);

      }
      
      getMyChallenges();
    }
  }, [accountRole]);

  return (
    <div id={style["container"]}>
      
      <div id={style["upper-container"]}>

        <div id={style["upper-left-subcontainer"]}>
          <div id={style["title"]}>내 챌린지</div>
          {
            !isFetching &&
            <div id={style["challenge-count"]}>
              {countChallenges} / {maxChallengeCount}
            </div>
          }
        </div>

        <div id={style["upper-right-subcontainer"]}>
          <div id={style["create-challenge-button"]} onClick={() => navigate("/create-challenge")}>새 챌린지 생성</div>
        </div>
        
      </div>

      <div id={style["challenge-list-container"]}>
        {
          isFetching ?
          <BarLoader /> :
          myChallengeList.map((challenge) => {
            return <ChallengeInfo key={challenge.challengeId} challenge={challenge} />
          })
        }
      </div>
      
    </div>
  );
}

export default MyChallengePage;
