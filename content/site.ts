export const site = {
  name: "OSMO Creation",
  shortName: "OSMO",
  wordmark: "OSMO",
  wordmarkSub: "CREATION",
  url: process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  title: "OSMO Creation — Photography & Film",
  description:
    "OSMO Creation is a creative visual studio documenting people, places and occasions through photography and film. A living archive of stories worth keeping.",
  tagline: "Photography, film and documentary.",
  // Verified public contact details from the studio's Pixieset site.
  // Update this file if any detail changes.
  contact: {
    email: "salakoolashubomi@gmail.com",
    phone: "+234 815 077 0138",
    phoneHref: "+2348150770138",
    city: "Lagos, Nigeria",
    address: "2, Irepodun Street, Ijesha, Surulere, Lagos, Nigeria",
  },
  socials: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/muhammedawwal.salako",
    },
    {
      label: "Facebook",
      href: "https://web.facebook.com/muhammedawwal.salako/",
    },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@awwal.salako",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/muhammedawwal-salako-761b1a299",
    },
    {
      label: "Pinterest",
      href: "https://pin.it/3X5ASC4mO",
    },
  ],
  // Deliberately left open: add the founder's name and biography here once
  // confirmed by the owner. The About page only renders this when present.
  founder: {
    name: "",
    note: "",
  },
} as const;

export const navigation = [
  { label: "Work", href: "/work" },
  { label: "Films", href: "/films" },
  { label: "About", href: "/about" },
  { label: "Book a session", href: "/contact" },
] as const;

export const studioStatement = [
  "I’m the person behind the camera at OSMO Creation. What draws me in is usually something small: the way someone looks at you, a familiar laugh, the breath before a room fills with people.",
  "When you invite me into your day, I want to understand what matters to you. Then I pay attention, stay close to the feeling, and make photographs and films you can return to.",
] as const;

export const aboutPage = {
  eyebrow: "The studio",
  headline: ["A practice", "of looking."],
  opening:
    "OSMO Creation documents people, places and occasions through photography and film. The work is quiet on purpose: real rooms, real light, real exchanges.",
  body: [
    "The studio moves between portrait sessions, ceremonies, institutions and community stories. Some days are planned in detail; others arrive in the middle of a football field or a lecture hall. We work with what is there.",
    "Photography and film are not separate disciplines here. Both are ways of paying attention — one holds a single frame, the other holds the moment as it unfolds. Between them, a collection becomes a record rather than a set of pictures.",
    "We take on portrait commissions, wedding and engagement coverage, brand and editorial work, event documentation and selected film projects.",
  ],
  principles: [
    {
      title: "Presence over production",
      body: "The best frames usually happen between the planned ones. We make room for them.",
    },
    {
      title: "Real light, real places",
      body: "We don’t sand the world down. A courtyard, a library, a street at dusk — those are the rooms these stories live in.",
    },
    {
      title: "The archive after the day",
      body: "A collection should still mean something a year later. We sequence and keep images with that in mind.",
    },
  ],
  services: [
    "Portrait sessions",
    "Weddings & engagements",
    "Events & cultural documentation",
    "Brands, institutions & editorial",
    "Photography for film & documentary",
    "Selected film commissions",
  ],
} as const;

export const contactPage = {
  eyebrow: "Enquiries",
  headline: ["Tell us what", "you’re making."],
  intro:
    "I’d love to hear what you’re planning. Tell me about your people, the place, and your date if you have one. We’ll talk through the details and find the right approach together.",
  projectTypes: [
    "Portrait session",
    "Wedding or engagement",
    "Event coverage",
    "Brand or editorial",
    "Film or documentary",
    "Something else",
  ],
} as const;
