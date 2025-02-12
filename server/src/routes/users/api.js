const axios = require("axios");
const cheerio = require("cheerio");
const utils = require("./utils");

const scrapBoj = async (handle) => {
  try {
    return await axios.get(encodeURI(`https://www.acmicpc.net/user/${handle}`));
  } catch (error) {
    console.error("Failed to fetch Boj data:", error);
    throw new Error("Invalid profile URL");
  }
};

const scrapSolvedac = async (handle) => {
  try {
    const response = await axios.get(
      encodeURI(`https://solved.ac/profile/${handle}`)
    );
    const $ = cheerio.load(response.data);
    let problem_cnt = 0;
    const tier = $(
      "#__next > div.css-1s1t70h > div.css-1948bce > div.css-liauxj > img.css-19222jw"
    ).attr("alt");
    for (let i = 0; i < 5; i++) {
      const data = $(
        `#__next > div.css-axxp2y > div > div:nth-child(8) > div.css-1cyj4c5 > div > table > tbody > tr:nth-child(${
          i + 2
        }) > td:nth-child(2) > b`
      );
      problem_cnt += +data.text();
    }
    const userProfile = {
      tier: utils.tierList[tier],
      cnt: problem_cnt,
    };
    return userProfile;
  } catch (error) {
    console.error("Failed to fetch Solvedac data:", error);
    throw new Error("Invalid memberNo");
  }
};

const getSolvedacProfile = async (handle) => {
  try {
    const response = await axios.get("https://solved.ac/api/v3/user/show", {
      params: {
        handle: handle,
      },
    });

    const profile = response.data;

    return profile.tier;
  } catch (error) {
    console.error("Failed to fetch Solvedac Profile data:", error);
    throw new Error("Invalid Handle");
  }
};

const getSolvedacProblem = async (handle) => {
  try {
    const response = await axios.get(
      "https://solved.ac/api/v3/user/problem_stats",
      {
        params: {
          handle: handle,
        },
      }
    );
    const problems = response.data;
    let cnt = 0;
    for (let i = 6; i < problems.length; i++) {
      cnt += problems[i].solved;
    }

    return cnt;
  } catch (error) {
    console.error("Failed to fetch Solvedac Problem List:", error);
    throw new Error("Invalid Handle");
  }
};

module.exports = {
  scrapBoj,
  scrapSolvedac,
  getSolvedacProfile,
  getSolvedacProblem,
};
