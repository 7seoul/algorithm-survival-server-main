const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
app.use(express.json());

const port = 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log("MongoDB error: ", e));

app.get("/", async (req, res) => {
  let response = await fetch(
    "https://solved.ac/api/v3/user/problem_stats?handle=gonudayo",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let data = await response.json();
  console.log(data);

  res.send(data);
});

const users = require("./src/routes/users");
app.use("/api/users", users);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
