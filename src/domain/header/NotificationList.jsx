import React, { useEffect, useRef, useState } from "react"
import style from "./NotificationListStyle.module.css"
import { sendApi } from "../../utils/apiUtil";

import nextPageIcon from "../../assets/NextNotificationPageIcon.svg"
import deleteIcon from "../../assets/DeleteNotificationIcon.svg"

const NotificationList = React.memo(({ isClicked }) => {

  // State
  const [notificationList, setNotificationList] = useState([]);   // 알림 리스트
  const [page, setPage] = useState(0);                            // 현재 페이지
  const [hasMorePage, setHasMorePage] = useState(true);           // 더 불러올 알림이 있는가?
  const [isFetching, setIsFetching] = useState(false);            // 알림을 불러오는 중인가?
  const [isEmpty, setIsEmpty] = useState(false);                  // 알림이 존재하지 않는가?

  // 알림 리스트 불러오기
  useEffect(() => {

    if(isClicked)
    {
      const getNotificationList = async () => {
        setIsFetching(true);
      
        try {
          const data = await sendApi("/api/notification", "GET", true, {
            page: page,
            size: 10,
            sort: "createdAt,desc"
          });
      
          if (data.content) {
            setNotificationList((prev) => [...prev, ...data.content]);
            setHasMorePage(!data.isLast);
          }
        } catch(error) {
          const errorCode = error.response.data.code;
  
          if(page === 0 && errorCode === "NOTIFICATION_NOT_FOUND")
            setIsEmpty(true);
          setHasMorePage(false);
        } finally {
          setIsFetching(false);
        }
      }
  
      getNotificationList();
    }
    else
    {
      setNotificationList([]);
      setPage(0);
    }
    
  }, [page, isClicked])

  // 다음 페이지 불러오기 함수
  const getNextNotificationList = () => {
    if(hasMorePage) {
      setPage(page + 1);
    }
  }

  // 알림 삭제 함수
  const deleteNotification = async (notificationId) => {
    const confirmRes = window.confirm("정말 알림을 삭제하시겠습니까?");
  
    if(confirmRes) {
      await sendApi(`/api/notification/${notificationId}`, "DELETE", true);
  
      setNotificationList((prev) => {
        const updatedList = prev.filter((notification) => notification.notificationId !== notificationId);
  
        if (updatedList.length === 0) {
          setIsEmpty(true);
        }
  
        return updatedList;
      });
    }
  };

  return (
    <div id={style["main-container"]} style={isClicked ? {display: "flex"} : {display: "none"}}>
      <div id={style["list-container"]}>

        <div id={style["main-title"]}>[ 알림 ]</div>

        {/* 알림 리스트 */}
        {notificationList.map((notification, index) => 
          <div key={notification.notificationId} className={style["list-element"]}>

            <div className={style["notification-title-container"]}>
              <div className={style["notification-title-left-subcontainer"]}>
                {!notification.isRead && <div className={style["new-notification-mark"]}></div>}
                <div className={style["notification-title"]}>{notification.title}</div>
              </div>
              <div className={style["notification-title-right-subcontainer"]}>
                <img src={deleteIcon} className={style["delete-button"]} title="알림 삭제" onClick={() => deleteNotification(notification.notificationId)} />
              </div>
            </div>
            
            <div className={style["notification-content"]}>{notification.content}</div>
            <div className={style["notification-date"]}>
              {new Date(notification.createdAt).toLocaleString()}
            </div>
            {
              (index < notificationList.length - 1) ? <div className={style["notification-line"]}></div> : ""
            }

          </div>
        )}

        {/* 알림 불러오는 중 */}
        {
          isEmpty ? <div id={style["empty-notification-description"]}>알림이 없습니다.</div> :
          isFetching ? <div id={style["loading-notification-description"]}>잠시만 기다려주세요.</div> :
          hasMorePage ? <img src={nextPageIcon} id={style["next-page-button"]} onClick={getNextNotificationList} /> :
          ""
        }

      </div>
    </div>
  );
});

export default NotificationList