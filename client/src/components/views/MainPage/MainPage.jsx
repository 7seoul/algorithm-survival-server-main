import React, { useState } from "react";
import { Spin, Grid } from "antd";
import CardList from "./CardList";
import UserModal from "./UserModal";
import { getCardWidth } from "./helpers";
import { localMap } from "./localMap";

const { useBreakpoint } = Grid;

function MainPage({ users, loading, syncUserData }) {
  // syncUserData props 추가
  const screens = useBreakpoint();
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const survivals = users
    .map((user) => ({ ...user, localName: localMap[user.local] || "미정" }))
    .filter((user) => user.survival);
  const overs = users
    .map((user) => ({ ...user, localName: localMap[user.local] || "미정" }))
    .filter((user) => !user.survival);

  const handleCardClick = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <>
          <h2>Survival</h2>
          <CardList
            users={survivals}
            onCardClick={handleCardClick}
            cardWidth={getCardWidth(screens)}
          />
          <h2>Game Over</h2>
          {overs.length === 0 ? (
            <span>Nothing yet...</span>
          ) : (
            <CardList
              users={overs}
              onCardClick={handleCardClick}
              cardWidth={getCardWidth(screens)}
            />
          )}
        </>
      )}

      <UserModal
        visible={modalVisible}
        user={selectedUser}
        onClose={handleModalClose}
        syncUserData={syncUserData} // syncUserData 전달
      />
    </div>
  );
}

export default MainPage;
