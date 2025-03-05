import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./views/NavBar/NavBar";
import MainPage from "./views/MainPage/MainPage";
import RankingPage from "./views/RankingPage/RankingPage";

export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/ranking" element={<RankingPage />} />
      </Routes>
    </Router>
  );
}
