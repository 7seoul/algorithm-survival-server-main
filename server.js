const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("./logger");
const autoUpdate = require("./src/services/autoUpdate");

const { migrateGroups, migrateUsers } = require("./migration");

dotenv.config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    logger.info("Connected to MongoDB");

    // 유저 정보 자동 업데이트
    autoUpdate.init();
  })
  .catch((e) => logger.error("MongoDB error: ", e));
