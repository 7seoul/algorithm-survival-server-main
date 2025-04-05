const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const utils = require("../utils/utils");
const PQueue = require("p-queue").default;
const queue = new PQueue({ concurrency: 5 });
const MAX_USAGE = 100;

let browserInstance;
let usageCount = 0;
let initializing = null;

const initBrowser = async () => {
  if (
    browserInstance &&
    browserInstance.isConnected() &&
    usageCount < MAX_USAGE
  ) {
    usageCount++;
    return browserInstance;
  }

  if (!initializing) {
    initializing = (async () => {
      if (browserInstance) {
        try {
          await browserInstance.close();
          console.log("Old browser closed.");
        } catch (e) {
          console.warn("Failed to close browser:", e);
        }
      }
      console.log("Initializing new browser...");
      browserInstance = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      usageCount = 0;
      initializing = null;
      return browserInstance;
    })();
  }

  await initializing;
  usageCount++;
  return browserInstance;
};

const profile = async (handle) => {
  return queue.add(async () => {
    let page;
    try {
      const browser = await initBrowser();
      page = await browser.newPage();

      await page.setRequestInterception(true);
      page.on("request", (request) => {
        const resourceType = request.resourceType();
        if (["image", "font", "media"].includes(resourceType)) {
          request.abort();
        } else {
          request.continue();
        }
      });

      try {
        await page.goto(
          `https://solved.ac/profile/${encodeURIComponent(handle)}`,
          {
            waitUntil: "networkidle0",
            timeout: 15000,
          }
        );
      } catch (timeoutError) {
        console.warn("Timeout occurred, proceeding with current page state...");
      }

      const html = await page.content();
      const $ = cheerio.load(html);

      // tier
      const tier = $("img.css-19222jw").first().attr("alt") || undefined;

      // img
      const imgSrc = $("img.css-1q631t7").first().attr("src") || undefined;

      // solved
      const solvedElement = $(`a[href="/profile/${handle}/solved"]`).first();
      const solved = solvedElement.length
        ? parseInt(solvedElement.find("b").text().replace(/,/g, ""), 10)
        : undefined;

      // streak
      const streakElement = $(
        "#__next > div.css-axxp2y > div > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > div > b"
      );
      const streakText = streakElement.text();
      const streak = streakText
        ? parseInt(streakText.replace(/,/g, ""), 10)
        : undefined;

      const success =
        tier !== undefined &&
        solved !== undefined &&
        imgSrc !== undefined &&
        streak !== undefined;

      return {
        success,
        tier: tier ? utils.tierList[tier] : undefined,
        solved,
        imgSrc,
        streak,
      };
    } catch (error) {
      console.error("Failed to scrape profile:", error);
      return { success: false };
    } finally {
      if (page && !page.isClosed?.()) {
        try {
          await page.close();
        } catch (e) {
          console.warn("Page close failed:", e);
        }
      }
    }
  });
};

// 브라우저 종료
const closeBrowser = async () => {
  if (browserInstance && browserInstance.isConnected()) {
    await browserInstance.close();
    browserInstance = null;
    console.log("Browser closed.");
  }
};

module.exports = {
  profile,
  closeBrowser,
};
