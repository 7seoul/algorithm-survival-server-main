const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("./logger");

dotenv.config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((e) => logger.info("MongoDB error: ", e));

// 유저 정보 자동 업데이트
const autoUpdate = require("./src/services/autoUpdate");
autoUpdate.init();
