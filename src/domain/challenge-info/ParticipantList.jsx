import React from "react";
import styles from "./ChallengeInfoPageStyle.module.css";

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

function ParticipantList({ participants, maxParticipantCount, colorTheme }) {

  const themeColor = COLOR_MAP[colorTheme] || COLOR_MAP.GREEN;
  if (!participants || participants.length === 0) return <div>참가자가 없습니다.</div>;
  
  return (
    <div className={styles.participantList}>
      <div className={styles.participantTitle}>참가자 ({participants.length}/{maxParticipantCount})</div>
      <ul className={styles.participantUl}>
        {participants.map((p) => (
          <li key={p.id} className={styles.participantItem}>
            <img src={p.profileImageUrl} alt={p.nickname} className={styles.profileImg} />
            <div className={styles.participantInfo}>
              <span className={styles.nickname}>{p.nickname}</span>
              <span className={styles.role} style={{ color: themeColor }}>{p.challengeRole === 'SUPER_ADMIN' ? '관리자' : '참가자'}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ParticipantList; 