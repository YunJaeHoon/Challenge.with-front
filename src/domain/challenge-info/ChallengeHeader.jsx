import React from "react";
import styles from "./ChallengeInfoPageStyle.module.css";
import * as RemixIcons from "@remixicon/react";

// colorTheme에 따른 색상 매핑
const COLOR_MAP = {
  RED: "#ff5a5a",
  ORANGE: "#ff9900",
  YELLOW: "#ffd600",
  GREEN: "#22c55e",
  SKYBLUE: "#38bdf8",
  BLUE: "#2563eb",
  PRUPLE: "#a259ff",
  PINK: "#ff6fcb",
  GRAY: "#bdbdbd",
};

function getUnitText(unit) {
  switch (unit) {
    case "DAILY": return "[ 일간 챌린지 ]";
    case "WEEKLY": return "[ 주간 챌린지 ]";
    case "MONTHLY": return "[ 월간 챌린지 ]";
    default: return null;
  }
}

function ChallengeHeader({ challengeInfo }) {
  if (!challengeInfo) return null;
  const { icon, colorTheme, name, description, startDate, isPublic, maxParticipantCount, unit } = challengeInfo;

  // RemixIcons에서 동적으로 아이콘 컴포넌트 가져오기
  const IconComponent = RemixIcons[icon];
  const themeColor = COLOR_MAP[colorTheme] || COLOR_MAP.GREEN;
  const unitText = getUnitText(unit);

  return (
    <div className={styles.challengeHeader} style={{ borderLeft: `12px solid ${themeColor}` }}>
      {/* 아이콘 */}
      <div className={styles.iconWrap} style={{ background: themeColor }}>
        {IconComponent ? (
          <IconComponent size={40} color="#fff" />
        ) : (
          <span style={{ fontSize: 40 }}>{icon}</span>
        )}
      </div>
      <div className={styles.infoWrap}>
        <div className={styles.titleRow}>
          <span className={styles.name}>{name}</span>
          <span className={styles.tag} style={{ color: themeColor, background: themeColor + '22' }}>{isPublic ? '공개' : '비공개'}</span>
          <span className={styles.tag} style={{ color: themeColor, background: themeColor + '22' }}>{maxParticipantCount === 1 ? '혼자서' : '다함께'}</span>
        </div>
        {description && (
          <div className={styles.desc}>{description}</div>
        )}
        <div className={styles.meta}>
          {unitText && <span className={styles.unitText}>{unitText}</span>}
          <span>시작일: {startDate}</span>
        </div>
      </div>
    </div>
  );
}

export default ChallengeHeader; 