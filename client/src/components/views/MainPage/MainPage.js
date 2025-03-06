import React, { useState } from "react";
import { Row, Card, Spin, Grid, Modal, Button } from "antd";

const { useBreakpoint } = Grid;
const localMap = { 1: "서울", 2: "대전", 3: "구미", 4: "광주", 5: "부울경" };

function MainPage({ users, loading }) {
  const screens = useBreakpoint();
  const [selectedUser, setSelectedUser] = useState(null); // 선택된 유저 상태
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 상태

  const survivals = users.filter((user) => user.survival);
  const overs = users.filter((user) => !user.survival);

  const getCardWidth = () => {
    if (screens.xxl) return "18%";
    if (screens.xl) return "22%";
    if (screens.lg) return "30%";
    if (screens.md) return "45%";
    if (screens.sm) return "90%";
    return "100%";
  };

  const handleCardClick = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const renderCards = (filteredUsers) => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "flex-start",
      }}
    >
      {filteredUsers.map((user) => (
        <div
          key={user.handle}
          onClick={() => handleCardClick(user)}
          style={{
            width: getCardWidth(),
            minWidth: "150px",
            maxWidth: "200px",
            cursor: "pointer",
          }}
        >
          <Card
            hoverable
            style={{
              width: "100%",
              minWidth: "150px",
              maxWidth: "200px",
            }}
            cover={
              <img
                alt={user.name}
                src={user.imgSrc}
                style={{ width: "100%", height: "auto" }}
                onError={(e) =>
                  (e.target.src = "http://localhost:3000/noImage.png")
                }
              />
            }
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <img
                src={`https://static.solved.ac/tier_small/${user.tier}.svg`}
                alt={`Tier ${user.tier}`}
                style={{ width: "20px", height: "20px", marginRight: "2px" }}
              />
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                {user.name}
              </span>
            </div>
            <p style={{ margin: "5px 0", fontSize: "14px", color: "gray" }}>
              {localMap[user.local] || "미정"}
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              점수: {user.curCnt - user.startCnt}
            </p>
          </Card>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <>
          <h2>Survival</h2>
          {renderCards(survivals)}
          <h2>Game Over</h2>
          {overs.length === 0 ? (
            <span> Nothing yet... </span>
          ) : (
            renderCards(overs)
          )}
        </>
      )}

      {/* 확장된 카드 모달 */}
      <Modal
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        centered
        width={400} // 모달 너비 조정
        bodyStyle={{ padding: "20px" }}
      >
        {selectedUser && (
          <div style={{ textAlign: "center" }}>
            <img
              alt={selectedUser.name}
              src={selectedUser.imgSrc}
              style={{
                width: "100%",
                maxWidth: "200px",
                height: "auto",
                marginBottom: "16px",
              }}
              onError={(e) =>
                (e.target.src = "http://localhost:3000/noImage.png")
              }
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              <img
                src={`https://static.solved.ac/tier_small/${selectedUser.tier}.svg`}
                alt={`Tier ${selectedUser.tier}`}
                style={{ width: "24px", height: "24px", marginRight: "2px" }}
              />
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                {selectedUser.name}
              </span>
            </div>
            <p style={{ margin: "10px 0", fontSize: "16px", color: "gray" }}>
              {localMap[selectedUser.local] || "미정"}
            </p>
            <p style={{ margin: "10px 0", fontSize: "16px" }}>
              점수: {selectedUser.curCnt - selectedUser.startCnt}
            </p>
            <p
              style={{
                margin: "10px 0",
                fontSize: "14px",
                color: "#888",
                wordBreak: "break-word", // 긴 텍스트 줄바꿈 처리
              }}
            >
              {selectedUser.bio || "자기소개가 없습니다."}
            </p>
            <Button
              type="primary"
              href={`https://solved.ac/profile/${selectedUser.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: "10px" }}
            >
              프로필로 이동
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default MainPage;
