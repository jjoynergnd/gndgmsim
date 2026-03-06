// src/state/transactions.ts

export interface TransactionLogEntry {
  id: string;
  type: string; // e.g. "SIGNING", "TRADE", "CUT", "INJURY", etc.
  teamId?: string;
  playerId?: string;
  details: string;
  timestamp: number;
}