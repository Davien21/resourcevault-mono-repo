/**
 * Real imagery for the seed.
 *
 * - Contributor avatars use real portrait photos (pravatar) — deterministic and
 *   always available.
 * - Resource & category covers use curated, on-brand Unsplash photography,
 *   themed per category. Every URL below has been verified to return 200.
 *   The web client falls back to a branded gradient if an image ever fails.
 */

const UNSPLASH = (id: string, w = 1100, q = 70) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

/** Curated, themed cover photo pools per category slug. */
const COVER_POOLS: Record<string, string[]> = {
  "clinical-guidelines": [
    "1576091160550-2173dba999ef",
    "1584982751601-97dcc096659c",
    "1532938911079-1b06ac7ceec7",
    "1631815588090-d4bfec5b1ccb",
    "1559757148-5c350d0d3c56",
    "1581595219315-a187dd40c322",
  ].map((id) => UNSPLASH(id)),
  "community-outreach": [
    "1488521787991-ed7bbaae773c",
    "1517048676732-d65bc937f952",
    "1522071820081-009f0129c71c",
    "1521737604893-d14cc237f11d",
    "1559027615-cd4628902d4a",
    "1573497491208-6b1acb260507",
  ].map((id) => UNSPLASH(id)),
  "research-evidence": [
    "1532094349884-543bc11b234d",
    "1554475901-4538ddfbccc2",
    "1507003211169-0a1dd7228f2d",
    "1581093450021-4a7360e9a6b5",
  ].map((id) => UNSPLASH(id)),
  "professional-development": [
    "1503676260728-1c00da094a0b",
    "1524178232363-1fb2b075b655",
    "1434030216411-0b793f4b4173",
    "1450101499163-c8848c66ca85",
  ].map((id) => UNSPLASH(id)),
  "policy-advocacy": [
    "1529107386315-e1a2ed48a620",
    "1450101499163-c8848c66ca85",
    "1556761175-b413da4baf72",
    "1521791136064-7986c2920216",
  ].map((id) => UNSPLASH(id)),
  "templates-toolkits": [
    "1454165804606-c3d57bc86b40",
    "1517245386807-bb43f82c33c4",
    "1434030216411-0b793f4b4173",
    "1450101499163-c8848c66ca85",
  ].map((id) => UNSPLASH(id)),
  "safeguarding-ethics": [
    "1521791136064-7986c2920216",
    "1556761175-b413da4baf72",
    "1517048676732-d65bc937f952",
    "1488521787991-ed7bbaae773c",
  ].map((id) => UNSPLASH(id)),
  "data-digital-health": [
    "1551288049-bebda4e38f71",
    "1460925895917-afdab827c52f",
    "1551434678-e076c223a692",
    "1518186285589-2f7649de83e0",
    "1576765608535-5f04d1e3f289",
  ].map((id) => UNSPLASH(id)),
};

const FALLBACK_POOL = [
  UNSPLASH("1454165804606-c3d57bc86b40"),
  UNSPLASH("1517048676732-d65bc937f952"),
];

export function coverImageFor(categorySlug: string, index: number): string {
  const pool = COVER_POOLS[categorySlug] ?? FALLBACK_POOL;
  return pool[index % pool.length];
}

/** pravatar offers real stock portraits indexed 1–70. */
export function avatarByIndex(n: number): string {
  const img = (Math.abs(n) % 70) + 1;
  return `https://i.pravatar.cc/240?img=${img}`;
}

export function avatarForSeed(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return avatarByIndex(hash);
}

export const ORG = {
  name: "The Institute for Community & Public Health",
  short: "ICPH",
};
