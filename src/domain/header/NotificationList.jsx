import React, { useEffect, useRef, useState } from "react"
import style from "./NotificationListStyle.module.css"
import { sendApi } from "../../utils/apiUtil";

import nextPageIcon from "../../assets/NextNotificationPageIcon.svg"

const NotificationList = React.memo(() => {

  // State
  const [notificationList, setNotificationList] = useState([]);   // 알림 리스트
  const [page, setPage] = useState(0);                            // 현재 페이지
  const [hasMorePage, setHasMorePage] = useState(true);           // 더 불러올 알림이 있는가?
  const [isFetching, setIsFetching] = useState(false);            // 알림을 불러오는 중인가?
  const [isEmpty, setIsEmpty] = useState(false);                  // 알림이 존재하지 않는가?
  const observerRef = useRef(null);                               // IntersectionObserver를 위한 ref

  // 알림 리스트 불러오기
  useEffect(() => {
    const getNotificationList = async () => {
      setIsFetching(true);
    
      try {
        const data = await sendApi("/api/notification", "GET", true, {
          page: page,
          size: 1,
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
  }, [page])

  // 다음 페이지 불러오기 함수
  const getNextNotificationList = () => {
    if(hasMorePage) {
      setPage(page + 1);
    }
  }

  return (
    <div id={style["main-container"]}>
      <div ref={observerRef} id={style["list-container"]}>

        {/* 알림 리스트 */}
        {notificationList.map((notification, index) => 
          <div key={notification.notificationId} className={style["list-element"]}>

            <div className={style["notification-title"]}>{notification.title}</div>
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