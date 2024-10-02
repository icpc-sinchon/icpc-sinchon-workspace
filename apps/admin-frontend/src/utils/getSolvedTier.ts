const tiers = [
  { maxRank: 30, tier: "not-ratable" },
  { maxRank: 60, tier: "b5" },
  { maxRank: 90, tier: "b4" },
  { maxRank: 120, tier: "b3" },
  { maxRank: 150, tier: "b2" },
  { maxRank: 200, tier: "b1" },
  { maxRank: 300, tier: "s5" },
  { maxRank: 400, tier: "s4" },
  { maxRank: 500, tier: "s3" },
  { maxRank: 650, tier: "s2" },
  { maxRank: 800, tier: "s1" },
  { maxRank: 950, tier: "g5" },
  { maxRank: 1100, tier: "g4" },
  { maxRank: 1250, tier: "g3" },
  { maxRank: 1400, tier: "g2" },
  { maxRank: 1600, tier: "g1" },
  { maxRank: 1750, tier: "p5" },
  { maxRank: 1900, tier: "p4" },
  { maxRank: 2000, tier: "p3" },
  { maxRank: 2100, tier: "p2" },
  { maxRank: 2200, tier: "p1" },
  { maxRank: 2300, tier: "d5" },
  { maxRank: 2400, tier: "d4" },
  { maxRank: 2500, tier: "d3" },
  { maxRank: 2600, tier: "d2" },
  { maxRank: 2700, tier: "d1" },
  { maxRank: 2800, tier: "r5" },
  { maxRank: 2850, tier: "r4" },
  { maxRank: 2900, tier: "r3" },
  { maxRank: 2950, tier: "r2" },
  { maxRank: 3000, tier: "r1" },
  { maxRank: Infinity, tier: "m" },
] as const;

// 배열의 요소 타입을 추론
type Tier = (typeof tiers)[number]["tier"];

export const getSolvedTier = (rank: number): Tier => {
  const foundTier = tiers.find(({ maxRank }) => rank < maxRank);

  return foundTier ? foundTier.tier : "not-ratable";
};
