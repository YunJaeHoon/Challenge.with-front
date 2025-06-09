import React, { useContext, useEffect, useState } from "react";
import { AccountBasicInfoContext, LanguageContext } from "../../App";
import { sendApi } from "../../utils/apiUtil";
import { useNavigate } from "react-router-dom";
import * as RemixIcons from "@remixicon/react";

import style from "./CreateChallengePageStyle.module.css"

function CreateChallengePage() {
  const navigate = useNavigate();

  // Context
  const { accountBasicInfo } = useContext(AccountBasicInfoContext);
  const { language } = useContext(LanguageContext);

  // State
  const [isFetching, setIsFetching] = useState(true);
  const [friendList, setFriendList] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [challengeName, setChallengeName] = useState("");
  const [description, setDescription] = useState("");
  const [goalType, setGoalType] = useState(null);
  const [goalCount, setGoalCount] = useState(1);
  const [unit, setUnit] = useState(null);
  const [isAlone, setIsAlone] = useState(null);
  const [isPublic, setIsPublic] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [error, setError] = useState(null);
  const [currentIconPage, setCurrentIconPage] = useState(1);
  const [currentFriendPage, setCurrentFriendPage] = useState(0);
  const [totalFriendPages, setTotalFriendPages] = useState(0);
  const [friendError, setFriendError] = useState(null);
  const iconsPerPage = 12;

  const colorOptions = [
    { value: "RED", label: "빨강", color: "#FF3D00" },
    { value: "ORANGE", label: "주황", color: "#FF9000" },
    { value: "YELLOW", label: "노랑", color: "#FFD400" },
    { value: "GREEN", label: "초록", color: "#30DE20" },
    { value: "BLUE", label: "파랑", color: "#59C5FF" },
    { value: "WHITE", label: "하양", color: "#FFFFFF" },
    { value: "GRAY", label: "회색", color: "#C4C4C4" },
  ];

  const unitOptions = [
    { value: "DAILY", label: "매일" },
    { value: "WEEKLY", label: "매주" },
    { value: "MONTHLY", label: "매월" },
  ];

  const getPaginatedIcons = () => {
    const allIcons = Object.keys(RemixIcons);
    const startIndex = (currentIconPage - 1) * iconsPerPage;
    const endIndex = startIndex + iconsPerPage;
    return allIcons.slice(startIndex, endIndex);
  };

  const totalIconPages = Math.ceil(Object.keys(RemixIcons).length / iconsPerPage);

  const fetchFriendList = async (page) => {
    try {
      const friendListData = await sendApi(`/api/friend?page=${page}&size=1&sort=createdAt,desc`, "GET", true, {});
      
      if (friendListData) {
        if (friendListData.code === "FRIEND_NOT_FOUND") {
          setFriendError("친구가 없습니다.");
          setFriendList([]);
          setTotalFriendPages(0);
        } else {
          setFriendList(friendListData.friendList);
          setTotalFriendPages(friendListData.totalPageCount);
          setFriendError(null);
        }
      }
    } catch (error) {
      setFriendError("친구가 없습니다.");
      setFriendList([]);
      setTotalFriendPages(0);
    } finally {
      setIsFetching(false);
    }
  };

  // 내 챌린지 정보를 불러와서, 최대로 챌린지를 참여 중인지 확인
  // 친구 리스트 불러오기
  useEffect(() => {
    setIsFetching(true);

    if (accountBasicInfo === null) {
      return;
    } else if (accountBasicInfo === undefined) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    } else {
      const getMyChallenges = async () => {
        try {
          const myChallengesData = await sendApi("/api/challenge/me/ongoing", "GET", true, {});
          
          if (myChallengesData) {
            if (myChallengesData.countChallenge >= myChallengesData.maxChallengeCount) {
              alert("챌린지를 최대로 참여하고 있습니다.");
              navigate("/my-challenge");
            }
          }
        } catch (error) {
          console.error("챌린지 정보를 가져오는데 실패했습니다:", error);
        }

        await fetchFriendList(0);
      };

      getMyChallenges();
    }
  }, [accountBasicInfo]);

  const handlePageChange = async (newPage) => {
    setCurrentFriendPage(newPage);
    await fetchFriendList(newPage);
  };

  const isFormValid = () => {
    if (!selectedIcon) {
      return "아이콘을 선택해주세요.";
    }
    if (!selectedColor) {
      return "색상을 선택해주세요.";
    }
    if (!challengeName.trim()) {
      return "챌린지 이름을 입력해주세요.";
    }
    if (!goalType) {
      return "목표 설정 방식을 선택해주세요.";
    }
    if (goalType === "count" && (!goalCount || goalCount < 1)) {
      return "목표 개수를 입력해주세요.";
    }
    if (!unit) {
      return "주기를 선택해주세요.";
    }
    if (isAlone === null) {
      return "참여 방식을 선택해주세요.";
    }
    if (isPublic === null) {
      return "공개 여부를 선택해주세요.";
    }
    return null;
  };

  const handleCreateChallenge = async () => {
    const validationError = isFormValid();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const challengeData = {
        icon: selectedIcon,
        colorTheme: selectedColor,
        name: challengeName,
        description: description || null,
        goalCount: goalType === "toggle" ? 1 : goalCount,
        unit: unit,
        isAlone: isAlone,
        isPublic: isPublic,
        inviteUserIdList: selectedFriends.map(friend => friend.userId),
      };

      await sendApi("/api/challenge", "POST", true, challengeData);
      
      alert("챌린지가 생성되었습니다!");
      navigate("/my-challenge");
    } catch (error) {
      setError(error.response?.data?.message || "챌린지 생성 중 오류가 발생했습니다.");
    }
  };

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

  if (isFetching) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={style.container}>
      <h1>새로운 챌린지 만들기</h1>
      
      {error && <div className={style.error}>{error}</div>}

      <div className={style.section}>
        <h2>아이콘 선택</h2>
        {!selectedIcon && <div className={style.requiredMessage}>아이콘을 선택해야 합니다.</div>}
        <div className={style.iconGrid}>
          {getPaginatedIcons().map((iconName) => (
            <div
              key={iconName}
              className={`${style.iconItem} ${selectedIcon === iconName ? style.selected : ""}`}
              onClick={() => setSelectedIcon(iconName)}
            >
              {React.createElement(RemixIcons[iconName])}
            </div>
          ))}
        </div>
        <div className={style.pagination}>
          <button
            onClick={() => setCurrentIconPage(prev => Math.max(prev - 1, 1))}
            disabled={currentIconPage === 1}
          >
            이전
          </button>
          <span>{currentIconPage} / {totalIconPages}</span>
          <button
            onClick={() => setCurrentIconPage(prev => Math.min(prev + 1, totalIconPages))}
            disabled={currentIconPage === totalIconPages}
          >
            다음
          </button>
        </div>
      </div>

      <div className={style.section}>
        <h2>색상 선택</h2>
        {!selectedColor && <div className={style.requiredMessage}>색상을 선택해야 합니다.</div>}
        <div className={style.colorGrid}>
          {colorOptions.map((color) => (
            <div
              key={color.value}
              className={`${style.colorItem} ${selectedColor === color.value ? style.selected : ""} ${
                color.value === "WHITE" ? style.whiteColor : ""
              }`}
              style={{ backgroundColor: color.color }}
              onClick={() => setSelectedColor(color.value)}
            />
          ))}
        </div>
      </div>

      <div className={style.section}>
        <h2>챌린지 정보</h2>
        {!challengeName.trim() && <div className={style.requiredMessage}>챌린지 이름을 입력해야 합니다.</div>}
        <input
          type="text"
          placeholder="챌린지 이름"
          value={challengeName}
          onChange={(e) => setChallengeName(e.target.value)}
          maxLength={255}
        />
        <textarea
          placeholder="챌린지 설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={255}
        />
      </div>

      <div className={style.section}>
        <h2>목표 설정</h2>
        {!goalType && <div className={style.requiredMessage}>목표 설정 방식을 선택해야 합니다.</div>}
        <div className={style.goalType}>
          <button
            className={goalType === "toggle" ? style.active : ""}
            onClick={() => setGoalType("toggle")}
          >
            토글식
          </button>
          <button
            className={goalType === "count" ? style.active : ""}
            onClick={() => setGoalType("count")}
          >
            개수식
          </button>
        </div>
        {goalType === "count" && (
          <input
            type="number"
            min="1"
            max="100"
            value={goalCount}
            onChange={(e) => setGoalCount(parseInt(e.target.value))}
          />
        )}
      </div>

      <div className={style.section}>
        <h2>주기 설정</h2>
        {!unit && <div className={style.requiredMessage}>주기를 선택해야 합니다.</div>}
        <div className={style.unitButtons}>
          {unitOptions.map((option) => (
            <button
              key={option.value}
              className={unit === option.value ? style.active : ""}
              onClick={() => setUnit(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={style.section}>
        <h2>참여 방식</h2>
        {isAlone === null && <div className={style.requiredMessage}>참여 방식을 선택해야 합니다.</div>}
        <div className={style.participationType}>
          <button
            className={isAlone === true ? style.active : ""}
            onClick={() => setIsAlone(true)}
          >
            혼자서
          </button>
          <button
            className={isAlone === false ? style.active : ""}
            onClick={() => setIsAlone(false)}
          >
            다함께
          </button>
        </div>
      </div>

      <div className={style.section}>
        <h2>공개 여부</h2>
        {isPublic === null && <div className={style.requiredMessage}>공개 여부를 선택해야 합니다.</div>}
        <div className={style.visibilityType}>
          <button
            className={isPublic === true ? style.active : ""}
            onClick={() => setIsPublic(true)}
          >
            공개
          </button>
          <button
            className={isPublic === false ? style.active : ""}
            onClick={() => setIsPublic(false)}
          >
            비공개
          </button>
        </div>
      </div>

      {!isAlone && (
        <div className={style.section}>
          <h2>친구 초대</h2>
          {friendError ? (
            <div className={style.friendError}>{friendError}</div>
          ) : (
            <>
              <div className={style.friendList}>
                {friendList?.map((friend) => (
                  <div
                    key={friend.userId}
                    className={`${style.friendItem} ${
                      selectedFriends.some((f) => f.userId === friend.userId)
                        ? style.selected
                        : ""
                    }`}
                    onClick={() => toggleFriendSelection(friend)}
                  >
                    <img src={friend.profileImageUrl} alt={friend.nickname} />
                    <span>{friend.nickname}</span>
                  </div>
                ))}
              </div>
              {totalFriendPages > 1 && (
                <div className={style.pagination}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(Math.max(currentFriendPage - 1, 0));
                    }}
                    disabled={currentFriendPage === 0}
                  >
                    이전
                  </button>
                  <span>{currentFriendPage + 1} / {totalFriendPages}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(Math.min(currentFriendPage + 1, totalFriendPages - 1));
                    }}
                    disabled={currentFriendPage === totalFriendPages - 1}
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <button
        className={style.createButton}
        onClick={handleCreateChallenge}
        disabled={isFormValid() !== null}
      >
        챌린지 생성하기
      </button>
    </div>
  );
}

export default CreateChallengePage;