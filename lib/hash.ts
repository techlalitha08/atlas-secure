/**
 * Deterministic string hash (djb2-style) used by the mock agents to derive
 * stable pseudo-random values from a target string. Shared so every agent
 * produces consistent seeds from the same input.
 */
export function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
