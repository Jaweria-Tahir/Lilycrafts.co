/**
 * Shared categories used across frontend (Category page, Shop) and admin panel.
 * Products can belong to multiple categories.
 */
export const CATEGORIES = [
  "Mobile Charms",
  "Jhumki",
  "Trays",
  "Key Chains",
  "Quilling Art",
  "Crochet items",
  "Jewelry",
  "Home Decor",
] as const;

export const CATEGORY_DATA = [
  { name: "Mobile Charms", sub: "Phone charms & accessories" },
  { name: "Jhumki", sub: "Handmade traditional earrings" },
  { name: "Trays", sub: "Resin, jewelry & trinket trays" },
  { name: "Key Chains", sub: "Custom quilling & resin keychains" },
  { name: "Quilling Art", sub: "Framed artwork, quilling pieces" },
  { name: "Crochet items", sub: "Creations, caps, flowers" },
  { name: "Jewelry", sub: "Bracelets, pendants, earrings" },
  { name: "Home Decor", sub: "Candle stands, magnets, decor" },
];
