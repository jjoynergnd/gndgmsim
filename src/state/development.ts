// src/state/development.ts

export interface DevelopmentEvent {
  season: number;
  week: number;
  changes: Record<string, number>;
  reason: string;
}