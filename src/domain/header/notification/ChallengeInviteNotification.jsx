import React, { useState } from "react";
import style from "./NotificationListStyle.module.css";
import { sendApi } from "../../../utils/apiUtil";
import * as RemixIcons from "@remixicon/react";
import deleteIcon from "../../../assets/DeleteNotificationIcon.svg";

const ChallengeInviteNotification = ({ notification, onDelete }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // 화면에서만 제거하는 함수
  const removeFromScreen = (notificationId) => {
    onDelete(notificationId, true); // true는 API 호출 없이 화면에서만 제거하라는 의미
  };

  // 챌린지 단위를 사용자 친화적인 텍스트로 변환
  const getChallengeUnitText = (unit) => {
    switch (unit) {
      case "DAILY":
        return "일간 챌린지";
      case "WEEKLY":
        return "주간 챌린지";
      case "MONTHLY":
        return "월간 챌린지";
      default:
        return unit;
    }
  };

  const handleAccept = async () => {
    const confirmRes = window.confirm(`${notification.content.challengeName} 챌린지에 참여하시겠습니까?`);
    if (!confirmRes) return;

    setIsProcessing(true);
    try {
      await sendApi("/api/invite-challenge/accept", "POST", true, {
        inviteChallengeId: notification.content.inviteChallengeId
      });
      removeFromScreen(notification.notificationId);
    } catch (error) {
      console.error("챌린지 초대 수락 실패:", error);
      alert("챌린지 참여에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    const confirmRes = window.confirm(`${notification.content.challengeName} 챌린지 초대를 거절하시겠습니까?`);
    if (!confirmRes) return;

    setIsProcessing(true);
    try {
      await sendApi("/api/invite-challenge/reject", "POST", true, {
        inviteChallengeId: notification.content.inviteChallengeId
      });
      removeFromScreen(notification.notificationId);
    } catch (error) {
      console.error("챌린지 초대 거절 실패:", error);
      alert("챌린지 거절에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  const ChallengeIcon = RemixIcons[notification.content.challengeIcon];

  return (
    <div className={style["list-element"]}>
      <div className={style["notification-title-container"]}>
        <div className={style["notification-title-left-subcontainer"]}>
          {!notification.isRead && <div className={style["new-notification-mark"]}></div>}
          <div className={style["notification-title"]}>{notification.title}</div>
        </div>
        <div className={style["notification-title-right-subcontainer"]}>
          <img 
            src={deleteIcon} 
            className={style["delete-button"]} 
            title="알림 삭제" 
            onClick={() => onDelete(notification.notificationId)} 
          />
        </div>
      </div>
      
      <div className={style["notification-content"]}>
        <div className={style["challenge-info"]}>
          <div className={style["user-info"]}>
            <img 
              src={notification.content.userProfileImageUrl} 
              alt="프로필" 
              className={style["user-profile-image"]} 
            />
            <span>{notification.content.userNickname}</span>
          </div>
          
          <div className={style["challenge-details"]}>
            {ChallengeIcon && (
              <ChallengeIcon
                size={24}
                color={notification.content.challengeColorTheme.toLowerCase()}
                className={style["challenge-icon"]}
              />
            )}
            <div className={style["challenge-text"]}>
              <div className={style["challenge-name"]}>{notification.content.challengeName}</div>
              <div className={style["challenge-description"]}>{notification.content.challengeDescription}</div>
              <div className={style["challenge-goal"]}>
                목표: {notification.content.challengeGoalCount}회 / {getChallengeUnitText(notification.content.challengeUnit)}
              </div>
            </div>
          </div>
        </div>
        
        <div className={style["action-buttons"]}>
          <button 
            onClick={handleAccept} 
            className={style["accept-button"]}
            disabled={isProcessing}
          >
            수락
          </button>
          <button 
            onClick={handleReject} 
            className={style["reject-button"]}
            disabled={isProcessing}
          >
            거절
          </button>
        </div>
      </div>
      
      <div className={style["notification-date"]}>
        {new Date(notification.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default ChallengeInviteNotification; 