import React, { useState } from "react";
import styles from "./ChallengeInfoPageStyle.module.css";
import { sendApi } from "../../utils/apiUtil";
import axios from "axios";
import checkIcon from "../../assets/CheckIcon.svg";
import { COLOR_MAP } from "./colorUtil";

function MyStatus({ challengeInfo, subInfo, colorTheme = 'GREEN', isReadOnly = false, nickname, myUserId, targetUserId }) {
  if (!subInfo) return null;
  const { userInfo, phaseInfo, participatePhaseInfo } = subInfo;
  const themeColor = COLOR_MAP[colorTheme] || COLOR_MAP.GREEN;
  const themeBg = themeColor + '22';

  // 상태 관리
  const [completeCount, setCompleteCount] = useState(participatePhaseInfo.completeCount);
  const [comment, setComment] = useState(participatePhaseInfo.comment || "");
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [evidencePhotos, setEvidencePhotos] = useState(participatePhaseInfo.evidencePhotoInfoList || []);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [evidenceError, setEvidenceError] = useState("");

  // 개수 증가/감소
  const handleCount = async (type) => {
    const next = type === 'inc' ? completeCount + 1 : completeCount - 1;
    if (next < 0 || next > challengeInfo.goalCount) return;
    try {
      await sendApi(`/api/participate-phase/${participatePhaseInfo.id}/current-count`, "PATCH", true, { value: next });
      setCompleteCount(next);
    } catch {
      alert(type === 'inc' ? "달성 개수 증가 중 오류가 발생했습니다." : "달성 개수 감소 중 오류가 발생했습니다.");
    }
  };

  // 한마디 수정
  const handleCommentChange = (e) => setComment(e.target.value);
  const handleCommentEdit = async () => {
    if (!isEditingComment) return setIsEditingComment(true);
    if (comment.length > 1000) return setCommentError("* 한마디는 1000자 이하여야 합니다.");
    try {
      await sendApi(`/api/participate-phase/${participatePhaseInfo.id}/comment`, "PATCH", true, { comment });
      setIsEditingComment(false);
      setCommentError("");
    } catch (e) {
      setCommentError(e.response?.data?.message ? `* ${e.response.data.message}` : "* 한마디 저장 중 오류가 발생했습니다.");
    }
  };

  // 증거사진 추가/삭제
  const handleAddEvidence = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setEvidenceError("");
    if (evidencePhotos.length + files.length > participatePhaseInfo.maxEvidencePhotoCount) {
      setEvidenceError(`* 최대 ${participatePhaseInfo.maxEvidencePhotoCount}개의 사진만 추가할 수 있습니다.`);
      setIsUploading(false);
      return;
    }
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        setEvidenceError("* 파일 크기는 10MB를 초과할 수 없습니다.");
        setIsUploading(false);
        return;
      }
      const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/svg", "image/svg+xml"];
      if (!allowedTypes.includes(file.type)) {
        setEvidenceError("* JPG, JPEG, PNG, GIF, SVG만 업로드 가능합니다.");
        setIsUploading(false);
        return;
      }
    }
    const formData = new FormData();
    for (const file of files) {
      formData.append("images", file);
    }
    try {
      const res = await axios.post(
        `/api/participate-phase/${participatePhaseInfo.id}/evidence-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setEvidencePhotos([...evidencePhotos, ...res.data.data]);
    } catch (e) {
      setEvidenceError(e.response?.data?.message ? `* ${e.response.data.message}` : "* 증거사진 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };
  const handleDeleteEvidence = async (photoId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setIsDeleting(true);
    try {
      await sendApi(`/api/evidence-photo/${photoId}`, "DELETE", true);
      setEvidencePhotos(evidencePhotos.filter((p) => p.id !== photoId));
    } catch (e) {
      setEvidenceError(e.response?.data?.message ? `* ${e.response.data.message}` : "* 증거사진 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.myStatusContainer}>
      {/* 타인 현황일 때 닉네임 상단 표시 */}
      {isReadOnly && (
        <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8, color: themeColor }}>{nickname}님의 현황</div>
      )}
      {/* 사용자 정보 */}
      <div className={styles.myStatusUserBox}>
        <img src={userInfo.profileImageUrl} alt={userInfo.nickname} className={styles.profileImgLarge} />
        <div>
          <div className={styles.nickname}>{userInfo.nickname}</div>
          <div className={styles.role} style={{ color: themeColor }}>{userInfo.challengeRole === "SUPER_ADMIN" ? "관리자" : "참가자"}</div>
          {userInfo.determination && (
            <div className={styles.determination}>{userInfo.determination}</div>
          )}
        </div>
      </div>
      {/* 페이즈 정보 */}
      <div className={styles.myStatusPhaseBox}>
        <div className={styles.myStatusPhaseTitle}>{phaseInfo.name}</div>
        {phaseInfo.description && (
          <div className={styles.phaseDesc}>{phaseInfo.description}</div>
        )}
        <div className={styles.myStatusPhaseDate}>
          <span className={styles.phaseDateTag} style={{ background: themeColor + '22', color: themeColor }}>{phaseInfo.startDate}</span>
          <span className={styles.phaseDateTilde}>~</span>
          <span className={styles.phaseDateTag} style={{ background: themeColor + '22', color: themeColor }}>{phaseInfo.endDate}</span>
        </div>
        <div className={styles.myStatusCountBox}>
          {challengeInfo.goalCount === 1 ? (
            !isReadOnly && (
              <button
                className={styles.toggleBtn}
                onClick={async () => {
                  const newValue = completeCount === 1 ? 0 : 1;
                  try {
                    await sendApi(`/api/participate-phase/${participatePhaseInfo.id}/current-count`, "PATCH", true, { value: newValue });
                    setCompleteCount(newValue);
                  } catch {
                    alert("달성 상태 변경 중 오류가 발생했습니다.");
                  }
                }}
                aria-pressed={completeCount === 1}
                style={{ background: completeCount === 1 ? themeColor : '#eee' }}
              >
                {completeCount === 1 ? (
                  <img src={checkIcon} alt="달성됨" style={{ width: 32, height: 32 }} />
                ) : (
                  <span style={{ fontSize: 28, color: '#aaa' }}></span>
                )}
              </button>
            )
          ) : (
            <>
              {!isReadOnly && <button onClick={() => handleCount('dec')} disabled={completeCount <= 0} className={styles.countBtn}>-</button>}
              <span className={styles.countValue}>{completeCount} / {challengeInfo.goalCount}</span>
              {!isReadOnly && <button onClick={() => handleCount('inc')} disabled={completeCount >= challengeInfo.goalCount} className={styles.countBtn}>+</button>}
            </>
          )}
        </div>
      </div>
      {/* 한마디 */}
      <div className={styles.myStatusCommentBox}>
        <div className={styles.commentHeader}>
          <span className={styles.commentTitle}>한마디</span>
          {!isReadOnly && <button onClick={handleCommentEdit} className={styles.commentEditBtn}>{isEditingComment ? "완료" : "수정"}</button>}
          <span className={styles.commentError}>{commentError}</span>
        </div>
        {isEditingComment ? (
          <textarea value={comment} onChange={handleCommentChange} className={styles.commentTextarea} maxLength={1000} />
        ) : (
          <div className={styles.commentText}>{comment || <span className={styles.commentPlaceholder}>한마디를 입력해보세요.</span>}</div>
        )}
      </div>
      {/* 증거사진 */}
      <div className={styles.myStatusEvidenceBox}>
        <div className={styles.evidenceHeader}>증거사진
          {!isReadOnly && (
            <label className={styles.evidenceAddBtn}>
              {isUploading ? '업로드 중...' : '+ 추가'}
              <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleAddEvidence} disabled={isUploading} />
            </label>
          )}
        </div>
        <div className={styles.evidenceError}>{evidenceError}</div>
        <div className={styles.evidenceList}>
          {evidencePhotos.length === 0 && <div className={styles.evidencePlaceholder}>사진이 없습니다.</div>}
          {evidencePhotos.map((photo) => (
            <div key={photo.id} className={styles.evidenceItem}>
              <img src={photo.url} alt="증거사진" className={styles.evidenceImg} />
              {!isReadOnly && (
                <button className={styles.evidenceDeleteBtn} onClick={() => handleDeleteEvidence(photo.id)} disabled={isDeleting}>✖</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyStatus; 