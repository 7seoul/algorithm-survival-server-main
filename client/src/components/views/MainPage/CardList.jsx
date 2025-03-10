import React from "react";
import UserCard from "./UserCard";

function CardList({ users, onCardClick, cardWidth }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "flex-start",
      }}
    >
      {users.map((user) => (
        <UserCard
          key={user.handle}
          user={user}
          onCardClick={onCardClick}
          cardWidth={cardWidth}
        />
      ))}
    </div>
  );
}

export default CardList;
