export interface CityPulse {
    trainStatus: string;
    traffic: string;
    mood: string;
}

export interface Attraction {
    name: string;
    type: string;
    description: string;
}

export interface DiningInfo {
    name: string;
    cuisine: string;
    vibe: string;
    type?: string;
}

export interface HotelInfo {
    name: string;
    priceRange: string;
    rating: string;
}

export interface LivingData {
    connectivity: string;
    rent: string;
    vibeScore: string;
}

export interface RichData {
    livingData: LivingData;
    attractions: Attraction[];
    dining: DiningInfo[];
    hotels: HotelInfo[];
}

export interface SubArea extends RichData {
    name: string;
    slug: string;
    vibe: string;
    image: string;
    description: string;
    coordinates: [number, number];
    poeticLine: string;
    tagline: string;
    pulse: CityPulse;
}

export interface RegionData extends RichData {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    coordinates: [number, number];
    heroImage: string;
    weather: { temp: number; condition: string; aqi: number };
    subAreas: SubArea[];
    pulse: CityPulse;
    poeticLine: string;
}

export const CITY_REGIONS: Record<string, RegionData> = {
    "south-mumbai": {
        name: "South Mumbai",
        slug: "south-mumbai",
        tagline: "Old Bombay, timeless and golden.",
        description: "South Mumbai is the historic soul of the city, a place where the grandeur of British colonial architecture stands tall against the Arabian Sea. From the iconic Gateway of India to the art deco buildings of Marine Drive, every corner whispers stories of a glorious past. It is the financial center, housing the Bombay Stock Exchange and the Reserve Bank of India, yet it retains a laid-back charm with its wide avenues, ancient banyan trees, and cultural institutions like the Jehangir Art Gallery and the CSMT museum.",
        coordinates: [18.9388, 72.8256],
        heroImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2670&auto=format&fit=crop",
        weather: { temp: 29, condition: "Clear Sky", aqi: 45 },
        pulse: { trainStatus: "On Time", traffic: "Moderate", mood: "Nostalgic" },
        poeticLine: "Time stands still between the stones and the sea.",
        livingData: {
            connectivity: "Excellent (Trains, Best Buses, Cabs)",
            rent: "₹80k - 5L+ per month",
            vibeScore: "9.5/10 (Heritage Luxury)"
        },
        attractions: [
            { name: "Gateway of India", type: "Monument", description: "Iconic arch built in 1911 overlooking the Arabian Sea." },
            { name: "Marine Drive", type: "Promenade", description: "3.6km C-shaped boulevard famous for sunset views and Art Deco architecture." },
            { name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya", type: "Museum", description: "Premier art and history museum." }
        ],
        dining: [
            { name: "The Bombay Canteen", type: "Dining", cuisine: "Modern Indian", vibe: "Chic, lively, sophisticated." },
            { name: "Trishna", type: "Dining", cuisine: "Seafood (Mangalorean)", vibe: "Classic, bustling, legendary." }
        ],
        hotels: [
            { name: "The Taj Mahal Palace", priceRange: "₹55,000+", rating: "4.7/5" },
            { name: "The Oberoi, Mumbai", priceRange: "₹17,000+", rating: "9.8/10" }
        ],
        subAreas: [
            {
                name: "Colaba",
                slug: "colaba",
                vibe: "Art, cafes, and history.",
                tagline: "Where the world meets Bombay.",
                description: "Colaba is the vibrant tourist hub of Mumbai, serving as the city's welcoming face to the world with the majestic Gateway of India and the historic Taj Mahal Palace hotel. Its streets are lined with bustling markets like Colaba Causeway, where one can find everything from antique clocks to trendy jewelry. The area is also famous for its deeply rooted café culture.",
                image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=2535&auto=format&fit=crop",
                coordinates: [18.9067, 72.8147],
                poeticLine: "Stories whispered in every archway.",
                pulse: { trainStatus: "N/A", traffic: "Busy", mood: "Touristy" },
                livingData: {
                    connectivity: "Good (Buses & Cabs)",
                    rent: "₹70k - 3L+",
                    vibeScore: "9.0/10 (Bohemian)"
                },
                attractions: [
                    { name: "Colaba Causeway", type: "Shopping", description: "Bustling street market for clothes, antiques, and jewelry." },
                    { name: "Jehangir Art Gallery", type: "Art Gallery", description: "Famed venue for Indian contemporary art." }
                ],
                dining: [
                    { name: "Cafe Mondegar", cuisine: "Indian/Continental", vibe: "Retro, lively, iconic jukebox." },
                    { name: "Leopold Cafe", cuisine: "Multicuisine", vibe: "Historic, tourist-friendly, bustling." }
                ],
                hotels: [
                    { name: "Taj Mahal Tower", priceRange: "₹25,000+", rating: "4.7/5" },
                    { name: "Fariyas Hotel", priceRange: "₹8,000+", rating: "4.0/5" }
                ]
            },
            {
                name: "Marine Drive",
                slug: "marine-drive",
                vibe: "The Queen's Necklace.",
                tagline: "The city's breathing space.",
                description: "Marine Drive is a 3.6-kilometre-long boulevard along the coast, affectionately known as the Queen's Necklace because of the way its streetlights resemble a string of pearls at night. This C-shaped road links Nariman Point to Babulnath and Malabar Hill. It is the city's favorite promenade.",
                image: "https://images.unsplash.com/photo-1596527588820-e22a87472091?q=80&w=2574&auto=format&fit=crop",
                coordinates: [18.944, 72.823],
                poeticLine: "Where the sky kisses the sea.",
                pulse: { trainStatus: "N/A", traffic: "Moving", mood: "Breezy" },
                livingData: {
                    connectivity: "Excellent (Marine Lines Station nearby)",
                    rent: "₹1.5L - 8L+",
                    vibeScore: "10/10 (Iconic Sea Views)"
                },
                attractions: [
                    { name: "Girgaum Chowpatty", type: "Beach", description: "Famous for evening strolls and local street food." },
                    { name: "NCPA", type: "Performing Arts", description: "National Centre for the Performing Arts at Nariman Point." }
                ],
                dining: [
                    { name: "Pizza By The Bay", cuisine: "Italian", vibe: "Breezy, scenic, classic." },
                    { name: "Dome (InterContinental)", cuisine: "Sushi/Cocktails", vibe: "Rooftop, luxurious sunset views." }
                ],
                hotels: [
                    { name: "Trident, Nariman Point", priceRange: "₹17,500+", rating: "9.2/10" },
                    { name: "Hotel Marine Plaza", priceRange: "₹12,000+", rating: "4.2/5" }
                ]
            },
            {
                name: "Fort",
                slug: "fort",
                vibe: "Business and heritage.",
                tagline: "Gothic stones and busy phones.",
                description: "The Fort area is the city's financial heartbeat, named after the old British fort of Bombay that once stood here. It is a stunning showcase of Victorian Gothic and Art Deco architecture. By day it is a swarm of office-goers, by night its heritage buildings are illuminated.",
                image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=2576&auto=format&fit=crop",
                coordinates: [18.9322, 72.8350],
                poeticLine: "Echoes of the Raj in every stone.",
                pulse: { trainStatus: "Full", traffic: "Jam", mood: "Rushed" },
                livingData: {
                    connectivity: "Ultimate (CSMT Hub)",
                    rent: "₹90k - 4L (Mostly Commercial)",
                    vibeScore: "8.5/10 (Historic Grit)"
                },
                attractions: [
                    { name: "CSMT Station", type: "Architecture/Transport", description: "UNESCO World Heritage Victorian Gothic railway terminus." },
                    { name: "Asiatic Society", type: "Library/Monument", description: "Iconic white steps and neoclassical architecture." }
                ],
                dining: [
                    { name: "Britannia & Co.", cuisine: "Parsi / Iranian", vibe: "Nostalgic, historic, famed Berry Pulao." },
                    { name: "Kala Ghoda Cafe", cuisine: "Cafe/Bakery", vibe: "Cozy, artistic, rustic interior." }
                ],
                hotels: [
                    { name: "President, Mumbai - IHCL", priceRange: "₹11,000+", rating: "4.4/5" },
                    { name: "Residency Hotel Fort", priceRange: "₹5,000+", rating: "4.3/5" }
                ]
            }
        ]
    },
    // Adding Western Suburbs Data Here...
    "western-suburbs": {
        name: "Western Suburbs",
        slug: "western-suburbs",
        tagline: "Fast, crowded, alive.",
        description: "The Western Suburbs represent the modern, fast-paced, and aspirational face of Mumbai, stretching from Bandra to Dahisar. This region is the entertainment capital, home to Bollywood studios, television production houses, and the residences of India's biggest stars. It is a melting pot of cultures and lifestyles, offering everything from the glitzy nightlife of Bandra and Andheri to the peaceful beaches of Juhu.",
        coordinates: [19.0596, 72.8295],
        heroImage: "https://images.unsplash.com/photo-1625927357422-96420f5be8f5?q=80&w=2636&auto=format&fit=crop",
        weather: { temp: 31, condition: "Humid", aqi: 65 },
        pulse: { trainStatus: "Delayed 5m", traffic: "Heavy", mood: "Electric" },
        poeticLine: "Lights never fade, and neither do the dreams.",
        livingData: {
            connectivity: "Excellent (Western Railway, Metro Lines)",
            rent: "₹50k - 3L+",
            vibeScore: "9.2/10 (Trendy & Fast-Paced)"
        },
        attractions: [
            { name: "Juhu Beach", type: "Beach", description: "Vibrant beach famous for evening walks and street food stalls." },
            { name: "Bandra Bandstand", type: "Promenade", description: "Seaside promenade with views of the sea link and celebrity homes." },
            { name: "Dadar Flower Market", type: "Market", description: "Sensory overload of fresh flowers starting at 4 AM." }
        ],
        dining: [
            { name: "Candies", cuisine: "Cafe/Bakery", vibe: "Old-school Bandra institution, multi-level bohemian." },
            { name: "Bastian", cuisine: "Seafood/Asian", vibe: "Glamorous, celebrity-favorite, trendy." }
        ],
        hotels: [
            { name: "JW Marriott Mumbai Juhu", priceRange: "₹22,000+", rating: "9.0/10" },
            { name: "Taj Lands End", priceRange: "₹25,000+", rating: "9.0/10" }
        ],
        subAreas: [
            {
                name: "Bandra",
                slug: "bandra",
                vibe: "The Queen of Suburbs.",
                tagline: "Trendsetter of the city.",
                description: "Bandra is arguably the most fashionable and happening suburb of Mumbai. It is a unique blend of heritage and modernity, where old Portuguese-style villas and historic churches like Mount Mary coexist with swanky high-rises and trendy cafes.",
                image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2574&auto=format&fit=crop",
                coordinates: [19.0596, 72.8295],
                poeticLine: "Glamour in the air, salt in the breeze.",
                pulse: { trainStatus: "Crowded", traffic: "Chock-a-block", mood: "Trendy" },
                livingData: {
                    connectivity: "Good (Trains, Auto Rickshaws)",
                    rent: "₹80k - 2.5L+",
                    vibeScore: "9.5/10 (Hipster / Expat Hub)"
                },
                attractions: [
                    { name: "Mount Mary Basilica", type: "Church", description: "16th-century Roman Catholic church on a hill overlooking the sea." },
                    { name: "Linking Road", type: "Shopping", description: "Famous street shopping district for fashion and accessories." }
                ],
                dining: [
                    { name: "Boojee Cafe", cuisine: "Gourmet Cafe", vibe: "Viral, aesthetic, elegant, and trendy on Carter Road." },
                    { name: "Grounded Cafe", cuisine: "Coffee/Brunch", vibe: "Earthy, boho sea-views at Bandstand." }
                ],
                hotels: [
                    { name: "Taj Lands End", priceRange: "₹25,000+", rating: "9.0/10" },
                    { name: "Trident Bandra Kurla (BKC)", priceRange: "₹18,000+", rating: "9.2/10" }
                ]
            },
            {
                name: "Juhu",
                slug: "juhu",
                vibe: "Sun, sand, and stars.",
                tagline: "Luxury by the beach.",
                description: "Juhu is famous for its sprawling beach, which is one of the most popular spots in the city to catch a sunset or enjoy local street food. It is an affluent neighborhood known for its upscale hotels, theaters, and bungalows of the wealthy.",
                image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=2574&auto=format&fit=crop",
                coordinates: [19.1075, 72.8263],
                poeticLine: "Golden sands and silver screens.",
                pulse: { trainStatus: "N/A", traffic: "Slow", mood: "Relaxed" },
                livingData: {
                    connectivity: "Moderate (Heavy local traffic)",
                    rent: "₹1L - 4L+",
                    vibeScore: "9.0/10 (Upscale Beachfront)"
                },
                attractions: [
                    { name: "Prithvi Theatre", type: "Arts", description: "Legendary intimate theatre venue for plays and cultural events." },
                    { name: "ISKCON Juhu", type: "Temple", description: "Beautiful marble temple complex serving vegetarian cuisine." }
                ],
                dining: [
                    { name: "Prithvi Cafe", cuisine: "Indian Snacks/Cafe", vibe: "Nostalgic, artsy, famous Irish Coffee." },
                    { name: "Tanatan Juhu", cuisine: "Modern Indian", vibe: "Luxurious, royal twist, live soulful music." }
                ],
                hotels: [
                    { name: "JW Marriott Mumbai Juhu", priceRange: "₹22,000+", rating: "9.0/10" },
                    { name: "Novotel Mumbai Juhu Beach", priceRange: "₹15,000+", rating: "8.5/10" }
                ]
            },
            {
                name: "Andheri",
                slug: "andheri",
                vibe: "The sleepless engine.",
                tagline: "The heart that never stops.",
                description: "Andheri is the commercial and residential powerhouse of the suburbs, split into West and East. It is the hub of the media and entertainment industry, with numerous production houses and casting studios.",
                image: "https://images.unsplash.com/photo-1519922660262-4856973970b1?q=80&w=2574&auto=format&fit=crop",
                coordinates: [19.1136, 72.8697],
                poeticLine: "A symphony of horns and hopes.",
                pulse: { trainStatus: "Packed", traffic: "Gridlock", mood: "Manic" },
                livingData: {
                    connectivity: "Excellent (Metro, Trains, Airport)",
                    rent: "₹45k - 1.5L",
                    vibeScore: "8.0/10 (Bustling & Commercial)"
                },
                attractions: [
                    { name: "Mahakali Caves", type: "Heritage", description: "Ancient rock-cut Buddhist caves hidden in the city." },
                    { name: "Lokhandwala Market", type: "Shopping", description: "Bustling street with boutiques and eateries." }
                ],
                dining: [
                    { name: "Pratap Da Dhaba", cuisine: "North Indian / Dhaba", vibe: "Rustic, no-frills, authentic Punjabi experience." },
                    { name: "1BHK - Brew House Kitchen", cuisine: "Continental", vibe: "Goan vibe, live music, relaxed setup." }
                ],
                hotels: [
                    { name: "JW Marriott Mumbai Sahar", priceRange: "₹18,000+", rating: "9.2/10" },
                    { name: "ITC Maratha, Luxury Collection", priceRange: "₹15,000+", rating: "9.5/10" }
                ]
            }
        ]
    },
    // Adding Navi Mumbai...
    "navi-mumbai": {
        name: "Navi Mumbai",
        slug: "navi-mumbai",
        tagline: "Planned, peaceful, future.",
        description: "Navi Mumbai was developed in 1972 as a twin city to decongest Mumbai, and it has since grown into a model of urban planning. Unlike the island city, it features wide, tree-lined roads, organized sectors, and numerous parks and lakes. It offers a cleaner, quieter, and more spacious quality of life while still remaining connected to the main city.",
        coordinates: [19.0330, 73.0297],
        heroImage: "https://images.unsplash.com/photo-1622304854556-9ceee5c56782?q=80&w=2670&auto=format&fit=crop",
        weather: { temp: 30, condition: "Breezy", aqi: 40 },
        pulse: { trainStatus: "On Time", traffic: "Smooth", mood: "Calm" },
        poeticLine: "Space to breathe, room to grow.",
        livingData: {
            connectivity: "Good (Harbour Line, Highways)",
            rent: "₹25k - 80k",
            vibeScore: "8.5/10 (Planned Suburban)"
        },
        attractions: [
            { name: "Palm Beach Road", type: "Drive/Scenic", description: "10-km scenic route known as the Marine Drive of Navi Mumbai." },
            { name: "Central Park, Kharghar", type: "Park", description: "One of Asia's largest parks with open spaces and recreation." },
            { name: "DY Patil Stadium", type: "Stadium", description: "World-class sports and concert venue." }
        ],
        dining: [
            { name: "Barbeque Nation", cuisine: "BBQ/Grills", vibe: "Bustling, family-friendly, all-you-can-eat." },
            { name: "Hitchki (Belapur)", cuisine: "Modern Indian", vibe: "Bollywood-themed, loud, instaworthy." }
        ],
        hotels: [
            { name: "Four Points by Sheraton Vashi", priceRange: "₹18,000+", rating: "8.8/10" },
            { name: "The Park Navi Mumbai", priceRange: "₹16,000+", rating: "8.5/10" }
        ],
        subAreas: [
            {
                name: "Vashi",
                slug: "vashi",
                vibe: "The gateway.",
                tagline: "First step to the future.",
                description: "Vashi is the first node of Navi Mumbai and acts as the gateway from Mumbai. It is a highly developed residential and commercial node, divided into sectors with a clear grid plan. It strikes a perfect balance between the hustle of commerce and the peace of suburban living.",
                image: "https://images.unsplash.com/photo-1562919934-2e62058e02d8?q=80&w=2670&auto=format&fit=crop",
                coordinates: [19.0770, 72.9911],
                poeticLine: "Order amidst the chaos.",
                pulse: { trainStatus: "Smooth", traffic: "Moderate", mood: "Busy" },
                livingData: {
                    connectivity: "Very Good (Train & Highway Hub)",
                    rent: "₹30k - 80k",
                    vibeScore: "8.2/10 (Commercial Hub)"
                },
                attractions: [
                    { name: "Mini Seashore Vashi", type: "Promenade", description: "Artificial beach area, perfect for evening walks and sunset views." },
                    { name: "Inorbit Mall", type: "Shopping", description: "Large entertainment and shopping hub." }
                ],
                dining: [
                    { name: "Hotel Mauli", cuisine: "Seafood (Maharashtrian)", vibe: "Authentic, bustling, local favorite." },
                    { name: "Vazhai", cuisine: "South Indian", vibe: "Crispy dosas, filter coffee, culturally rooted." }
                ],
                hotels: [
                    { name: "Four Points by Sheraton", priceRange: "₹18,000+", rating: "8.8/10" },
                    { name: "Fortune Select Exotica", priceRange: "₹10,000+", rating: "8.6/10" }
                ]
            },
            {
                name: "Belapur",
                slug: "belapur",
                vibe: "Administrative calm.",
                tagline: "Green and clean.",
                description: "CBD Belapur is the central business district of Navi Mumbai, home to many important government offices like the NMMC headquarters. Despite its administrative importance, it remains incredibly green, with the Parsik Hill offering panoramic views of the city.",
                image: "https://images.unsplash.com/photo-1658428131343-4cc073c6819a?q=80&w=2669&auto=format&fit=crop",
                coordinates: [19.0200, 73.0300],
                poeticLine: "Hills watching over the grid.",
                pulse: { trainStatus: "On Time", traffic: "Light", mood: "Official" },
                livingData: {
                    connectivity: "Good (Trains, Ferries soon)",
                    rent: "₹25k - 60k",
                    vibeScore: "8.5/10 (Green Business District)"
                },
                attractions: [
                    { name: "Parsik Hill", type: "Nature", description: "Panoramic city views and sunset spots on a high elevation." },
                    { name: "Belapur Fort Ruins", type: "Heritage", description: "16th-century Sidi fort ruins amidst nature." }
                ],
                dining: [
                    { name: "Canvas Bistro Bar", cuisine: "Continental/Asian", vibe: "Fine dining, elegant, sophisticated." },
                    { name: "Hitchki", cuisine: "Modern Indian", vibe: "Bollywood theme, creative menu, fun atmosphere." }
                ],
                hotels: [
                    { name: "The Park Navi Mumbai", priceRange: "₹16,000+", rating: "8.5/10" },
                    { name: "Country Inn & Suites", priceRange: "₹9,800+", rating: "8.7/10" }
                ]
            }
        ]
    },
    // Adding Thane...
    "thane": {
        name: "Thane",
        slug: "thane",
        tagline: "Lakes, greenery, expansion.",
        description: "Thane, often called the City of Lakes, sits just outside Mumbai's northern limit but is an integral part of the metropolitan region. With over 30 lakes including the beautiful Masunda Talao, it offers scenic beauty that is rare in the region. It sits at the foot of the Yeoor Hills and the Sanjay Gandhi National Park, providing a cooler climate and greener surroundings.",
        coordinates: [19.2183, 72.9781],
        heroImage: "https://images.unsplash.com/photo-1615552399677-1be61d670498?q=80&w=2670&auto=format&fit=crop",
        weather: { temp: 28, condition: "Cloudy", aqi: 50 },
        pulse: { trainStatus: "Crowded", traffic: "Heavy", mood: "Growing" },
        poeticLine: "Where the forest meets the concrete.",
        livingData: {
            connectivity: "Excellent (Central Railway Hub)",
            rent: "₹20k - 70k",
            vibeScore: "8.8/10 (Nature & Township)"
        },
        attractions: [
            { name: "Upvan Lake", type: "Nature/Recreation", description: "Scenic lake set against Yeoor hills, famous for evening vibes and boating." },
            { name: "Sanjay Gandhi National Park", type: "Wildlife", description: "Protected forest area offering lion/tiger safaris and Kanheri caves." },
            { name: "Viviana Mall", type: "Shopping", description: "One of the largest malls in the country for premium shopping." }
        ],
        dining: [
            { name: "Exotica - Tropical Retreat", cuisine: "Multi", vibe: "Lush greenery, open-air, tropical ambiance." },
            { name: "City Forestt", cuisine: "North Indian", vibe: "Village vibe, wooden interiors, earthy calm." }
        ],
        hotels: [
            { name: "Vivanta Thane LBS Road", priceRange: "₹8,500+", rating: "9.0/10" },
            { name: "Planet Hollywood Thane", priceRange: "₹11,000+", rating: "8.8/10" }
        ],
        subAreas: [
            {
                name: "Yeoor Hills",
                slug: "yeoor-hills",
                vibe: "Nature's embrace.",
                tagline: "The green lung.",
                description: "Yeoor Hills is an eco-sensitive zone located within the Sanjay Gandhi National Park, acting as a green lung for the city of Thane. It is a popular spot for morning joggers, nature enthusiasts, and trekkers who come to explore its rich biodiversity, including butterflies and leopards.",
                image: "https://images.unsplash.com/photo-1621350415334-a69078f44747?q=80&w=2669&auto=format&fit=crop",
                coordinates: [19.2310, 72.9370],
                poeticLine: "Silence speaks louder here.",
                pulse: { trainStatus: "N/A", traffic: "None", mood: "Zen" },
                livingData: {
                    connectivity: "Limited (Requires transport into hills)",
                    rent: "₹40k - 1L (Villas)",
                    vibeScore: "9.5/10 (Serene Forest)"
                },
                attractions: [
                    { name: "SGNP Trekking Trails", type: "Adventure", description: "Forest trails leading through streams and wildlife." },
                    { name: "Kanheri Caves", type: "Heritage", description: "Ancient Buddhist rock-cut caves within SGNP." }
                ],
                dining: [
                    { name: "Exotica", cuisine: "Multi-Cuisine", vibe: "Tropical open-air paradise amidst the hills." },
                    { name: "City Forestt", cuisine: "Multi-Cuisine", vibe: "Wooden, rustic village restaurant with live music." }
                ],
                hotels: [
                    { name: "Secret of Yeoor (Glamping)", priceRange: "₹3,500+", rating: "4.0/5" },
                    { name: "Fortune Park Lake City", priceRange: "₹9,500+", rating: "8.5/10" }
                ]
            },
            {
                name: "Upvan Lake",
                slug: "upvan-lake",
                vibe: "Serene waters.",
                tagline: "Reflections of peace.",
                description: "Upvan Lake is one of the biggest and most scenic lakes in Thane, set against the backdrop of the Yeoor Hills. It hosts the annual Sanskruti Arts Festival and is a favorite recreational spot for families and couples.",
                image: "https://images.unsplash.com/photo-1563294692-2b6d77344937?q=80&w=2609&auto=format&fit=crop",
                coordinates: [19.2244, 72.9567],
                poeticLine: "Water holding the sky.",
                pulse: { trainStatus: "N/A", traffic: "Light", mood: "Artistic" },
                livingData: {
                    connectivity: "Very Good (Buses and Autos)",
                    rent: "₹30k - 80k",
                    vibeScore: "9.0/10 (Scenic Beauty)"
                },
                attractions: [
                    { name: "Upvan Promenade", type: "Walkway", description: "Beautifully landscaped walkway around the lake." },
                    { name: "Paddle Boating", type: "Recreation", description: "Boating on the calm waters for ₹75." }
                ],
                dining: [
                    { name: "Lake View Cafe", cuisine: "Snacks", vibe: "Casual road-side bites overlooking the water." },
                    { name: "Various Fine Dines", cuisine: "Global", vibe: "Nearby restaurants offering elevated dining." }
                ],
                hotels: [
                    { name: "Satkar Residency", priceRange: "₹4,500+", rating: "8.0/10" },
                    { name: "Vivanta Thane", priceRange: "₹8,500+", rating: "9.0/10" }
                ]
            }
        ]
    }
};
