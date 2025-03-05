import { useState, useEffect } from "react";

export default function MainPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      {users.map((user) => (
        <div key={user.id} className="p-4 border rounded">
          <p>{user.name}</p>
          <p>{user.region}</p>
        </div>
      ))}
    </div>
  );
}