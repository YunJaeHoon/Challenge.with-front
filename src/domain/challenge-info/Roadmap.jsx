import React, { useState } from "react";
import styles from "./ChallengeInfoPageStyle.module.css";
import { COLOR_MAP } from "./colorUtil";

function Roadmap({ challengeInfo, subInfo, colorTheme = 'GREEN', participantInfoList = [] }) {
  if (!subInfo || !subInfo.eachRoadmapInfoList || !participantInfoList.length) return null;
  const themeColor = COLOR_MAP[colorTheme] || COLOR_MAP.GREEN;
  const { phaseInfo, eachRoadmapInfoList } = subInfo;

  // id 기준으로 참가자와 현황 매칭
  const roadmapMap = Object.fromEntries(eachRoadmapInfoList.map(r => [r.userInfo.id, r]));

  // 설명 토글 상태
  const [showDesc, setShowDesc] = useState(false);
  const [showTitleTooltip, setShowTitleTooltip] = useState(false);

  return (
    <div className={styles.roadmapContainer}>
      <div className={styles.roadmapPhaseBox}>
        <div className={styles.roadmapPhaseHeader}>
          <div className={styles.phaseTitleRow}>
            <div
              className={styles.phaseTitle}
              onMouseEnter={() => setShowTitleTooltip(true)}
              onMouseLeave={() => setShowTitleTooltip(false)}
              style={{ position: 'relative' }}
            >
              {phaseInfo.name}
            </div>
            {phaseInfo.description && (
              <>
                <button
                  className={styles.phaseDescBtn + (showDesc ? ' ' + styles.active : '')}
                  onClick={() => setShowDesc((prev) => !prev)}
                >
                  설명
                </button>
                {/* 페이즈 이름 말풍선 툴팁 */}
                {showTitleTooltip && (
                  <div className={styles.phaseDescBalloonTop}>
                    {phaseInfo.name}
                  </div>
                )}
                {/* 페이즈 설명 말풍선 툴팁 */}
                {showDesc && (
                  <div className={styles.phaseDescBalloon}>
                    {phaseInfo.description}
                  </div>
                )}
              </>
            )}
          </div>
          <div className={styles.phaseDate}>
            <span className={styles.phaseDateTag} style={{ background: themeColor + '22', color: themeColor }}>{phaseInfo.startDate}</span>
            <span className={styles.phaseDateTilde}>~</span>
            <span className={styles.phaseDateTag} style={{ background: themeColor + '22', color: themeColor }}>{phaseInfo.endDate}</span>
          </div>
        </div>
      </div>
      <div className={styles.roadmapRows}>
        {participantInfoList.map((p) => {
          const roadmap = roadmapMap[p.id];
          return (
            <div className={styles.roadmapRow} key={p.id}>
              <div className={styles.roadmapRowRight}>
                {roadmap ? (
                  <div className={styles.roadmapCard}>
                    <div className={styles.roadmapCountBox}>
                      <span className={styles.countValue}>{roadmap.participatePhaseInfo.completeCount} / {challengeInfo.goalCount}</span>
                      {roadmap.participatePhaseInfo.isExempt && <span className={styles.roadmapExemptTag}>면제</span>}
                      {roadmap.participatePhaseInfo.comment && (
                        <div className={styles.roadmapCommentBox}>
                          {roadmap.participatePhaseInfo.comment}
                        </div>
                      )}
                      {!roadmap.participatePhaseInfo.comment && (
                        <div className={styles.roadmapCommentBox}>
                          도전자의 한마디가 없습니다.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={styles.roadmapCard}>현황 정보 없음</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Roadmap; 