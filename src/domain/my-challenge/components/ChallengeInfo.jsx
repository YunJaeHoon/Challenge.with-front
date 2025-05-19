import { useContext, useState } from "react";
import { sendApi } from "../../../utils/apiUtil";
import { LanguageContext } from "../../../App";
import axios from "axios";
import * as RemixIcons from "@remixicon/react";

import style from "./ChallengeInfoStyle.module.css";
import checkIcon from "../../../assets/CheckIcon.svg";
import increaseCountIcon from "../../../assets/IncreaseCountIcon.svg";
import decreaseCountIcon from "../../../assets/DecreaseCountIcon.svg";
import { RiHeart2Fill } from "@remixicon/react";

function ChallengeInfo({ challenge }) {

  // Context
  const { language } = useContext(LanguageContext);

  // State
  const [completeCount, setCompleteCount] = useState(challenge.completeCount);  // 달성 개수
  const [comment, setComment] = useState(challenge.comment);                    // 한마디
  const [isChangingComment, setIsChangingComment] = useState(false);            // 한마디를 수정 중인가?
  const [commentErrorMessage, setCommentErrorMessage] = useState("");           // 한마디 에러 메시지

  const [evidencePhotoList, setEvidencePhotoList] = useState(challenge.evidencePhotos);   // 증거사진 리스트
  const [evidencePhotoErrorMessage, setEvidencePhotoErrorMessage] = useState("");         // 증거사진 에러 메시지
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);                      // 증거사진을 업로드 중인가?
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);                          // 증거사진을 삭제 중인가?

  // 아이콘 컴포넌트 동적 생성
  const IconComponent = RemixIcons[`Ri${challenge.icon}`];

  // 페이즈 완료 토글
  const toggleCompleteCount = async () => {
    try {
      await sendApi(
        `/api/participate-phase/${challenge.participateCurrentPhaseId}/current-count`,
        "PATCH",
        true,
        {
          "value": completeCount == 0 ? 1 : 0
        }
      );

      setCompleteCount(completeCount == 0 ? 1 : 0);
    } catch(e) {
      alert("처리 중 오류가 발생하였습니다. 나중에 다시 시도해주세요.");
    }
  }

  // 페이즈 완료 개수 증가
  const increaseCompleteCount = async () => {
    try {
      if(completeCount === challenge.goalCount)
        return;

      await sendApi(
        `/api/participate-phase/${challenge.participateCurrentPhaseId}/current-count`,
        "PATCH",
        true,
        {
          "value": completeCount + 1
        }
      );

      setCompleteCount(completeCount + 1);
    } catch(e) {
      alert("처리 중 오류가 발생하였습니다. 나중에 다시 시도해주세요.");
    }
  }

  // 페이즈 완료 개수 감소
  const decreaseCompleteCount = async () => {
    try {
      if(completeCount === 0)
        return;

      await sendApi(
        `/api/participate-phase/${challenge.participateCurrentPhaseId}/current-count`,
        "PATCH",
        true,
        {
          "value": completeCount - 1
        }
      );

      setCompleteCount(completeCount - 1);
    } catch(e) {
      alert("처리 중 오류가 발생하였습니다. 나중에 다시 시도해주세요.");
    }
  }

  // 한마디 입럭
  function changeComment(e) {
    setComment(e.target.value);
  }

  // 한마디 수정 시작 및 완료
  async function toggleUpdateComment(e)
  {
    if(isChangingComment === false)
    {
      setIsChangingComment(true);
    }
    else
    {
      if(comment.length > 1000)
      {
        setCommentErrorMessage("* 한마디는 1000자를 넘으면 안됩니다.")
        return;
      }

      try {
        await sendApi(
          `/api/participate-phase/${challenge.participateCurrentPhaseId}/comment`,
          "PATCH",
          true,
          {
            "comment": comment
          }
        );
      } catch(e) {
        alert("처리 중 오류가 발생하였습니다. 나중에 다시 시도해주세요.");
      }

      setCommentErrorMessage("");
      setIsChangingComment(false);
    }
  }

  // 증거사진 추가
  async function addEvidencePhotos(e)
  {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhotos(true);

    // 파일 개수 검증
    if (evidencePhotoList.length + files.length > challenge.maxEvidencePhotoCount)
    {
      setEvidencePhotoErrorMessage(`* 최대 ${challenge.maxEvidencePhotoCount}개의 증거사진만 추가할 수 있습니다.`);
      setIsUploadingPhotos(false);
      return;
    }

    // 각 파일 검증
    for (const file of files) {
      // 파일 크기 검증 (10MB 제한)
      if (file.size > 10 * 1024 * 1024) {
        setEvidencePhotoErrorMessage("* 파일 크기는 10MB를 초과할 수 없습니다.");
        setIsUploadingPhotos(false);
        return;
      }

      // 파일 형식 검증
      const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/svg', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        setEvidencePhotoErrorMessage("* JPG, JPEG, PNG, GIF, SVG 형식의 이미지만 업로드 가능합니다.");
        setIsUploadingPhotos(false);
        return;
      }
    }

    const formData = new FormData();
    for (const file of files) {
      formData.append('images', file);
    }

    try {
      const response = await axios.post(
        `/api/participate-phase/${challenge.participateCurrentPhaseId}/evidence-photo`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${window.localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setEvidencePhotoList([...evidencePhotoList, ...response.data.data]);
      setEvidencePhotoErrorMessage("");
    } catch(e) {
      if (e.response?.data?.message) {
        setEvidencePhotoErrorMessage(`* ${e.response.data.message}`);
      } else {
        alert("처리 중 오류가 발생하였습니다. 나중에 다시 시도해주세요.");
      }
    } finally {
      setIsUploadingPhotos(false);
    }
  }

  // 증거사진 삭제
  async function deleteEvidencePhoto(evidencePhotoId) {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    setIsDeletingPhoto(true);

    try {
      await sendApi(
        `/api/evidence-photo/${evidencePhotoId}`,
        "DELETE",
        true
      );

      setEvidencePhotoList(evidencePhotoList.filter(photo => photo.evidencePhotoId !== evidencePhotoId));
    } catch(e) {
      alert("처리 중 오류가 발생하였습니다. 나중에 다시 시도해주세요.");
    } finally {
      setIsDeletingPhoto(false);
    }
  }

  return (
    <div className={style["container"]}>

      <div className={style["challenge-header"]} style={{background: challenge.colorTheme}}>
        
        <div className={style["challenge-left-subheader"]} style={challenge.challengeDescription === "" ? {alignItems: "center"} : {alignItems: "start"}}>
          <div className={style["challenge-icon-container"]}>
            {IconComponent && (
              <IconComponent
                size={36}
                color="black"
                className={style["challenge-icon"]}
              />
            )}
          </div>
          <div className={style["challenge-title-container"]}>
            <div className={style["challenge-title"]}>{challenge.challengeName}</div>
            <div className={style["challenge-description"]}>{challenge.challengeDescription}</div>
          </div>
        </div>

        <div className={style["challenge-right-subheader"]} style={challenge.challengeDescription === "" ? {alignItems: "center"} : {alignItems: "start"}}>
          <div className={style["challenge-tag"]}>
            시작 날짜 : {challenge.challengeStartDate}
          </div>
          <div className={style["challenge-tag"]}>
            {challenge.maxParticipantCount === 1 ? "혼자서" : "다함께"}
          </div>
          <div className={style["challenge-tag"]}>
            {
              challenge.unit === "DAILY" ? "매일" :
              challenge.unit === "WEEKLY" ? "매주" : "매월"
            }
          </div>
        </div>
        
      </div>

      <div className={style["phase-container"]}>

        <div className={style["phase-header"]}>

          <div className={style["phase-left-subheader"]} style={challenge.currentPhaseDescription === "" ? {alignItems: "center"} : {alignItems: "start"}}>
            <div className={style["phase-number-and-unit"]} style={{backgroundColor: `${challenge.colorTheme}50`}}>
              <div className={style["phase-number"]}>{challenge.currentPhaseNumber}</div>
              <div className={style["phase-unit"]}>{challenge.unit === "DAILY" ? "일" : challenge.unit === "WEEKLY" ? "주" : "월"}차</div>
            </div>
            <div className={style["phase-name-container"]}>
              <div className={style["phase-name"]}>{challenge.currentPhaseName}</div>
              <div className={style["phase-description"]}>{challenge.currentPhaseDescription}</div>
            </div>
          </div>

          <div className={style["phase-right-subheader"]} style={challenge.currentPhaseDescription === "" ? {alignItems: "center"} : {alignItems: "start"}}>
            <div className={style["phase-tag"]} style={{backgroundColor: `${challenge.colorTheme}50`}}>
              {challenge.currentPhaseEndDate} 까지
            </div>
          </div>
          
        </div>

        {
          challenge.goalCount === 1 ?

          <div className={style["update-toggle-container"]} onClick={toggleCompleteCount}>
            {
              completeCount === 1 &&
              <img src={checkIcon} className={style["check-icon"]} alt="완료" />
            }
          </div>

          :

          <div className={style["update-count-container"]}>
            <img src={decreaseCountIcon} className={style["update-count-icon"]} onClick={decreaseCompleteCount} alt="감소" />
            <div className={style["complete-count"]} style={{backgroundColor: `${challenge.colorTheme}50`}}>
              {completeCount} / {challenge.goalCount}
            </div>
            <img src={increaseCountIcon} className={style["update-count-icon"]} onClick={increaseCompleteCount} alt="증가" />
          </div>
        }

        <div className={style["update-description"]}>
          {
            completeCount < challenge.goalCount ? "버튼을 눌러 현재 페이즈를 완료하세요." : "현재 페이즈를 완료하였습니다!"
          }
        </div>

        <div className={style["comment-container"]}>
          <div className={style["comment-left-subcontainer"]}>
            <div className={style["comment-description"]}>한마디</div>
            <div
              className={style["comment-update-button"]}
              style={{backgroundColor: isChangingComment ? "#ffebad" : "#e1e1e1"}}
              onClick={toggleUpdateComment}
            >
              {isChangingComment ? "완료" : "수정하기"}
            </div>
            <div className={style["comment-error-message"]}>{commentErrorMessage}</div>
          </div>
          <div className={style["comment-right-subcontainer"]}>
            {
              isChangingComment &&
              <div
                className={style["comment-number-of-characters"]}
                style={{color : comment.length > 1000 ? "#FF3D00" : "#000000"}}
              >
                {comment.length} / 1000
              </div>
            }
          </div>
        </div>

        <textarea
          className={style["comment"]}
          type="text"
          name="comment"
          value={comment}
          onChange={changeComment}
          placeholder={language == "KOREAN" ? "한마디를 입력하세요." : "Enter a comment."}
          disabled={!isChangingComment ? true : false}
        />

      </div>

      <div className={style["evidence-photo-container"]}>
        <div className={style["evidence-photo-left-subcontainer"]}>
          <div className={style["evidence-photo-description"]}>증거사진</div>
          <div
            className={style["evidence-photo-count"]}
            style={{backgroundColor: `${challenge.colorTheme}50`}}
          >
            {evidencePhotoList.length} / {challenge.maxEvidencePhotoCount}
          </div>
        </div>
        <div className={style["evidence-photo-right-subcontainer"]}>
          <label 
            htmlFor="evidence-photo-input" 
            className={`${style["evidence-photo-insert-button"]} ${isUploadingPhotos ? style["deactivated-evidence-photo-insert-button"] : ""}`}
            style={{ cursor: isUploadingPhotos ? 'default' : 'pointer' }}
          >
            {isUploadingPhotos ? "업로드 중..." : "증거사진 추가"}
          </label>
          <input
            id="evidence-photo-input"
            type="file"
            accept="image/*"
            multiple
            onChange={addEvidencePhotos}
            disabled={isUploadingPhotos}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className={style["evidence-photo-error-message"]}>{evidencePhotoErrorMessage}</div>

      {
        evidencePhotoList.length > 0 ?
        <div className={style["evidence-photo-list"]}>
          {evidencePhotoList.map((evidencePhoto) => (
            <div key={evidencePhoto.evidencePhotoId} className={style["evidence-photo-item"]}>
              <img src={evidencePhoto.url} className={style["evidence-photo"]} />
              <button 
                className={style["delete-evidence-photo-button"]}
                onClick={() => deleteEvidencePhoto(evidencePhoto.evidencePhotoId)}
                disabled={isDeletingPhoto}
              >
                ✖
              </button>
            </div>
          ))}
        </div> :
        <div className={style["evidence-photo-not-found-message"]}>증거사진이 없습니다.</div>
      }
    </div>
  );
}

export default ChallengeInfo;