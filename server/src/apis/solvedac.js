const axios = require("axios");
const cheerio = require("cheerio");
const utils = require("../utils/utils");

const scrapSolvedac = async (handle) => {
  try {
    const response = await axios.get(
      encodeURI(`https://solved.ac/profile/${handle}`)
    );
    const $ = cheerio.load(response.data);
    const tier = $("img.css-19222jw").first().attr("alt");
    const targetLevels = ["Silver", "Gold", "Platinum", "Diamond", "Ruby"]; // 합산할 레벨

    // 프로필 사진
    const imgTag = $("img.css-1q631t7").first();
    const imgSrc = imgTag.attr("src");

    // bio
    const bio = $("p").text().trim() || "";

    let totalProblems = 0;
    $("table tbody tr").each((i, row) => {
      const level = $(row).find("td:first-child b").text().trim(); // 레벨 이름 가져오기
      if (targetLevels.includes(level)) {
        const problems = $(row)
          .find("td:nth-child(2) b")
          .text()
          .replace(/,/g, "")
          .trim(); // 개수 추출 + 쉼표 제거
        totalProblems += parseInt(problems, 10); // 숫자로 변환 후 합산
      }
    });

    const userProfile = {
      tier: utils.tierList[tier],
      cnt: totalProblems,
      imgSrc: imgSrc,
      bio: bio,
    };

    return userProfile;
  } catch (error) {
    console.error("Failed to scrapSolvedac:", error);
    throw new Error("Invalid data");
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

    return profile;
  } catch (error) {
    console.error("Failed to getSolvedacProfile:", error);
    throw new Error("Invalid data");
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
    // 난이도 6부터 반영
    for (let i = 6; i < problems.length; i++) {
      cnt += problems[i].solved;
    }

    return cnt;
  } catch (error) {
    console.error("Failed to getSolvedacProblem:", error);
    throw new Error("Invalid data");
  }
};

module.exports = {
  scrapSolvedac,
  getSolvedacProfile,
  getSolvedacProblem,
};
