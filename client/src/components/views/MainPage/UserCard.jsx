import React from "react";
import { Card } from "antd";

function UserCard({ user, onCardClick, cardWidth }) {
  return (
    <div
      onClick={() => onCardClick(user)}
      style={{
        width: cardWidth,
        minWidth: "150px",
        maxWidth: "200px",
        cursor: "pointer",
      }}
    >
      <Card
        hoverable
        style={{ width: "100%" }}
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
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
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
          {user.localName}
        </p>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          점수: {user.curCnt - user.startCnt}
        </p>
      </Card>
    </div>
  );
}

export default UserCard;
