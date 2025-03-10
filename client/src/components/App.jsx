import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import NavBar from "./views/NavBar/NavBar";
import MainPage from "./views/MainPage/MainPage";
import RankingPage from "./views/RankingPage/RankingPage";

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("API 호출 됨");
    console.log(Date());
    axios
      .get("http://localhost:5000/api/v1/users/all")
      .then((response) => {
        if (response.data.success) {
          setUsers(response.data.users);
        }
      })
      .catch((error) => console.error("데이터 불러오기 실패", error))
      .finally(() => setLoading(false));
  }, []);

  // 특정 유저 데이터 동기화
  const syncUserData = async (handle) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/users/stats?handle=${handle}`
      );
      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.handle === handle ? { ...user, ...response.data.user } : user
          )
        );
      } else {
        throw new Error("동기화 실패");
      }
    } catch (error) {
      console.error("유저 데이터 동기화 실패", error);
    }
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              users={users}
              loading={loading}
              syncUserData={syncUserData}
            />
          }
        />
        <Route
          path="/ranking"
          element={<RankingPage users={users} loading={loading} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
