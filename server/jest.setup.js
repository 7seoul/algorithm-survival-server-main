const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB (beforeAll)");
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log("Disconnected from MongoDB (afterAll)");
});
