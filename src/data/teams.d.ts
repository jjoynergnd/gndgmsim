// src/data/teams.d.ts

export interface TeamMeta {
  id: string;
  city: string;
  mascot: string;
  conference: "AFC" | "NFC";
  division: string;
  color: string; // matches teams.js
}

export const teams: TeamMeta[];