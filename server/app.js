const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log("MongoDB error: ", e));

// // API 라우트 설정 v1
// const users = require("./src/v1/routes/users");
// app.use("/api/v1/users", users);

// API 라우트 설정 v2
const users = require("./src/v2/routes/users");
app.use("/api/v2/users", users);

module.exports = app;
