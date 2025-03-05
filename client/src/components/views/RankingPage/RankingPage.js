import { useState, useEffect } from "react";

export default function RankingPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className="p-4">
      <ul>
        {users.map((user, index) => (
          <li key={user.id} className="p-2 border-b">
            {index + 1}. {user.name} - {user.region}
          </li>
        ))}
      </ul>
    </div>
  );
} 