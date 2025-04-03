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
const users = require("./src/v2/routes/users");
const auth = require("./src/v2/routes/auths");
const groups = require("./src/v2/routes/groups");
const rankings = require("./src/v2/routes/rankings");
const search = require("./src/v2/routes/search");

app.use("/api/v2/users", users);
app.use("/api/v2/auth", auth)
app.use("/api/v2/groups", groups);
app.use("/api/v2/rankings", rankings);
app.use("/api/v2/search", search);

module.exports = app;
