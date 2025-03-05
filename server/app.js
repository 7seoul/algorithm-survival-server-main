const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors')

const app = express();
dotenv.config();
app.use(express.json());

const port = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log("MongoDB error: ", e));

  app.use(cors())

// 유저 정보 자동 업데이트
const update = require("./src/services/update");
update.init();

const users = require("./src/routes/users");
app.use("/api/v1/users", users);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
