import React, { useState, useContext } from "react";
import styles from "./ChallengeInfoPageStyle.module.css";
import { COLOR_MAP } from "./colorUtil";
import { sendApi } from "../../utils/apiUtil";
import { AccountBasicInfoContext } from "../../App";

function ParticipantList({ participants = [], maxParticipantCount, colorTheme = 'GREEN', onParticipantClick, selectedUserId, challengeId }) {
  const themeColor = COLOR_MAP[colorTheme] || COLOR_MAP.GREEN;
  const { accountBasicInfo } = useContext(AccountBasicInfoContext);
  
  // 초대 관련 상태
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friendLoading, setFriendLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [friendError, setFriendError] = useState(null);
  const [inviteError, setInviteError] = useState(null);

  // 현재 사용자의 챌린지 역할 확인
  const currentUserParticipant = participants.find(p => p.id === accountBasicInfo?.userId);
  const isAdmin = currentUserParticipant?.challengeRole === 'SUPER_ADMIN' || currentUserParticipant?.challengeRole === 'ADMIN';

  // 친구 리스트 불러오기
  const fetchFriendList = async () => {
    setFriendLoading(true);
    setFriendError(null);
    try {
      const data = await sendApi(`/api/friend?page=0&size=50&sort=createdAt,desc`, "GET", true);
      
      if (data && data.friendList) {
        // 이미 참가 중인 친구는 제외
        const participantIds = participants.map(p => p.id);
        const availableFriends = data.friendList.filter(friend => !participantIds.includes(friend.userId));
        setFriendList(availableFriends);
      } else {
        setFriendList([]);
      }
    } catch (error) {
      setFriendError("친구 목록을 불러오는데 실패했습니다.");
      setFriendList([]);
    } finally {
      setFriendLoading(false);
    }
  };

  // 초대 버튼 클릭 핸들러
  const handleInviteClick = () => {
    setShowInviteModal(true);
    setSelectedFriends([]);
    setInviteError(null);
    fetchFriendList();
  };

  // 친구 선택/해제 핸들러
  const toggleFriendSelection = (friend) => {
    setSelectedFriends(prev => {
      const isSelected = prev.some(f => f.userId === friend.userId);
      if (isSelected) {
        return prev.filter(f => f.userId !== friend.userId);
      } else {
        return [...prev, friend];
      }
    });
  };

  // 초대 전송 핸들러
  const handleSendInvite = async () => {
    if (selectedFriends.length === 0) {
      setInviteError("초대할 친구를 선택해주세요.");
      return;
    }

    setInviteLoading(true);
    setInviteError(null);
    try {
      await sendApi("/api/invite-challenge", "POST", true, {
        challengeId: challengeId,
        inviteUserIdList: selectedFriends.map(friend => friend.userId)
      });
      
      alert("초대가 성공적으로 전송되었습니다!");
      setShowInviteModal(false);
      setSelectedFriends([]);
    } catch (error) {
      setInviteError("초대 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setInviteLoading(false);
    }
  };

  if (!participants.length) return <div>참가자가 없습니다.</div>;

  return (
    <div className={styles.participantList}>
      <div className={styles.participantTitleContainer}>
        <div className={styles.participantTitle}>참가자 ({participants.length}/{maxParticipantCount})</div>
        {isAdmin && (
          <button
            onClick={handleInviteClick}
            className={styles.inviteButton}
            style={{
              backgroundColor: themeColor,
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 14,
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            초대
          </button>
        )}
      </div>
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

      {/* 초대 모달 */}
      {showInviteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowInviteModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>친구 초대</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowInviteModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {friendLoading ? (
                <div className={styles.loading}>친구 목록을 불러오는 중...</div>
              ) : friendError ? (
                <div className={styles.error}>{friendError}</div>
              ) : friendList.length === 0 ? (
                <div className={styles.emptyMessage}>초대할 수 있는 친구가 없습니다.</div>
              ) : (
                <>
                  <div className={styles.friendList}>
                    {friendList.map((friend) => (
                      <div
                        key={friend.userId}
                        className={`${styles.friendItem} ${
                          selectedFriends.some(f => f.userId === friend.userId) ? styles.selected : ''
                        }`}
                        onClick={() => toggleFriendSelection(friend)}
                      >
                        <img src={friend.profileImageUrl} alt={friend.nickname} className={styles.friendProfileImg} />
                        <span className={styles.friendNickname}>{friend.nickname}</span>
                      </div>
                    ))}
                  </div>
                  {inviteError && <div className={styles.error}>{inviteError}</div>}
                </>
              )}
            </div>
            
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowInviteModal(false)}
                disabled={inviteLoading}
              >
                취소
              </button>
              <button
                className={styles.sendButton}
                onClick={handleSendInvite}
                disabled={inviteLoading || selectedFriends.length === 0}
                style={{
                  backgroundColor: themeColor,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontSize: 14,
                  cursor: inviteLoading || selectedFriends.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: inviteLoading || selectedFriends.length === 0 ? 0.6 : 1
                }}
              >
                {inviteLoading ? '전송 중...' : '초대 전송'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParticipantList; 