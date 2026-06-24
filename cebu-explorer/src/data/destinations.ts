export interface Destination {
  id: string;
  name: string;
  category: 'falls' | 'islands' | 'beaches' | 'mountains' | 'attract';
  badge: string;
  location: string;
  mapsUrl: string;
  description: string;
  whyVisit: string;
  imageUrl: string;
  rating: number;
}

export const DESTINATIONS: Destination[] = [
  // WATERFALLS
  {
    id: "kawasan-falls",
    name: "Kawasan Falls",
    category: "falls",
    badge: "Waterfall",
    location: "Badian, South Cebu",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kawasan+Falls+Badian+Cebu",
    description: "A multi-tiered waterfall famous for its turquoise water and canyoneering route from Alegria.",
    whyVisit: "Swim in jade pools, take a bamboo raft under cascading falls, or join the iconic canyoneering adventure.",
    imageUrl: "https://images.unsplash.com/photo-1544085311-11a028465b03?w=800&q=80",
    rating: 4.9
  },
  {
    id: "aguinid-falls",
    name: "Aguinid Falls",
    category: "falls",
    badge: "Waterfall",
    location: "Samboan, South Cebu",
    mapsUrl: "https://www.google.com/maps/place/Aguinid+Falls/@9.507662,123.3019219,17z/",
    description: "An eight-tier limestone waterfall you can actually climb up barefoot with local guides.",
    whyVisit: "A unique climbing experience over flowing tiers — fun, safe, and incredibly photogenic.",
    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80",
    rating: 4.7
  },
  {
    id: "inambakan-falls",
    name: "Inambakan Falls",
    category: "falls",
    badge: "Waterfall",
    location: "Ginatilan, Cebu",
    mapsUrl: "https://maps.app.goo.gl/2NWFgfvv5pjeyDG19",
    description: "A serene, jade-blue plunge pool tucked away in southern Cebu's quiet forest.",
    whyVisit: "Quieter than Kawasan, perfect for a peaceful swim in cool clear water.",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
    rating: 4.6
  },
  {
    id: "mantayupan-falls",
    name: "Mantayupan Falls",
    category: "falls",
    badge: "Waterfall",
    location: "Barili, Cebu",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mantayupan+Falls+Barili+Cebu",
    description: "One of Cebu's tallest falls, plunging nearly 100 meters into a refreshing pool.",
    whyVisit: "Towering height, easy access, and a great picnic spot for families.",
    imageUrl: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?w=800&q=80",
    rating: 4.5
  },
  {
    id: "binalayan-falls",
    name: "Binalayan Hidden Falls",
    category: "falls",
    badge: "Waterfall",
    location: "Samboan, Cebu",
    mapsUrl: "https://maps.app.goo.gl/UYCgYTJQz1ELFx3N7",
    description: "A three-tier \"Hidden Falls\" with mossy cliffs and a deep emerald basin.",
    whyVisit: "Cliff jumping, secluded vibes, and lush tropical scenery.",
    imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80",
    rating: 4.6
  },
  {
    id: "cambais-falls",
    name: "Cambais Falls",
    category: "falls",
    badge: "Waterfall",
    location: "Alegria, Cebu, Philippines",
    mapsUrl: "https://maps.app.goo.gl/xbeXNHUPFxUWXWrx9",
    description: "A pristine three-tier waterfall framed by lush jungle, less crowded than its neighbors.",
    whyVisit: "Untouched beauty and a refreshing dip away from the tourist crowds.",
    imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80",
    rating: 4.7
  },
  {
    id: "dao-falls",
    name: "Dao Falls",
    category: "falls",
    badge: "Waterfall",
    location: "Samboan, Cebu, Philippines",
    mapsUrl: "https://maps.app.goo.gl/EbQcM9YKVTkbT5tw8",
    description: "A tall, single-drop curtain falls hidden in the southern hinterlands.",
    whyVisit: "Dramatic drop and an off-the-beaten-path trek for adventure seekers.",
    imageUrl: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?w=800&q=80",
    rating: 4.8
  },
  {
    id: "tumalog-falls",
    name: "Tumalog Falls",
    category: "falls",
    badge: "Waterfall",
    location: "Oslob, Cebu, Philippines",
    mapsUrl: "https://maps.app.goo.gl/RZW5Q3cAs1KPjXZF6",
    description: "A delicate curtain of water descending like a misty veil over mossy rock.",
    whyVisit: "Pair it with Oslob's whale shark watching for an unforgettable day trip.",
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80",
    rating: 4.7
  },
  {
    id: "kabutongan-falls",
    name: "Kabutongan Falls",
    category: "falls",
    badge: "Waterfall",
    location: "Ginatilan, Cebu, Philippines",
    mapsUrl: "https://maps.app.goo.gl/x5iW1UAFTNXhQp3w6",
    description: "A quiet jungle waterfall with cool turquoise water and few visitors.",
    whyVisit: "Peaceful, hidden, and perfect for travelers chasing solitude.",
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80",
    rating: 4.4
  },
  {
    id: "montaneza-falls",
    name: "Montaneza Falls",
    category: "falls",
    badge: "Waterfall",
    location: "Malabuyoc, Cebu, Philippines",
    mapsUrl: "https://maps.app.goo.gl/m16GQZrWV16XiqTD7",
    description: "A wide, gentle waterfall feeding into a deep pool ideal for swimming.",
    whyVisit: "Easy trek, family friendly, and one of the cleanest pools in Cebu.",
    imageUrl: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=800&q=80",
    rating: 4.3
  },
  {
    id: "kabang-falls",
    name: "Kabang Falls",
    category: "falls",
    badge: "Waterfall",
    location: "Budlaan, Cebu, Philippines",
    mapsUrl: "https://maps.app.goo.gl/pyRameXqzkpsW3j28",
    description: "A surprising waterfall escape just a short drive from the urban heart of Cebu.",
    whyVisit: "Closest authentic waterfall experience for travelers based in the city.",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    rating: 4.2
  },

  // ISLANDS
  {
    id: "mactan-island",
    name: "Mactan Island",
    category: "islands",
    badge: "Island",
    location: "Mactan Island, Cebu, Philippines",
    mapsUrl: "https://maps.app.goo.gl/XbqFtcAog5pTg3UE9",
    description: "Cebu's gateway island — home to resorts, dive sites, and historical landmarks.",
    whyVisit: "Easy beach access, world-class diving, and the historic Lapu-Lapu shrine.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    rating: 4.5
  },
  {
    id: "bantayan-island",
    name: "Bantayan Island",
    category: "islands",
    badge: "Island",
    location: "Northern Cebu",
    mapsUrl: "https://maps.app.goo.gl/XtapnGVDMM6dpew89",
    description: "Powder-white sand, swaying palms, and a laid-back island lifestyle.",
    whyVisit: "The Maldives feel of Cebu — endless white beaches and crystal water.",
    imageUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
    rating: 4.8
  },
  {
    id: "malapascua-island",
    name: "Malapascua Island",
    category: "islands",
    badge: "Island",
    location: "Daanbantayan, Cebu",
    mapsUrl: "https://maps.app.goo.gl/wkVs6PuFp7pAWYtD8",
    description: "A world-famous dive paradise known for daily thresher shark sightings.",
    whyVisit: "One of the only places on Earth to reliably dive with thresher sharks.",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    rating: 4.9
  },
  {
    id: "tulang-diot-island",
    name: "Tulang Diot Island",
    category: "islands",
    badge: "Island",
    location: "San Francisco, Cebu",
    mapsUrl: "https://maps.app.goo.gl/ioWSjx9Tj6BKCyV19",
    description: "A peaceful cluster of islands known as the \"Lost Horizon of the South\".",
    whyVisit: "Caves, lakes, lagoons, and dreamy quiet beaches all in one.",
    imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
    rating: 4.7
  },
  {
    id: "olango-island",
    name: "Olango Island",
    category: "islands",
    badge: "Island",
    location: "Lapu-Lapu City, Cebu",
    mapsUrl: "https://maps.app.goo.gl/mHDpVMtxU9MGTcL18",
    description: "A protected wildlife sanctuary teeming with migratory birds and reefs.",
    whyVisit: "Birdwatching, snorkeling, and authentic island village vibes.",
    imageUrl: "https://images.unsplash.com/photo-1415125721330-f6df99768bf7?w=800&q=80",
    rating: 4.4
  },
  {
    id: "sumilon-island",
    name: "Sumilon Island",
    category: "islands",
    badge: "Island",
    location: "Oslob, Cebu",
    mapsUrl: "https://maps.app.goo.gl/FPJtbHSnZdSYoVbZA",
    description: "A small private island famed for its shifting white sandbar.",
    whyVisit: "Picture-perfect sandbar, marine sanctuary, and luxury beach club access.",
    imageUrl: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
    rating: 4.8
  },
  {
    id: "gilutongan-island",
    name: "Gilutongan Island",
    category: "islands",
    badge: "Island",
    location: "Cordova, Cebu",
    mapsUrl: "https://maps.app.goo.gl/PjkgiobEeoUW3uAH9",
    description: "A marine sanctuary with vibrant coral and abundant tropical fish.",
    whyVisit: "Snorkeling heaven — coral gardens visible right from the surface.",
    imageUrl: "https://images.unsplash.com/photo-1544551763-bf30c4f82a5c?w=800&q=80",
    rating: 4.5
  },
  {
    id: "caohagan-island",
    name: "Caohagan Island",
    category: "islands",
    badge: "Island",
    location: "Lapu-Lapu City, Cebu",
    mapsUrl: "https://maps.app.goo.gl/MCYLe1VkC5cpbGyt5",
    description: "A tiny community island known for fresh seafood lunches by the shore.",
    whyVisit: "Authentic island cooking and a relaxed sandbar setting.",
    imageUrl: "https://images.unsplash.com/photo-1520116468816-95b69e847357?w=800&q=80",
    rating: 4.6
  },
  {
    id: "pandanon-island",
    name: "Pandanon Island",
    category: "islands",
    badge: "Island",
    location: "Getafe (visited via Cebu)",
    mapsUrl: "https://maps.app.goo.gl/At77Z8o6BSaEzYAk8",
    description: "A long stretch of soft sand often called the \"Boracay of Cebu\".",
    whyVisit: "Beautiful sandbar, perfect for island-hopping day tours.",
    imageUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    rating: 4.7
  },
  {
    id: "pescador-island",
    name: "Pescador Island",
    category: "islands",
    badge: "Island",
    location: "Moalboal, Cebu",
    mapsUrl: "https://maps.app.goo.gl/taHFhe7Yt2YCoBjh9",
    description: "A tiny limestone islet surrounded by coral walls and the famous sardine run.",
    whyVisit: "Swim through millions of sardines — one of the world's top dive sites.",
    imageUrl: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&q=80",
    rating: 4.9
  },
  {
    id: "capitancillo-island",
    name: "Capitancillo Island",
    category: "islands",
    badge: "Island",
    location: "Bogo City, Cebu",
    mapsUrl: "https://maps.app.goo.gl/459PXoKjLkxw9UFf7",
    description: "A small islet with a historic lighthouse and incredible dive walls.",
    whyVisit: "Untouched diving spot and serene off-grid experience.",
    imageUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80",
    rating: 4.5
  },
  {
    id: "carnaza-island",
    name: "Carnaza Island",
    category: "islands",
    badge: "Island",
    location: "Daanbantayan, Cebu",
    mapsUrl: "https://maps.app.goo.gl/bUq2AMgUMbzoFgwB6",
    description: "Rugged cliffs, a black-sand cove, and a long pristine white-sand beach.",
    whyVisit: "Dramatic landscapes and one of Cebu's most underrated escapes.",
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
    rating: 4.8
  },
  {
    id: "gibitngil-island",
    name: "Gibitngil Island",
    category: "islands",
    badge: "Island",
    location: "Medellin, Cebu",
    mapsUrl: "https://maps.app.goo.gl/e2kBHrqF4cTcWTrg8",
    description: "Nicknamed \"Funtastic Island\" for cliff jumping, kayaking, and snorkeling.",
    whyVisit: "Adventure-packed day trip with caves and rock formations to explore.",
    imageUrl: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800&q=80",
    rating: 4.6
  },

  // BEACHES
  {
    id: "tingko-beach",
    name: "Tingko Beach",
    category: "beaches",
    badge: "Beach",
    location: "Alcoy, Cebu",
    mapsUrl: "https://maps.app.goo.gl/3SuY3zTtYJr5ZVXE7",
    description: "Long, soft, cream-colored sand and shallow turquoise water perfect for swimming.",
    whyVisit: "One of the longest white-sand beaches in southern Cebu — pure paradise.",
    imageUrl: "https://images.unsplash.com/photo-1540206395-68808572332f?w=800&q=80",
    rating: 4.6
  },
  {
    id: "san-remigio-beach",
    name: "San Remigio Beaches",
    category: "beaches",
    badge: "Beach",
    location: "San Remigio, Cebu",
    mapsUrl: "https://maps.app.goo.gl/GVLHWUreDrr3BajN9",
    description: "Tranquil northern beaches with calm waters and stunning sunsets.",
    whyVisit: "Peaceful resorts, sunset spots, and minimal crowds.",
    imageUrl: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
    rating: 4.4
  },
  {
    id: "basdaku-beach",
    name: "Basdaku White Beach",
    category: "beaches",
    badge: "Beach",
    location: "Moalboal, Cebu",
    mapsUrl: "https://maps.app.goo.gl/7PWcjh6uRM3M1ged7",
    description: "A long stretch of powder-white sand and a vibrant backpacker scene.",
    whyVisit: "Best base for the sardine run and turtle snorkeling at Panagsama.",
    imageUrl: "https://images.unsplash.com/photo-1520942702018-0862200e6873?w=800&q=80",
    rating: 4.7
  },
  {
    id: "hidden-beach",
    name: "Hidden Beach",
    category: "beaches",
    badge: "Beach",
    location: "Aloguinsan, Cebu",
    mapsUrl: "https://maps.app.goo.gl/zkJqjuXNReKEiirLA",
    description: "A secluded cove framed by limestone cliffs and clear shallow water.",
    whyVisit: "Off-the-radar escape paired with the scenic Bojo River cruise.",
    imageUrl: "https://images.unsplash.com/photo-1484821547834-40a049033446?w=800&q=80",
    rating: 4.5
  },
  {
    id: "santa-fe-beach",
    name: "Santa Fe Beaches",
    category: "beaches",
    badge: "Beach",
    location: "Bantayan Island, Cebu",
    mapsUrl: "https://maps.app.goo.gl/wvA69hdyhJtzijCn7",
    description: "The main beach strip of Bantayan — fine white sand and warm shallow water.",
    whyVisit: "Beachfront resorts, dining, and stunning sunrise views.",
    imageUrl: "https://images.unsplash.com/photo-1506953822126-027150926524?w=800&q=80",
    rating: 4.8
  },
  {
    id: "panagsama-beach",
    name: "Panagsama Beach",
    category: "beaches",
    badge: "Beach",
    location: "Moalboal, Cebu",
    mapsUrl: "https://maps.app.goo.gl/SjMr8mymhJnZKVDYA",
    description: "Cebu's dive hub with shore access to the legendary sardine run.",
    whyVisit: "Snorkel with millions of sardines just steps from the shore.",
    imageUrl: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&q=80",
    rating: 4.6
  },
  {
    id: "lambug-beach",
    name: "Lambug Beach",
    category: "beaches",
    badge: "Beach",
    location: "Badian, Cebu",
    mapsUrl: "https://maps.app.goo.gl/sMgQgM6C6eWK7ArLA",
    description: "A long, quiet stretch of white sand with calm shallow water.",
    whyVisit: "Family-friendly, uncrowded, and perfect for sunset strolls.",
    imageUrl: "https://images.unsplash.com/photo-1533760881669-e0dbbd9fa180?w=800&q=80",
    rating: 4.7
  },
  {
    id: "lambug-extension",
    name: "Lambug White Sand Extensions",
    category: "beaches",
    badge: "Beach",
    location: "Badian, Cebu",
    mapsUrl: "https://maps.app.goo.gl/vCt8VEjE25odCRZN6",
    description: "The lesser-known coves adjacent to Lambug — total seclusion.",
    whyVisit: "Find your own private slice of white-sand beach.",
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
    rating: 4.5
  },

  // MOUNTAINS / HIKES
  {
    id: "osmena-peak",
    name: "Osmeña Peak",
    category: "mountains",
    badge: "Hike",
    location: "Mantalongon, Dalaguete, Cebu",
    mapsUrl: "https://maps.app.goo.gl/LwRzrEn1NncHJJKcA",
    description: "The highest point in Cebu — a beginner-friendly hike with jagged hilltop views.",
    whyVisit: "Sunrise above the clouds and 360° views of mountains and sea.",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    rating: 4.9
  },
  {
    id: "casino-peak",
    name: "Casino Peak (Lugsangan Peak)",
    category: "mountains",
    badge: "Hike",
    location: "Dalaguete, Cebu",
    mapsUrl: "https://maps.app.goo.gl/rBdCxcY52ntaEV7z8",
    description: "A neighboring peak to Osmeña with equally dramatic, rugged views.",
    whyVisit: "Less crowded alternative to Osmeña Peak with unique rock formations.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
    rating: 4.8
  },
  {
    id: "mt-naupa",
    name: "Mt. Naupa",
    category: "mountains",
    badge: "Hike",
    location: "Naga, Cebu",
    mapsUrl: "https://maps.app.goo.gl/phEa1HD8qTu3MyAYA",
    description: "A short, accessible climb popular for camping and sea-of-clouds sunrises.",
    whyVisit: "Easy overnight hike, perfect for first-time mountaineers.",
    imageUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
    rating: 4.6
  },
  {
    id: "mt-manunggal",
    name: "Mt. Manunggal",
    category: "mountains",
    badge: "Hike",
    location: "Balamban, Cebu",
    mapsUrl: "https://maps.app.goo.gl/urXzPCSKK6TFymQRA",
    description: "A pine-forested mountain marking the historic site of President Magsaysay's plane crash.",
    whyVisit: "Cool climate, pine trees, and an iconic camping destination.",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    rating: 4.7
  },
  {
    id: "kandungaw-peak",
    name: "Kandungaw Peak",
    category: "mountains",
    badge: "Hike",
    location: "Badian, Cebu",
    mapsUrl: "https://maps.app.goo.gl/q5g4Y8vA7noJLfUB9",
    description: "A dramatic knife-edge peak famed for its photogenic ridge.",
    whyVisit: "Thrilling ridge walk and one of the most photographed peaks in Cebu.",
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    rating: 4.7
  },
  {
    id: "mt-kang-irag",
    name: "Mt. Kang-irag",
    category: "mountains",
    badge: "Hike",
    location: "Sirao, Cebu City, Cebu",
    mapsUrl: "https://maps.app.goo.gl/3cqXA7QUndoEtAgx7",
    description: "A challenging mountain hike just behind the city, with sweeping views.",
    whyVisit: "A rugged adventure within reach of Cebu City — great for weekend climbs.",
    imageUrl: "https://images.unsplash.com/photo-1472214222541-d510753a4707?w=800&q=80",
    rating: 4.5
  },

  // HERITAGE / ATTRACTIONS
  {
    id: "magellans-cross",
    name: "Magellan's Cross",
    category: "attract",
    badge: "Heritage",
    location: "Plaza Sugbu, Cebu City",
    mapsUrl: "https://maps.app.goo.gl/iY48R2i8LGgY6i5f6",
    description: "A historic cross planted by Magellan in 1521, symbolizing Christianity in the Philippines.",
    whyVisit: "Walk through 500 years of Filipino history in a single spot.",
    imageUrl: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800&q=80",
    rating: 4.8
  },
  {
    id: "basilica-santo-nino",
    name: "Basilica Minore del Santo Niño",
    category: "attract",
    badge: "Church",
    location: "Osmeña Blvd., Cebu City",
    mapsUrl: "https://maps.app.goo.gl/x2PLaVs4X4MaaLoR6",
    description: "The oldest Roman Catholic church in the Philippines, home of the Santo Niño.",
    whyVisit: "Spiritual heart of Cebu — especially during the Sinulog Festival.",
    imageUrl: "https://images.unsplash.com/photo-1548625361-155deee223d0?w=800&q=80",
    rating: 4.9
  },
  {
    id: "fort-san-pedro",
    name: "Fort San Pedro",
    category: "attract",
    badge: "Heritage",
    location: "Plaza Independencia, Cebu City",
    mapsUrl: "https://maps.app.goo.gl/bCDsE1jtACiNr6e39",
    description: "The smallest and oldest tri-bastion fort in the Philippines.",
    whyVisit: "Lush courtyard, museum exhibits, and Spanish-era architecture.",
    imageUrl: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80",
    rating: 4.5
  },
  {
    id: "temple-of-leah",
    name: "Temple of Leah",
    category: "attract",
    badge: "Landmark",
    location: "Busay, Cebu City, Cebu",
    mapsUrl: "https://maps.app.goo.gl/EveMiNSQF17tFWUd7",
    description: "A Roman-inspired temple built as a symbol of undying love.",
    whyVisit: "Grand architecture and breathtaking views of Cebu City.",
    imageUrl: "https://images.unsplash.com/photo-1503177119275-0aa32b31d468?w=800&q=80",
    rating: 4.7
  },
  {
    id: "sirao-garden",
    name: "Sirao Garden",
    category: "attract",
    badge: "Garden",
    location: "Sirao, Cebu City, Cebu",
    mapsUrl: "https://maps.app.goo.gl/6E9SgDGZWQ6FUsuM8",
    description: "A vibrant flower farm known as the \"Little Amsterdam of Cebu\".",
    whyVisit: "Endless rows of celosia blooms make this an Instagram favorite.",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    rating: 4.6
  },
  {
    id: "taoist-temple",
    name: "Taoist Temple",
    category: "attract",
    badge: "Temple",
    location: "Beverly Hills, Cebu City",
    mapsUrl: "https://maps.app.goo.gl/MV7KXGGW96nA7UWEA",
    description: "An ornate Chinese-style temple perched on the hills of Beverly Hills subdivision.",
    whyVisit: "Beautiful architecture, panoramic views, and cultural insight.",
    imageUrl: "https://images.unsplash.com/photo-1547989453-11e67ffb3885?w=800&q=80",
    rating: 4.6
  },
  {
    id: "ten-thousand-roses",
    name: "10,000 Roses Café",
    category: "attract",
    badge: "Landmark",
    location: "Cordova, Cebu",
    mapsUrl: "https://maps.app.goo.gl/3Fso71Xxfdd12FqV7",
    description: "A magical LED-lit rose garden by the sea — best visited at dusk.",
    whyVisit: "Stunning sunset photos surrounded by glowing white roses.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    rating: 4.3
  },
  {
    id: "cebu-ocean-park",
    name: "Cebu Ocean Park",
    category: "attract",
    badge: "Family",
    location: "SRP, Cebu City",
    mapsUrl: "https://maps.app.goo.gl/ns4itKvLYM6M92RE6",
    description: "The largest oceanarium in the country with immersive marine exhibits.",
    whyVisit: "Walk through a stunning tunnel surrounded by sharks and rays.",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    rating: 4.7
  },
  {
    id: "heritage-monument",
    name: "Heritage of Cebu Monument",
    category: "attract",
    badge: "Heritage",
    location: "Sikatuna St., Cebu City",
    mapsUrl: "https://maps.app.goo.gl/iJX9vdUgUk5zLasNA",
    description: "A sculptural showcase of pivotal moments in Cebuano history.",
    whyVisit: "Stunning bronze and marble tableau — a must-see for culture lovers.",
    imageUrl: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80",
    rating: 4.6
  }
];
