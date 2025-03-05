import React, { useEffect, useState } from "react";
import { Row, Card, Spin, Grid } from "antd";
import axios from "axios";

const { useBreakpoint } = Grid;
const localMap = { 1: "서울", 2: "대전", 3: "구미", 4: "광주", 5: "부울경" };

function MainPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const screens = useBreakpoint();

  useEffect(() => {
    axios.get("http://localhost:5000/api/v1/users/all")
      .then(response => {
        if (response.data.success) {
          setUsers(response.data.users);
        }
      })
      .catch(error => console.error("데이터 불러오기 실패", error))
      .finally(() => setLoading(false));
  }, []);

  const getCardWidth = () => {
    if (screens.xxl) return "18%";
    if (screens.xl) return "22%";
    if (screens.lg) return "30%";
    if (screens.md) return "45%";
    if (screens.sm) return "90%";
    return "100%";
  };

  const renderCards = (filteredUsers) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "flex-start" }}>
      {filteredUsers.map(user => (
        <Card
          key={user.handle}
          hoverable
          style={{ width: getCardWidth(), minWidth: "200px", maxWidth: "250px", flex: "1 1 auto" }}
          cover={<img alt={user.name} src={user.imgSrc} style={{ width: "100%", height: "auto" }} onError={(e) => e.target.src = "http://localhost:3000/noImage.png"} />}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <img src={`https://static.solved.ac/tier_small/${user.tier}.svg`} alt={`Tier ${user.tier}`} style={{ width: "20px", height: "20px", marginRight: "8px" }} />
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>{user.name}</span>
          </div>
          <p style={{ margin: "5px 0", fontSize: "14px", color: "gray" }}>{localMap[user.local] || "미정"}</p>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>현재 점수: {user.curCnt - user.startCnt}</p>
        </Card>
      ))}
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Survival</h1>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <>
          <h2>Survival</h2>
          {renderCards(users.filter(user => user.survival))}
          <h2>Game Over</h2>
          {renderCards(users.filter(user => !user.survival))}
        </>
      )}
    </div>
  );
}

export default MainPage;