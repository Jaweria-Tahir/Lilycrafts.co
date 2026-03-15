export interface Product {
  id: number;
  name: string;
  /** Primary category for display (first of categories, or legacy single category). */
  category: string;
  /** All categories this product belongs to (for filtering). */
  categories?: string[];
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  images: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  tags: string[];
  estimatedDelivery: string;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

// Pastel color palettes for placeholder images
const CATEGORY_COLORS: Record<string, string> = {
  "Crochet Keychains": "#f9cedd",
  "Crochet Creations": "#f4a4bf",
  "Beaded Bracelets": "#c4b5f4",
  "Tasbeeh": "#a8d5ba",
  "Knitted Caps": "#f9cedd",
  "Resin Coasters": "#b8d9f5",
  "Jewelry Trays": "#f9cedd",
  "Keychains": "#fde8a0",
  "Mobile Phone Charms": "#f4a4bf",
  "Decoration Pieces": "#d4b5e0",
  "Knitted Flowers": "#f9cedd",
  "Quilling Art Frames": "#fde8a0",
  "Fridge Magnets": "#a8d5ba",
  "Woolen Caps": "#f4a4bf",
  "Plaster of Paris Trays": "#c4b5f4",
  "Mini Trays": "#b8d9f5",
  "Trinket Trays": "#f9cedd",
  "Candle Stands": "#fde8a0",
  "Pendants": "#d4b5e0",
  "Earrings": "#f9cedd",
  "Jhumkis": "#f4a4bf",
  "Paper Quilling Earrings": "#fde8a0",
  "DIY Kits": "#a8d5ba",
};

export const CATEGORIES = Object.keys(CATEGORY_COLORS);

// SVG placeholder image for a category
export function getPlaceholderImage(category: string, id: number): string {
  const color = CATEGORY_COLORS[category] || "#f9cedd";
  const initials = category.split(" ").map(w => w[0]).join("").slice(0, 2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${color}" rx="0"/>
    <circle cx="200" cy="160" r="60" fill="white" opacity="0.5"/>
    <text x="200" y="175" text-anchor="middle" font-family="Georgia,serif" font-size="40" font-weight="bold" fill="white" opacity="0.8">${initials}</text>
    <text x="200" y="260" text-anchor="middle" font-family="Georgia,serif" font-size="16" fill="#8b5e6e" opacity="0.9">${category}</text>
    <text x="200" y="285" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#b08898" opacity="0.7">#${id.toString().padStart(3,"0")}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const PRODUCTS: Product[] = [
  { id: 1, name: "Rosebud Crochet Keychain", category: "Crochet Keychains", price: 350, description: "Adorable handmade crochet rosebud keychain in soft pastel pink.", longDescription: "Each rosebud is carefully crocheted by hand using premium soft yarn. Perfect as a gift or personal accessory. Available in multiple pastel colors. Comes with a sturdy metal keyring.", images: [getPlaceholderImage("Crochet Keychains", 1)], inStock: true, isNew: true, isBestSeller: true, tags: ["pink", "gift", "cute"], estimatedDelivery: "3–5 business days", rating: 4.8, reviewCount: 24 },
  { id: 2, name: "Daisy Crochet Keychain", category: "Crochet Keychains", price: 300, description: "Sweet daisy crochet keychain, perfect everyday accessory.", longDescription: "Handcrafted daisy keychain made with soft cotton yarn. Lightweight and durable. Great for bags, keys, and backpacks.", images: [getPlaceholderImage("Crochet Keychains", 2)], inStock: true, isNew: false, tags: ["daisy", "flower", "cute"], estimatedDelivery: "3–5 business days", rating: 4.6, reviewCount: 18 },
  { id: 3, name: "Amigurumi Bear", category: "Crochet Creations", price: 850, description: "Tiny handmade crochet teddy bear, great as a gift.", longDescription: "This adorable mini amigurumi bear is crocheted with premium cotton yarn. Soft, cute, and stuffed firmly. Perfect gift for all ages.", images: [getPlaceholderImage("Crochet Creations", 3)], inStock: true, isNew: true, isBestSeller: true, tags: ["bear", "amigurumi", "gift"], estimatedDelivery: "4–6 business days", rating: 5.0, reviewCount: 41 },
  { id: 4, name: "Crochet Flower Bouquet", category: "Crochet Creations", price: 1200, description: "Everlasting crochet flower bouquet in soft pastel tones.", longDescription: "A beautiful bouquet of handmade crochet flowers that never wilt. Each petal is crocheted individually and assembled with love. A perfect keepsake gift.", images: [getPlaceholderImage("Crochet Creations", 4)], inStock: true, isNew: false, tags: ["flowers", "bouquet", "gift"], estimatedDelivery: "5–7 business days", rating: 4.9, reviewCount: 33 },
  { id: 5, name: "Crystal Beaded Bracelet", category: "Beaded Bracelets", price: 450, description: "Elegant crystal bead bracelet with pink and clear beads.", longDescription: "Handstrung crystal bead bracelet on durable elastic thread. Light and comfortable to wear. Each bead is selected for quality and clarity.", images: [getPlaceholderImage("Beaded Bracelets", 5)], inStock: true, isNew: true, isBestSeller: true, tags: ["crystal", "bracelet", "elegant"], estimatedDelivery: "2–4 business days", rating: 4.7, reviewCount: 52 },
  { id: 6, name: "Rose Quartz Bracelet", category: "Beaded Bracelets", price: 550, description: "Natural rose quartz gemstone bracelet for love and harmony.", longDescription: "Genuine rose quartz beads threaded on elastic. Each stone is natural and unique. Rose quartz is known as the stone of love and positive energy.", images: [getPlaceholderImage("Beaded Bracelets", 6)], inStock: true, isNew: false, tags: ["quartz", "gemstone", "healing"], estimatedDelivery: "2–4 business days", rating: 4.9, reviewCount: 67 },
  { id: 7, name: "33-Bead Wooden Tasbeeh", category: "Tasbeeh", price: 400, description: "Handcrafted wooden tasbeeh with 33 smooth beads.", longDescription: "Premium quality wooden tasbeeh with smooth sanded beads. Comfortable grip with a decorative tassel. A meaningful gift for any occasion.", images: [getPlaceholderImage("Tasbeeh", 7)], inStock: true, isNew: false, isBestSeller: true, tags: ["prayer", "wooden", "tasbeeh"], estimatedDelivery: "3–5 business days", rating: 4.8, reviewCount: 89 },
  { id: 8, name: "Pearl Tasbeeh 99 Beads", category: "Tasbeeh", price: 750, description: "Luxurious pearl finish tasbeeh with 99 elegant beads.", longDescription: "Beautifully crafted 99-bead tasbeeh with pearl-finish beads and a golden connector. Comes in a velvet gift pouch. A perfect gift for Eid or Ramadan.", images: [getPlaceholderImage("Tasbeeh", 8)], inStock: true, isNew: true, tags: ["pearl", "99 beads", "luxury"], estimatedDelivery: "3–5 business days", rating: 4.9, reviewCount: 44 },
  { id: 9, name: "Pastel Pink Knitted Cap", category: "Knitted Caps", price: 900, description: "Cozy hand-knitted cap in soft pastel pink wool.", longDescription: "Warmth meets style in this hand-knitted pastel pink cap. Made with soft premium wool yarn. One size fits most. Great for autumn and winter.", images: [getPlaceholderImage("Knitted Caps", 9)], inStock: true, isNew: true, isBestSeller: true, tags: ["winter", "cozy", "pink"], estimatedDelivery: "5–7 business days", rating: 4.7, reviewCount: 31 },
  { id: 10, name: "Floral Resin Coaster Set", category: "Resin Coasters", price: 1400, originalPrice: 1800, description: "Set of 4 handmade resin coasters with dried flowers inside.", longDescription: "Each coaster is uniquely handcrafted with real dried flowers embedded in clear resin. Non-slip base, heat resistant. Set of 4 matching coasters in pastel tones.", images: [getPlaceholderImage("Resin Coasters", 10)], inStock: true, isNew: false, isBestSeller: true, tags: ["coasters", "resin", "floral", "set"], estimatedDelivery: "7–10 business days", rating: 5.0, reviewCount: 28 },
  { id: 11, name: "Pink Marble Jewelry Tray", category: "Jewelry Trays", price: 1100, description: "Elegant pink marble-effect jewelry organizer tray.", longDescription: "Handpainted pink marble-effect tray perfect for organizing rings, earrings, and small accessories. Smooth finish with gold rim detail.", images: [getPlaceholderImage("Jewelry Trays", 11)], inStock: true, isNew: true, tags: ["organizer", "marble", "pink"], estimatedDelivery: "5–7 business days", rating: 4.8, reviewCount: 19 },
  { id: 12, name: "Pom-Pom Keychain", category: "Keychains", price: 250, description: "Fluffy handmade pom-pom keychain in pastel colors.", longDescription: "Soft and fluffy handmade pom-pom keychain. Available in assorted pastel colors. Lightweight and fun accessory for bags and keys.", images: [getPlaceholderImage("Keychains", 12)], inStock: true, isNew: false, tags: ["pompom", "fluffy", "colorful"], estimatedDelivery: "2–4 business days", rating: 4.5, reviewCount: 37 },
  { id: 13, name: "Strawberry Phone Charm", category: "Mobile Phone Charms", price: 350, description: "Cute strawberry crochet phone charm with loop strap.", longDescription: "Adorable handmade strawberry crochet charm with a detachable loop strap. Fits most smartphones and tablets. A sweet accessory to personalize your phone.", images: [getPlaceholderImage("Mobile Phone Charms", 13)], inStock: true, isNew: true, isBestSeller: true, tags: ["strawberry", "phone", "cute"], estimatedDelivery: "3–5 business days", rating: 4.9, reviewCount: 63 },
  { id: 14, name: "Macrame Wall Hanging", category: "Decoration Pieces", price: 1800, description: "Boho macrame wall hanging in natural and blush tones.", longDescription: "Handknotted macrame wall hanging using premium cotton cord. Driftwood hanger included. Each piece is unique and slightly different due to handmade nature.", images: [getPlaceholderImage("Decoration Pieces", 14)], inStock: true, isNew: false, tags: ["macrame", "boho", "home decor"], estimatedDelivery: "7–10 business days", rating: 4.8, reviewCount: 22 },
  { id: 15, name: "Crochet Rose Bunch", category: "Knitted Flowers", price: 650, description: "Bundle of 5 handcrafted crochet roses in mixed pastels.", longDescription: "Five beautiful handcrafted crochet roses with wire stems, bendable to any shape. Perfect for decoration, gifting, or DIY projects. Mixed pastel colors.", images: [getPlaceholderImage("Knitted Flowers", 15)], inStock: true, isNew: true, tags: ["roses", "bundle", "decoration"], estimatedDelivery: "4–6 business days", rating: 4.7, reviewCount: 45 },
  { id: 16, name: "Butterfly Quilling Frame", category: "Quilling Art Frames", price: 2200, description: "Intricate paper quilling butterfly art in a pastel pink frame.", longDescription: "This stunning paper quilling art piece features delicate butterfly motifs. Each swirl is individually rolled by hand. Comes in a ready-to-hang pastel pink frame (A4 size).", images: [getPlaceholderImage("Quilling Art Frames", 16)], inStock: true, isNew: true, isBestSeller: true, tags: ["art", "butterfly", "frame"], estimatedDelivery: "10–14 business days", rating: 5.0, reviewCount: 15 },
  { id: 17, name: "Flower Fridge Magnet Set", category: "Fridge Magnets", price: 450, description: "Set of 6 handpainted flower fridge magnets.", longDescription: "Adorable set of 6 flower-shaped fridge magnets, each handpainted in pastel colors. Strong magnets on back. Great as gifts or kitchen décor.", images: [getPlaceholderImage("Fridge Magnets", 17)], inStock: true, isNew: false, tags: ["magnets", "flowers", "kitchen"], estimatedDelivery: "3–5 business days", rating: 4.6, reviewCount: 29 },
  { id: 18, name: "Chunky Woolen Cap", category: "Woolen Caps", price: 1100, description: "Thick chunky-knit woolen cap for cozy winter days.", longDescription: "Super chunky knit cap using thick merino-blend wool. Warm, stylish, and oh-so-cozy. Available in multiple neutral and pastel tones.", images: [getPlaceholderImage("Woolen Caps", 18)], inStock: false, isNew: false, tags: ["chunky", "winter", "wool"], estimatedDelivery: "5–7 business days", rating: 4.8, reviewCount: 38 },
  { id: 19, name: "Floral PoP Tray", category: "Plaster of Paris Trays", price: 950, description: "Handpainted plaster of Paris tray with rose motifs.", longDescription: "Beautifully handcrafted plaster of Paris tray with intricate rose motifs painted by hand. Sealed with varnish for durability. Perfect for vanity or bedside.", images: [getPlaceholderImage("Plaster of Paris Trays", 19)], inStock: true, isNew: true, tags: ["PoP", "tray", "floral"], estimatedDelivery: "7–10 business days", rating: 4.7, reviewCount: 12 },
  { id: 20, name: "Gold Accent Mini Tray", category: "Mini Trays", price: 700, description: "Elegant mini tray with gold trim for jewelry and keys.", longDescription: "Chic mini ceramic-finish tray with a delicate gold trim edge. Perfect for rings, earrings, or small trinkets on a vanity. Smooth non-scratch base.", images: [getPlaceholderImage("Mini Trays", 20)], inStock: true, isNew: false, isBestSeller: true, tags: ["gold", "mini", "vanity"], estimatedDelivery: "4–6 business days", rating: 4.9, reviewCount: 54 },
  { id: 21, name: "Heart Trinket Tray", category: "Trinket Trays", price: 600, description: "Heart-shaped trinket tray for storing small treasures.", longDescription: "Adorable heart-shaped trinket tray handpainted in blush pink. Perfect for rings, hairpins, or small jewelry. Makes a lovely gift.", images: [getPlaceholderImage("Trinket Trays", 21)], inStock: true, isNew: true, tags: ["heart", "trinket", "gift"], estimatedDelivery: "4–6 business days", rating: 4.8, reviewCount: 47 },
  { id: 22, name: "Rose Petal Candle Stand", category: "Candle Stands", price: 1500, description: "Handcrafted candle stand decorated with dried rose petals.", longDescription: "Stunning handcrafted candle stand wrapped with dried rose petals and sealed in resin. Compatible with standard pillar candles. Adds a romantic ambiance.", images: [getPlaceholderImage("Candle Stands", 22)], inStock: true, isNew: false, tags: ["candle", "roses", "romantic"], estimatedDelivery: "7–10 business days", rating: 4.9, reviewCount: 21 },
  { id: 23, name: "Crescent Moon Pendant", category: "Pendants", price: 550, description: "Delicate crescent moon pendant in silver-tone metal.", longDescription: "Handcrafted crescent moon pendant on a dainty silver chain. Lightweight and elegant. Nickel-free metal with pink resin moon accent.", images: [getPlaceholderImage("Pendants", 23)], inStock: true, isNew: true, isBestSeller: true, tags: ["moon", "pendant", "silver"], estimatedDelivery: "3–5 business days", rating: 4.8, reviewCount: 58 },
  { id: 24, name: "Floral Drop Earrings", category: "Earrings", price: 450, description: "Light floral drop earrings in pastel pink resin.", longDescription: "Handcrafted resin earrings with dried flower inclusions. Ultra-lightweight, nickel-free hooks. Each pair is slightly unique due to the handmade nature.", images: [getPlaceholderImage("Earrings", 24)], inStock: true, isNew: true, isBestSeller: true, tags: ["floral", "resin", "lightweight"], estimatedDelivery: "3–5 business days", rating: 4.9, reviewCount: 76 },
  { id: 25, name: "Classic Gold Jhumki", category: "Jhumkis", price: 650, description: "Traditional bell-shaped jhumki earrings in gold tone.", longDescription: "Classic jhumki earrings with a traditional bell shape and gold-tone finish. Adorned with small pink stones. Nickel-free posts for sensitive ears.", images: [getPlaceholderImage("Jhumkis", 25)], inStock: true, isNew: false, isBestSeller: true, tags: ["jhumki", "gold", "traditional"], estimatedDelivery: "3–5 business days", rating: 4.7, reviewCount: 92 },
  { id: 26, name: "Quilling Flower Earrings", category: "Paper Quilling Earrings", price: 400, description: "Unique paper quilling floral stud earrings.", longDescription: "Delicate paper quilling earrings made with archival-quality paper and sealed with resin for durability. Ultra-lightweight, unique hand-rolled design.", images: [getPlaceholderImage("Paper Quilling Earrings", 26)], inStock: true, isNew: true, tags: ["quilling", "paper", "unique"], estimatedDelivery: "5–7 business days", rating: 4.8, reviewCount: 34 },
  { id: 27, name: "Crochet Starter Kit", category: "DIY Kits", price: 1800, originalPrice: 2200, description: "Complete beginner crochet kit with yarn, hook & patterns.", longDescription: "Everything you need to start crocheting! Includes 5 balls of pastel yarn, 3 crochet hooks, a tapestry needle, stitch markers, and 3 beginner patterns with step-by-step guide.", images: [getPlaceholderImage("DIY Kits", 27)], inStock: true, isNew: true, isBestSeller: true, tags: ["kit", "beginner", "crochet", "complete"], estimatedDelivery: "5–7 business days", rating: 4.9, reviewCount: 48 },
  { id: 28, name: "Beading DIY Kit", category: "DIY Kits", price: 1200, description: "DIY bracelet beading kit with assorted pastel beads.", longDescription: "Create your own beautiful bracelets! Kit includes 500+ assorted pastel beads, elastic thread, clasps, and design card with 5 bracelet patterns.", images: [getPlaceholderImage("DIY Kits", 28)], inStock: true, isNew: false, tags: ["beading", "bracelet", "DIY"], estimatedDelivery: "5–7 business days", rating: 4.7, reviewCount: 26 },
];

export const REVIEWS: Review[] = [
  { id: 1, name: "Aisha R.", rating: 5, comment: "Absolutely love my crochet keychain! The quality is amazing and it's so cute. Will definitely order more!", date: "2024-12-15", avatar: "AR" },
  { id: 2, name: "Sara M.", rating: 5, comment: "The resin coaster set is stunning. Every single one is unique and the flowers look so real. Perfect gift!", date: "2024-12-10", avatar: "SM" },
  { id: 3, name: "Fatima K.", rating: 5, comment: "I ordered the quilling earrings and I'm obsessed! They're so lightweight and I get compliments every time I wear them.", date: "2024-12-08", avatar: "FK" },
];