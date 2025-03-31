const axios = require("axios");

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
    console.error("Failed to profile:", error);
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
    let cnt = 0;
    // 난이도 6부터 반영
    for (let i = 6; i < problems.length; i++) {
      cnt += problems[i].solved;
    }

    return cnt;
  } catch (error) {
    console.error("Failed to problem:", error);
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
    console.log(problems);
    const problems = response.data;
  } catch (error) {
    console.error("Failed to problem:", error);
    throw new Error("Invalid data");
  }
};

module.exports = {
  profile,
  problem,
  grass,
};
