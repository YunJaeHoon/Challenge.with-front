import React from "react";
import styles from "./ChallengeInfoPageStyle.module.css";
import { COLOR_MAP } from "./colorUtil";

function ParticipantList({ participants = [], maxParticipantCount, colorTheme = 'GREEN', onParticipantClick, selectedUserId }) {
  const themeColor = COLOR_MAP[colorTheme] || COLOR_MAP.GREEN;
  if (!participants.length) return <div>참가자가 없습니다.</div>;

  return (
    <div className={styles.participantList}>
      <div className={styles.participantTitle}>참가자 ({participants.length}/{maxParticipantCount})</div>
      <ul className={styles.participantUl}>
        {participants.map(({ id, profileImageUrl, nickname, challengeRole }) => (
          <li
            key={id}
            className={styles.participantItem}
            style={selectedUserId === id ? { background: themeColor + '22', borderRadius: 8, cursor: 'pointer' } : { cursor: 'pointer' }}
            onClick={() => onParticipantClick && onParticipantClick(id, nickname)}
          >
            <img src={profileImageUrl} alt={nickname} className={styles.profileImg} />
            <div className={styles.participantInfo}>
              <span className={styles.nickname}>{nickname}</span>
              <span className={styles.role} style={{ color: themeColor }}>{challengeRole === 'SUPER_ADMIN' ? '관리자' : '참가자'}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ParticipantList; 