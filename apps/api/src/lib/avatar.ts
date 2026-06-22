/** Deterministic, always-available real portrait for newly registered users. */
export function avatarSeedUrl(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const img = (hash % 70) + 1;
  return `https://i.pravatar.cc/240?img=${img}`;
}
