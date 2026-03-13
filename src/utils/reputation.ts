// src/utils/reputation.ts

export function getReputationTier(score: number): string {
  if (score >= 850) return "Elite GM";
  if (score >= 650) return "Respected Executive";
  if (score >= 450) return "Emerging GM";
  return "Unknown GM";
}