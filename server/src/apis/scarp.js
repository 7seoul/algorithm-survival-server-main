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

const profile = async (handle) => {
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
    console.error("Failed to profile:", error);
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

const totalSolved = async (handle) => {
  try {
    // axios로 HTML 가져오기
    const response = await axios.get(
      encodeURI(`https://solved.ac/profile/${handle}`)
    );

    const html = response.data;

    // cheerio로 HTML 파싱
    const $ = cheerio.load(html);

    // href="/profile/gonudayo/solved"인 모든 a 태그 찾기
    const links = $('a[href="/profile/gonudayo/solved"]');

    // 첫 번째 요소 선택
    const firstLink = links.first();

    if (firstLink.length > 0) {
      const numberText = firstLink.find("b").text(); // 첫 번째 a 태그 안의 b 태그 텍스트
      const solved = parseInt(numberText.replace(/,/g, ""), 10);
      return solved;
    }

    console.log("해당 href를 가진 요소를 찾을 수 없습니다.");
    return -1;
  } catch (error) {
    console.error("Failed to totalSolved:", error);
    throw new Error("Invalid data");
  }
};

module.exports = {
  profile,
  totalSolved,
};
