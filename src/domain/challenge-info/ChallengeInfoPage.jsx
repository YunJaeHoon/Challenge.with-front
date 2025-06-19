import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import style from "./ChallengeInfoPageStyle.module.css"

import ChallengeHeader from "./ChallengeHeader";
import ParticipantList from "./ParticipantList";
import MyStatus from "./MyStatus";
import { sendApi } from "../../utils/apiUtil";

// 컴포넌트 임포트 (추후 생성)
// import ChallengeHeader from "./ChallengeHeader";
// import ParticipantList from "./ParticipantList";
// import MyStatus from "./MyStatus";

function ChallengeInfoPage() {
  const { challengeId } = useParams();
  const [challengeData, setChallengeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchChallengeInfo() {
      setLoading(true);
      setError(null);
      try {
        const data = await sendApi(`/api/challenge/${challengeId}`, "GET", true);
        setChallengeData(data);
      } catch (e) {
        setError("데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchChallengeInfo();
  }, [challengeId]);

  if (loading) return <div className={style.loading}>로딩 중...</div>;
  if (error) return <div className={style.error}>{error}</div>;
  if (!challengeData) return null;

  const { challengeInfo, participantInfoList, isParticipatingChallenge, challengeSubInfo } = challengeData;

  return (
    <div className={style.container}>
      {/* 상단: 챌린지 정보 */}
      <div className={style.header}>
        <ChallengeHeader challengeInfo={challengeInfo} />
      </div>
      <div className={style.body}>
        {/* 좌측: 참가자 리스트 */}
        <div className={style.left}>
          <ParticipantList participants={participantInfoList} maxParticipantCount={challengeInfo.maxParticipantCount} colorTheme={challengeInfo.colorTheme} />
        </div>
        {/* 우측: 본인 현황 (참여자일 때) */}
        {isParticipatingChallenge && (
          <div className={style.right}>
            <MyStatus challengeInfo={challengeInfo} subInfo={challengeSubInfo} colorTheme={challengeInfo.colorTheme}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChallengeInfoPage;