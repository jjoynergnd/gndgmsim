// src/generator/utils/random.ts

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function weightedPick<T>(items: { value: T; weight: number }[]): T {
  const total = items.reduce((sum, i) => sum + i.weight, 0);
  let r = Math.random() * total;

  for (const item of items) {
    if (r < item.weight) return item.value;
    r -= item.weight;
  }

  return items[items.length - 1].value;
}

export function chance(p: number): boolean {
  return Math.random() < p;
}