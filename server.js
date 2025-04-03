const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log("MongoDB error: ", e));

// 유저 정보 자동 업데이트
const autoUpdate = require("./src/services/autoUpdate");
autoUpdate.init();
