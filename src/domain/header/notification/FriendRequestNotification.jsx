import React, { useState } from "react";
import style from "./NotificationListStyle.module.css";
import { sendApi } from "../../../utils/apiUtil";
import deleteIcon from "../../../assets/DeleteNotificationIcon.svg";

const FriendRequestNotification = ({ notification, onDelete }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // 화면에서만 제거하는 함수
  const removeFromScreen = (notificationId) => {
    onDelete(notificationId, true); // true는 API 호출 없이 화면에서만 제거하라는 의미
  };

  const handleAccept = async () => {
    const confirmRes = window.confirm(`${notification.content.nickname}님의 친구 요청을 수락하시겠습니까?`);
    if (!confirmRes) return;

    setIsProcessing(true);
    try {
      await sendApi("/api/friend-request/accept", "POST", true, {
        friendRequestId: notification.content.friendRequestId
      });
      removeFromScreen(notification.notificationId);
    } catch (error) {
      console.error("친구 요청 수락 실패:", error);
      alert("친구 요청 수락에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    const confirmRes = window.confirm(`${notification.content.nickname}님의 친구 요청을 거절하시겠습니까?`);
    if (!confirmRes) return;

    setIsProcessing(true);
    try {
      await sendApi("/api/friend-request/reject", "POST", true, {
        friendRequestId: notification.content.friendRequestId
      });
      removeFromScreen(notification.notificationId);
    } catch (error) {
      console.error("친구 요청 거절 실패:", error);
      alert("친구 요청 거절에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

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
        <div className={style["user-info"]}>
          <img 
            src={notification.content.profileImageUrl} 
            alt="프로필" 
            className={style["user-profile-image"]} 
          />
          <span>{notification.content.nickname}</span>
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

export default FriendRequestNotification; 