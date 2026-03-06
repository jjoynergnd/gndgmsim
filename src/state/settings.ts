// src/state/settings.ts

export interface LeagueSettings {
  difficulty: "casual" | "sim" | "hardcore";
  sliders: Record<string, number>;
}