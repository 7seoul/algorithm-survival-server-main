const app = require("./app");
const cron = require("node-cron");
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
const update = require("./src/services/update");
update.init();

// 06시 마다 생존 업데이트
const survival = require("./src/services/survival");
if (process.env.NODE_ENV !== "test") {
  cron.schedule("0 6 * * *", survival.start);
}
