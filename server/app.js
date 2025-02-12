const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
dotenv.config();
app.use(express.json());

const port = 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log("MongoDB error: ", e));

app.get("/", async (req, res) => {
  console.time(1);
  const handle = "gonudayo";
  const response = await axios.get(
    encodeURI(`https://solved.ac/profile/${handle}`)
  );
  console.timeEnd(1);
  console.time(2);
  const $ = await cheerio.load(response.data);
  let problem_cnt = 0;
  for (let i = 0; i < 5; i++) {
    const data = $(
      `#__next > div.css-axxp2y > div > div:nth-child(8) > div.css-1cyj4c5 > div > table > tbody > tr:nth-child(${
        i + 2
      }) > td:nth-child(2) > b`
    );
    problem_cnt += +data.text();
  }
  console.log(problem_cnt);
  console.timeEnd(2);

  res.send(response.data);
});

const users = require("./src/routes/users");
app.use("/api/v1/users", users);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
