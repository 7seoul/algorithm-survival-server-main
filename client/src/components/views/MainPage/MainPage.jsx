import React, { useState, useEffect } from "react";
import { Spin, Grid } from "antd";
import CardList from "./CardList";
import UserModal from "./UserModal";
import { getCardWidth } from "./helpers";
import { localMap } from "./localMap";

const { useBreakpoint } = Grid;

function MainPage({ users, loading, syncUserData }) {
  const screens = useBreakpoint();
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      const updatedUser = users.find(user => user.handle === selectedUser.handle);
      if (updatedUser && (
        updatedUser.curCnt !== selectedUser.curCnt || 
        updatedUser.startCnt !== selectedUser.startCnt || 
        updatedUser.local !== selectedUser.local
      )) {
        setSelectedUser({
          ...updatedUser,
          localName: localMap[updatedUser.local] || "미정"
        });
      }
    }
  }, [users, selectedUser]);

  const survivals = users
    .map((user) => ({ ...user, localName: localMap[user.local] || "미정" }))
    .filter((user) => user.survival);
  const overs = users
    .map((user) => ({ ...user, localName: localMap[user.local] || "미정" }))
    .filter((user) => !user.survival);

  const handleCardClick = (user) => {
    setSelectedUser({
      ...user,
      localName: localMap[user.local] || "미정"
    });
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
          <h2 style={{ marginTop: "40px" }}>Game Over</h2>
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
        syncUserData={syncUserData}
      />
    </div>
  );
}

export default MainPage;