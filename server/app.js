const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log("MongoDB error: ", e));

// 유저 정보 자동 업데이트
const update = require("./src/services/update");
update.init();

// 06시 마다 생존 업데이트
const survival = require("./src/services/survival");
if (process.env.NODE_ENV !== "test") {
  cron.schedule("0 6 * * *", survival.start);
}

// API 라우트 설정
const users = require("./src/v1/routes/users");
app.use("/api/v1/users", users);

module.exports = app;
