const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// API 라우트 설정 v1
const usersV1 = require("./src/v1/routes/users");
app.use("/api/v1/users", usersV1);

// API 라우트 설정 v2
const usersV2 = require("./src/v2/routes/users");
app.use("/api/v2/users", usersV2);

const auth = require("./src/v2/routes/auths");
app.use("/api/v2/auth", auth);

const groups = require("./src/v2/routes/groups");
app.use("/api/v2/groups", groups);

module.exports = app;
