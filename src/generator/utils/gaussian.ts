// Normal distribution using Box–Muller transform
export function gaussian(mean: number, stdDev: number) {
  let u = 0;
  let v = 0;

  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  const num = Math.sqrt(-2.0 * Math.log(u)) *
              Math.cos(2.0 * Math.PI * v);

  return mean + stdDev * num;
}
