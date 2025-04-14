const axios = require("axios");
const logger = require("../../logger");

const profile = async (handle) => {
  try {
    const response = await axios.get("https://solved.ac/api/v3/user/show", {
      params: {
        handle: handle,
      },
    });

    const profile = response.data;

    return profile;
  } catch (error) {
    logger.error(`Failed to profile: ${error}`);
    throw new Error("Invalid data");
  }
};

const problem = async (handle) => {
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

    const current = {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
      diamond: 0,
      ruby: 0,
    };

    for (let i = 1; i < problems.length; i++) {
      const solved = problems[i]?.solved ?? 0;

      if (1 <= i && i <= 5) {
        current.bronze += solved;
      } else if (6 <= i && i <= 10) {
        current.silver += solved;
      } else if (11 <= i && i <= 15) {
        current.gold += solved;
      } else if (16 <= i && i <= 20) {
        current.platinum += solved;
      } else if (21 <= i && i <= 25) {
        current.diamond += solved;
      } else if (26 <= i && i <= 30) {
        current.ruby += solved;
      }
    }

    return current;
  } catch (error) {
    logger.error(`Failed to problem: ${error}`);
    throw new Error("Invalid data");
  }
};

const grass = async (handle) => {
  try {
    const response = await axios.get("https://solved.ac/api/v3/user/grass", {
      params: {
        handle: handle,
        topic: "today-solved",
      },
    });

    const currentStreak = response.data.currentStreak;

    return currentStreak;
  } catch (error) {
    logger.error(`Failed to problem: ${error}`);
    throw new Error("Invalid data");
  }
};

module.exports = {
  profile,
  problem,
  grass,
};
