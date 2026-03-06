// src/state/injury.ts

export interface InjuryEvent {
  type: string;
  bodyPart: string;
  severity: number;
  occurredInWeek: number;
  season: number;
  weeksMissed: number;
}