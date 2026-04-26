export interface VibeItem {
    id: string;
    title: string;
    src: string;
    aspect: string;
    description: string;
    longContent: string;
    location: string;
    tags: string[];
}

export const VIBES: VibeItem[] = [
    {
        id: "gateway-at-dawn",
        title: "Gateway at Dawn",
        src: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=1000&auto=format&fit=crop",
        aspect: "aspect-[4/5]",
        description: "The silent sentinel of the city before the chaos begins.",
        longContent: `
            <p>Before the tourists swarm and the photographers start their hustle, the Gateway of India stands in solemn silence. Built to commemorate the landing of King George V and Queen Mary in 1911, this basalt archway has seen the last of the British troops leave and the first of the dreamers arrive.</p>
            <p>At dawn, the Arabian Sea is calm, reflecting the golden hues of the rising sun. The pigeons take their first flight, and the air is filled with the salt of the sea and the promise of a new hustling day. It is here that you feel the true weight of Mumbai's history—a city that was built on 7 islands and a million dreams.</p>
            <h3>Experience the Quiet</h3>
            <p>Visit at 5:30 AM. Watch the sun rise over the Elephanta Caves in the distance. This is the only time the Maximum City pauses to breathe.</p>
        `,
        location: "Apollo Bunder, Colaba",
        tags: ["Heritage", "Sunrise", "Architecture"]
    },
    {
        id: "local-train-chaos",
        title: "Local Train Chaos",
        src: "https://images.unsplash.com/photo-1747548266586-294895c77218?q=80&w=1974&auto=format&fit=crop",
        aspect: "aspect-square",
        description: "The lifeline of Mumbai. 7 million stories on the move.",
        longContent: `
            <p>It's not just a train; it's a rite of passage. The Mumbai Local is the beating heart of the city, pumping millions of people through its veins every single day. From Virar to Churchgate, it is a classroom, a marketplace, and a battlefield combined.</p>
            <p>The "Super Dense Crush Load" is a real technical term used to describe peak hours, but for Mumbaikars, it's just Tuesday. Amidst the sweat and the struggle, there is a distinct code of conduct—seats are shared, bags are held by strangers, and friendships are forged in the fourth seat.</p>
            <h3>Survival Tips</h3>
            <p>Don't stand near the door unless you're getting off. And never, ever try to board a Virar Fast at Dadar unless you have a death wish.</p>
        `,
        location: "Western & Central Lines",
        tags: ["Transport", "Vibe", "Chaos"]
    },
    {
        id: "cutting-chai",
        title: "Cutting Chai",
        src: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1000&auto=format&fit=crop",
        aspect: "aspect-[3/4]",
        description: "Half a glass of magic that fuels the city's economy.",
        longContent: `
            <p>In Mumbai, business deals aren't closed in boardrooms; they're closed over a "Cutting". "Cutting" refers to the half-glass serving—just enough to give you a caffeine kick without filling you up, allowing you to drink 10 of them a day.</p>
            <p>Brewed with ginger, cardamom, and an aggressive amount of sugar, this tea is the fuel that keeps the city running 24/7. Whether you're a stockbroker at Dalal Street or a laborer at the docks, the Tapri (tea stall) is the great equalizer.</p>
        `,
        location: "Every Street Corner",
        tags: ["Food", "Culture", "Street"]
    },
    {
        id: "queens-necklace",
        title: "Marine Drive Queen's Necklace",
        src: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=1000&auto=format&fit=crop",
        aspect: "aspect-video",
        description: "A C-shaped boulevard that glitters like gold at night.",
        longContent: `
            <p>Marine Drive is Mumbai's collective therapy session. When life gets too heavy, Mumbaikars come here to sit on the promenade, stare at the endless Arabian Sea, and let the wind carry their worries away.</p>
            <p>At night, the streetlights curve along the coast, looking like a string of pearls, earning it the nickname "The Queen's Necklace". It is a place for lovers, joggers, and dreamers.</p>
            <h3>The Art Deco Legacy</h3>
            <p>Look away from the sea, and you'll see a row of UNESCO World Heritage Art Deco buildings—the second largest collection in the world after Miami.</p>
        `,
        location: "Netaji Subhash Chandra Bose Road",
        tags: ["Iconic", "Sea", "Nightlife"]
    },
    {
        id: "art-deco",
        title: "Art Deco Architecture",
        src: "https://images.unsplash.com/photo-1728109859916-b82f636b2509?q=80&w=736&auto=format&fit=crop",
        aspect: "aspect-[4/3]",
        description: "Where Miami meets Mumbai. A visual treat from the 1930s.",
        longContent: `
            <p>While the British built Gothic giants like CST, the wealthy Indian merchants of the 1930s wanted something modern. They embraced Art Deco—geometric shapes, bold lines, and pastel colors.</p>
            <p>Walk around Oval Maidan or Eros Cinema, and you'll feel like you've stepped back into a jazz-age film. These buildings represent the first modernized architectural movement in India, symbolizing a shift towards a global, cosmopolitan identity.</p>
        `,
        location: "Oval Maidan / Churchgate",
        tags: ["Architecture", "History", "Style"]
    },
    {
        id: "vada-pav",
        title: "Street Food Vada Pav",
        src: "https://images.unsplash.com/photo-1554978991-33ef7f31d658?q=80&w=736&auto=format&fit=crop",
        aspect: "aspect-square",
        description: "The Indian Burger. Spicy, fried, and absolutely non-negotiable.",
        longContent: `
            <p>If Mumbai had a flag, the Vada Pav would be on it. A deep-fried potato dumpling placed inside a soft bread bun (pav), smothered with spicy garlic chutney and a green chili on the side—it is the ultimate poor man's feast and rich man's indulgence.</p>
            <p>It was invented in the 1960s outside Dadar station and has since become the soul food of the city. No cutlery, no plates—just pure flavor in your hand.</p>
            <h3>Best Way to Eat</h3>
            <p>Hot, standing on the street, while dodging pedestrians. If your eyes don't water from the spice, ask for more "thecha"!</p>
        `,
        location: "Dadar, CST, Everywhere",
        tags: ["Food", "Spicy", "Legendary"]
    },
];
