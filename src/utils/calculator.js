// prettier-ignore
const conversionCriteria = [
  0,                           // NR
  1, 1, 2, 3, 3,               // Bronze B5~B1
  5, 7, 9, 12, 15,             // Silver S5~S1
  18, 21, 24, 28, 32,          // Gold G5~G1
  36, 40, 44, 50, 60,          // Platinum P5~P1
  100, 150, 200, 250, 300,     // Diamond D5~D1
  1000, 1500, 2000, 2500, 3000 // Ruby R5~R1
];

const conversionScore = (current) => {
  let totalScore = 0;
  for (let i = 0; i < current.length; i++) {
    totalScore += current[i] * conversionCriteria[i];
  }

  return totalScore;
};

module.exports = {
  conversionCriteria,
  conversionScore,
};
