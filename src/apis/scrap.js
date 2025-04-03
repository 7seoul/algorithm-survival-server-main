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

    // 리소스 차단 설정
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // 페이지로 이동
    try {
      await page.goto(encodeURI(`https://solved.ac/profile/${handle}`), {
        waitUntil: "networkidle0",
        timeout: 15000, // 30초 타임아웃
      });
    } catch (timeoutError) {
      console.warn("Timeout occurred, proceeding with current page state...");
      // 타임아웃 발생 시 현재 상태로 진행
    }

    // 현재 HTML 가져오기
    const html = await page.content();
    const $ = cheerio.load(html);

    // tier
    const tier = $("img.css-19222jw").first().attr("alt") || undefined;

    // img
    const imgSrc = $("img.css-1q631t7").first().attr("src") || undefined;

    // bio
    // const bio =
    //   $("#__next > div.css-1s1t70h > div.css-1948bce > div:nth-child(4) > p")
    //     .text()
    //     .trim() || "";

    // solved
    const solvedElement = $(`a[href="/profile/${handle}/solved"]`).first();
    const solved =
      solvedElement.length > 0
        ? parseInt(solvedElement.find("b").text().replace(/,/g, ""), 10)
        : undefined;

    // streak
    const streakElement = $(
      "#__next > div.css-axxp2y > div > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > div > b"
    );
    const streakText = streakElement.text();
    const streak = streakText
      ? parseInt(streakText.replace(/,/g, ""), 10)
      : undefined;

    let success = true;
    if (
      tier === undefined ||
      solved === undefined ||
      imgSrc === undefined ||
      streak === undefined
    ) {
      success = false;
    }

    const userProfile = {
      success: success,
      tier: tier ? utils.tierList[tier] : undefined,
      solved: solved,
      imgSrc: imgSrc,
      streak: streak,
    };

    await page.close();
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
    const hrefs = $('a[href="/profile/gonudayo/solved"]');

    // 첫 번째 요소 선택
    const firstLink = hrefs.first();

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
