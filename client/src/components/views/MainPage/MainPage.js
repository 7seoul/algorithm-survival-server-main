import React from "react";
import { Row, Card, Spin, Grid } from "antd";

const { useBreakpoint } = Grid;
const localMap = { 1: "서울", 2: "대전", 3: "구미", 4: "광주", 5: "부울경" };

function MainPage({ users, loading }) {
  const screens = useBreakpoint();

  const survivals = users.filter(user => user.survival);
  const overs = users.filter(user => !user.survival);

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
        <a
          key={user.handle}
          href={`https://solved.ac/profile/${user.handle}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            textDecoration: 'none', 
            color: 'inherit', 
            width: getCardWidth(), // <a> 태그에 너비 적용
            minWidth: "150px",
            maxWidth: "200px",
            display: 'block' // block으로 설정하여 카드 전체가 클릭 가능하도록
          }}
        >
          <Card
            hoverable
            style={{ 
              width: "100%", // Card가 부모 <a>의 전체 너비를 사용하도록
              minWidth: "150px", 
              maxWidth: "200px" 
            }}
            cover={
              <img 
                alt={user.name} 
                src={user.imgSrc} 
                style={{ width: "100%", height: "auto" }} 
                onError={(e) => e.target.src = "http://localhost:3000/noImage.png"} 
              />
            }
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <img 
                src={`https://static.solved.ac/tier_small/${user.tier}.svg`} 
                alt={`Tier ${user.tier}`} 
                style={{ width: "20px", height: "20px", marginRight: "8px" }} 
              />
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>{user.name}</span>
            </div>
            <p style={{ margin: "5px 0", fontSize: "14px", color: "gray" }}>
              {localMap[user.local] || "미정"}
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              Solved: {user.curCnt - user.startCnt}
            </p>
          </Card>
        </a>
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
          {overs.length === 0 ? <span> Nothing yet... </span> : renderCards(overs)}
        </>
      )}
    </div>
  );
}

export default MainPage;