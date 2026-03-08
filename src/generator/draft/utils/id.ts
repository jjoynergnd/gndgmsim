// src/generator/draft/utils/id.ts

import { v4 as uuid } from "uuid";

export function generateId(): string {
  return uuid();
}