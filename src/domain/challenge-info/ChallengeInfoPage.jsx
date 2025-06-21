import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import style from "./ChallengeInfoPageStyle.module.css"

import ChallengeHeader from "./ChallengeHeader";
import ParticipantList from "./ParticipantList";
import MyStatus from "./MyStatus";
import Roadmap from "./Roadmap";
import { sendApi } from "../../utils/apiUtil";
import { AccountBasicInfoContext } from "../../App";
import { COLOR_MAP } from "./colorUtil";

function ChallengeInfoPage() {
  const { challengeId } = useParams();
  const [challengeData, setChallengeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 추가: 어떤 화면을 볼지 상태 관리
  const [selectedTab, setSelectedTab] = useState(null);
  // 본인 현황 데이터 상태
  const [myStatusData, setMyStatusData] = useState(null);
  const [myStatusLoading, setMyStatusLoading] = useState(false);
  const [myStatusError, setMyStatusError] = useState(null);

  // phaseNumber 상태 추가 (1~currentPhaseNumber)
  const maxPhaseNumber = challengeData?.challengeInfo?.currentPhaseNumber || 1;
  const [phaseNumber, setPhaseNumber] = useState(maxPhaseNumber);

  const { accountBasicInfo } = useContext(AccountBasicInfoContext);

  // 탭/네비 버튼 hover 상태 관리
  const [tabHover, setTabHover] = useState(null); // 'myStatus' | 'roadmap' | null
  const [leftHover, setLeftHover] = useState(false);
  const [rightHover, setRightHover] = useState(false);

  // 참가자 클릭 상태 관리
  const [selectedUserId, setSelectedUserId] = useState(accountBasicInfo?.userId ?? null);
  const [selectedUserNickname, setSelectedUserNickname] = useState(null);
  // 타인 현황 데이터 상태
  const [otherStatusData, setOtherStatusData] = useState(null);
  const [otherStatusLoading, setOtherStatusLoading] = useState(false);
  const [otherStatusError, setOtherStatusError] = useState(null);

  // 로드맵 데이터 상태 추가
  const [roadmapData, setRoadmapData] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState(null);

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

  // 참여 여부가 바뀌면 탭도 맞춰서 변경
  useEffect(() => {
    if (accountBasicInfo?.userId && challengeData?.isParticipatingChallenge) {
      setSelectedTab('myStatus');
      setSelectedUserId(accountBasicInfo.userId);
    } else {
      setSelectedTab('roadmap');
      setSelectedUserId(null);
    }
  }, [challengeData, accountBasicInfo]);

  // challengeData가 바뀌면 phaseNumber도 최신으로 맞춤
  useEffect(() => {
    if (maxPhaseNumber) setPhaseNumber(maxPhaseNumber);
  }, [maxPhaseNumber]);

  // 본인 현황 탭이 선택되거나 phaseNumber가 바뀔 때마다 phase-status API 호출
  useEffect(() => {
    const fetchMyStatus = async () => {
      if (selectedTab !== 'myStatus' || !accountBasicInfo || !challengeData?.challengeInfo) return;
      setMyStatusLoading(true);
      setMyStatusError(null);
      try {
        const data = await sendApi(
          `/api/challenge/${challengeData.challengeInfo.id}/phase-status?userId=${accountBasicInfo.userId}&phaseNumber=${phaseNumber}`,
          "GET",
          true
        );
        setMyStatusData(data);
      } catch (e) {
        setMyStatusError("본인 현황 정보를 불러오지 못했습니다.");
      } finally {
        setMyStatusLoading(false);
      }
    };
    fetchMyStatus();
  }, [selectedTab, accountBasicInfo, challengeData, phaseNumber]);

  // 참가자 클릭 핸들러
  const handleParticipantClick = (userId, nickname) => {
    setSelectedUserId(userId);
    setSelectedUserNickname(nickname);
    if (accountBasicInfo != null && userId === accountBasicInfo.userId) {
      setSelectedTab('myStatus');
    } else {
      setSelectedTab(null);
    }
    setPhaseNumber(maxPhaseNumber);
  };

  // 타인 현황 조회
  useEffect(() => {
    const fetchOtherStatus = async () => {
      if (!selectedUserId) {
        setOtherStatusData(null);
        setOtherStatusError(null);
        setOtherStatusLoading(false);
        return;
      }
      setOtherStatusLoading(true);
      setOtherStatusError(null);
      try {
        const data = await sendApi(
          `/api/challenge/${challengeData.challengeInfo.id}/phase-status?userId=${selectedUserId}&phaseNumber=${phaseNumber}`,
          "GET",
          true
        );
        setOtherStatusData(data);
      } catch (e) {
        setOtherStatusError("해당 사용자의 현황 정보를 불러오지 못했습니다.");
      } finally {
        setOtherStatusLoading(false);
      }
    };
    fetchOtherStatus();
  }, [selectedUserId, selectedTab, challengeData, phaseNumber, accountBasicInfo]);

  // 로드맵 탭일 때, phaseNumber가 바뀔 때마다 로드맵 API 호출
  useEffect(() => {
    const fetchRoadmap = async () => {
      if (selectedTab !== 'roadmap' || !challengeData?.challengeInfo) return;
      setRoadmapLoading(true);
      setRoadmapError(null);
      try {
        const data = await sendApi(
          `/api/challenge/${challengeData.challengeInfo.id}/roadmap?phaseNumber=${phaseNumber}`,
          "GET",
          true
        );
        setRoadmapData(data);
      } catch (e) {
        setRoadmapError("로드맵 정보를 불러오지 못했습니다.");
      } finally {
        setRoadmapLoading(false);
      }
    };
    fetchRoadmap();
  }, [selectedTab, phaseNumber, challengeData]);

  if (loading) return <div className={style.loading}>로딩 중...</div>;
  if (error) return <div className={style.error}>{error}</div>;
  if (!challengeData) return null;

  const { challengeInfo, participantInfoList, isParticipatingChallenge, challengeSubInfo } = challengeData;

  const themeColor = COLOR_MAP[challengeData?.challengeInfo?.colorTheme] || COLOR_MAP.GREEN;

  return (
    <div className={style.container}>
      {/* 상단: 챌린지 정보 */}
      <div className={style.header}>
        <ChallengeHeader challengeInfo={challengeInfo} />
      </div>
      {/* body 위에 탭 버튼 */}
      <div style={{ display: 'flex', gap: 12, margin: '0 40px 24px 40px', justifyContent: 'center', alignItems: 'center' }}>
        {isParticipatingChallenge && (
          <button
            onClick={() => {
              setSelectedTab('myStatus');
              setSelectedUserId(accountBasicInfo.userId);
            }}
            onMouseEnter={() => setTabHover('myStatus')}
            onMouseLeave={() => setTabHover(null)}
            style={{
              fontWeight: 'bold',
              background: selectedTab === 'myStatus' || tabHover === 'myStatus' ? themeColor : '#ffffff',
              color: selectedTab === 'myStatus' || tabHover === 'myStatus' ? '#ffffff' : themeColor,
              border: selectedTab === 'myStatus' ? 'none' : `1.5px solid ${themeColor}`,
              borderRadius: 8,
              padding: '8px 20px',
              cursor: 'pointer',
              fontSize: 16,
              transition: 'background 0.1s, color 0.15s, border 0.15s',
            }}
          >
            본인 현황
          </button>
        )}
        <button
          onClick={() => {
            setSelectedTab('roadmap');
            setSelectedUserId(null);
          }}
          onMouseEnter={() => setTabHover('roadmap')}
          onMouseLeave={() => setTabHover(null)}
          style={{
            fontWeight: 'bold',
            background: selectedTab === 'roadmap' || tabHover === 'roadmap' ? themeColor : '#ffffff',
            color: selectedTab === 'roadmap' || tabHover === 'roadmap' ? '#fff' : themeColor,
            border: selectedTab === 'roadmap' ? 'none' : `1.5px solid ${themeColor}`,
            borderRadius: 8,
            padding: '8px 20px',
            cursor: 'pointer',
            fontSize: 16,
            transition: 'background 0.1s, color 0.15s, border 0.15s',
          }}
        >
          로드맵
        </button>
        {/* phaseNumber 조절 버튼: 항상 노출 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 24 }}>
          <button
            onClick={() => setPhaseNumber((prev) => Math.max(1, prev - 1))}
            disabled={phaseNumber <= 1}
            className={style.phaseNavBtn}
            onMouseEnter={() => setLeftHover(true)}
            onMouseLeave={() => setLeftHover(false)}
            style={{
              borderColor: themeColor,
              color: leftHover && phaseNumber > 1 ? '#fff' : themeColor,
              background: leftHover && phaseNumber > 1 ? themeColor : (phaseNumber <= 1 ? '#dddddd' : '#fff'),
              transition: 'background 0.1s, color 0.15s, border 0.15s',
              cursor: phaseNumber <= 1 ? 'not-allowed' : 'pointer',
            }}
          >
            {'◀'}
          </button>
          <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>페이즈 {phaseNumber}</span>
          <button
            onClick={() => setPhaseNumber((prev) => Math.min(maxPhaseNumber, prev + 1))}
            disabled={phaseNumber >= maxPhaseNumber}
            className={style.phaseNavBtn}
            onMouseEnter={() => setRightHover(true)}
            onMouseLeave={() => setRightHover(false)}
            style={{
              borderColor: themeColor,
              color: rightHover && phaseNumber < maxPhaseNumber ? '#fff' : themeColor,
              background: rightHover && phaseNumber < maxPhaseNumber ? themeColor : (phaseNumber >= maxPhaseNumber ? '#dddddd' : '#fff'),
              transition: 'background 0.1s, color 0.15s, border 0.15s',
              cursor: phaseNumber >= maxPhaseNumber ? 'not-allowed' : 'pointer',
            }}
          >
            {'▶'}
          </button>
        </div>
      </div>
      <div className={style.body}>
        {/* 좌측: 참가자 리스트 */}
        <div className={style.left}>
          <ParticipantList
            participants={participantInfoList}
            maxParticipantCount={challengeInfo.maxParticipantCount}
            colorTheme={challengeInfo.colorTheme}
            onParticipantClick={handleParticipantClick}
            selectedUserId={selectedUserId}
            challengeId={challengeInfo.id}
          />
        </div>
        {/* 우측: 본인 현황/로드맵 탭 */}
        <div className={style.right}>
          {selectedTab !== 'roadmap' && selectedUserId && accountBasicInfo !== null && accountBasicInfo !== undefined && selectedUserId === accountBasicInfo.userId ? (
            myStatusLoading ? (
              <div className={style.loading}>로딩 중...</div>
            ) : myStatusError ? (
              <div className={style.error}>{myStatusError}</div>
            ) : myStatusData ? (
              <MyStatus challengeInfo={challengeInfo} subInfo={myStatusData} colorTheme={challengeInfo.colorTheme} isReadOnly={false} myUserId={accountBasicInfo.userId} targetUserId={accountBasicInfo.userId}/>
            ) : null
          ) :
          selectedTab !== 'roadmap' ? (
            otherStatusLoading ? (
              <div className={style.loading}>로딩 중...</div>
            ) : otherStatusError ? (
              <div className={style.error}>{otherStatusError}</div>
            ) : otherStatusData ? (
              <MyStatus challengeInfo={challengeInfo} subInfo={otherStatusData} colorTheme={challengeInfo.colorTheme} isReadOnly={true} nickname={selectedUserNickname} myUserId={null} targetUserId={selectedUserId}/>
            ) : null
          ) :
          selectedTab === 'roadmap' && (
            roadmapLoading ? (
              <div className={style.loading}>로딩 중...</div>
            ) : roadmapError ? (
              <div className={style.error}>{roadmapError}</div>
            ) : roadmapData ? (
              <Roadmap challengeInfo={challengeInfo} subInfo={roadmapData} colorTheme={challengeInfo.colorTheme} participantInfoList={participantInfoList}/>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallengeInfoPage;