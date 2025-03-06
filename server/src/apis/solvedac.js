const axios = require("axios");
const cheerio = require("cheerio");
const utils = require("../utils/utils");

const puppeteer = require("puppeteer");

// 전역 브라우저 인스턴스
let browserInstance;

const initBrowser = async () => {
  if (!browserInstance || !browserInstance.isConnected()) {
    console.log("Initializing new browser...");
    browserInstance = await puppeteer.launch({ headless: true });
  }
  return browserInstance;
};

const scrapSolvedac = async (handle) => {
  let page;
  try {
    const browser = await initBrowser();
    page = await browser.newPage();

    // 페이지로 이동
    await page.goto(encodeURI(`https://solved.ac/profile/${handle}`), {
      waitUntil: "networkidle2",
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    // 티어
    const tier = $("img.css-19222jw").first().attr("alt") || "";

    // 프로필 사진
    const imgTag = $("img.css-1q631t7").first();
    const imgSrc = imgTag.attr("src") || "";

    // bio
    const bioElement = $(
      "#__next > div.css-1s1t70h > div.css-1948bce > div:nth-child(4) > p"
    );
    const bio = bioElement.length > 0 ? bioElement.text().trim() : "";

    // 합산할 레벨
    const targetLevels = ["Silver", "Gold", "Platinum", "Diamond", "Ruby"];
    let totalProblems = 0;

    // 테이블에서 문제 개수 합산
    $("table tbody tr").each((i, row) => {
      const level = $(row).find("td:first-child b").text().trim();
      if (targetLevels.includes(level)) {
        const problems = $(row)
          .find("td:nth-child(2) b")
          .text()
          .replace(/,/g, "")
          .trim();
        totalProblems += parseInt(problems, 10) || 0;
      }
    });

    const userProfile = {
      tier: utils.tierList[tier],
      cnt: totalProblems,
      imgSrc: imgSrc,
      bio: bio,
    };

    await page.close(); // 페이지만 닫기
    return userProfile;
  } catch (error) {
    console.error("Failed to scrapSolvedac:", error);
    throw new Error("Invalid data");
  } finally {
    if (page && !page.isClosed()) {
      await page.close().catch(() => console.log("Page already closed"));
    }
  }
};

// 브라우저 종료 함수 (필요 시 호출)
const closeBrowser = async () => {
  if (browserInstance && browserInstance.isConnected()) {
    await browserInstance.close();
    browserInstance = null;
    console.log("Browser closed.");
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
