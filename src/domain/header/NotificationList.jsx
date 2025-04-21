import React, { useEffect, useRef, useState } from "react"
import style from "./NotificationListStyle.module.css"
import { sendApi } from "../../utils/apiUtil";

const NotificationList = React.memo(() => {

  // State
  const [notificationList, setNotificationList] = useState([]);   // 알림 리스트
  const [page, setPage] = useState(0);                            // 현재 페이지
  const [hasMorePage, setHasMorePage] = useState(true);           // 더 불러올 알림이 있는가?
  const [isFetching, setIsFetching] = useState(false);            // 알림을 불러오는 중인가?
  const observerRef = useRef(null);                               // IntersectionObserver를 위한 ref

  // 알림 리스트 불러오기
  const getNotificationList = async () => {
    if (isFetching || !hasMorePage) return;
  
    setIsFetching(true);
  
    try {
      const data = await sendApi("/api/notification", "GET", true, {
        page: page,
        size: 1,
        sort: "createdAt,desc"
      });
  
      console.log("Fetched page:", page, data);
  
      if (data.content) {
        setNotificationList((prev) => [...prev, ...data.content]);
        setHasMorePage(!data.isLast);
      }
    } catch {
      setHasMorePage(false);
    } finally {
      setIsFetching(false);
    }
  }  

  // 페이지 변경될 때마다 데이터 요청
  useEffect(() => {
    getNotificationList();
  }, [page]);

  // IntersectionObserver 설정
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isFetching && hasMorePage) {
        setPage((prev) => prev + 1);
      }
    }, {
      threshold: 0.7,
    });
  
    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);
  
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [isFetching, hasMorePage]);

  return (
    <div id={style["main-container"]}>
      <div id={style["list-container"]}>

        {/* 알림 리스트 */}
        {notificationList.map((notification, index) => 
          <div key={notification.notificationId} className={style["list-element"]}>

            <div className={style["notification-title"]}>{notification.title}</div>
            <div className={style["notification-content"]}>{notification.content}</div>
            <div className={style["notification-date"]}>
              {new Date(notification.createdAt).toLocaleString()}
            </div>
            {(hasMorePage || index !== notificationList.length - 1) && (
              <div className={style["notification-line"]}></div>
            )}

          </div>
        )}

        <div ref={observerRef} style={{ height: "30px" }} />

        {/* 알림 불러오는 중 */}
        {isFetching && <div id={style["loading-notification-description"]}>잠시만 기다려주세요.</div>}

      </div>
    </div>
  );
});

export default NotificationList