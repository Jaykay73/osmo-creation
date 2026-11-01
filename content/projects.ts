import { media, type MediaAsset } from "@/lib/media";

export type CategoryId = "portraits" | "celebrations" | "events" | "institutions";

export type Project = {
  id: string;
  slug: string;
  title: string;
  date: string;
  dateDisplay: string;
  year: string;
  category: CategoryId;
  typeLabel: string;
  description: string;
  cover: MediaAsset;
  media: MediaAsset[];
  featured: boolean;
  featuredOrder?: number;
  displayOrder: number;
};

export const categories: { id: CategoryId | "all"; label: string; shortLabel: string }[] = [
  { id: "all", label: "All collections", shortLabel: "All" },
  { id: "portraits", label: "Portraits & people", shortLabel: "Portraits" },
  { id: "celebrations", label: "Weddings & celebrations", shortLabel: "Celebrations" },
  { id: "events", label: "Events & culture", shortLabel: "Events" },
  { id: "institutions", label: "Institutions & brands", shortLabel: "Institutions" },
];

export const categoryLabels: Record<CategoryId, string> = {
  portraits: "Portraits & people",
  celebrations: "Weddings & celebrations",
  events: "Events & culture",
  institutions: "Institutions & brands",
};

export const projects: Project[] = [
  {
    id: "dhikrullah-mueenah",
    slug: "dhikrullah-mueenah",
    title: "Dhikrullah & Mueenah",
    date: "2026-08-22",
    dateDisplay: "22 August 2026",
    year: "2026",
    category: "celebrations",
    typeLabel: "Engagement ceremony",
    description:
      "An engagement recorded in August 2026: pink tulle, deep blue cloth, and a courtyard filled with family. The collection follows the arrivals, the ceremony, and the quiet moments between.",
    cover: media(
      "/media/photography/dhikrullah-mueenah/couple-portrait.jpg",
      "A couple in peach and deep blue traditional attire at their engagement."
    ),
    media: [
      media(
        "/media/photography/dhikrullah-mueenah/couple-portrait.jpg",
        "A couple in peach and deep blue traditional attire at their engagement."
      ),
      media(
        "/media/photography/dhikrullah-mueenah/arrivals.jpg",
        "Guests arriving outside the engagement venue."
      ),
      media(
        "/media/photography/dhikrullah-mueenah/procession.jpg",
        "Women in bright red and cream outfits walking toward the venue."
      ),
      media(
        "/media/photography/dhikrullah-mueenah/canopy.jpg",
        "Rows of white chairs under a canopy decorated with pink tulle."
      ),
      media(
        "/media/photography/dhikrullah-mueenah/conversation.jpg",
        "Two women in pink hijabs speaking in the shade."
      ),
      media(
        "/media/photography/dhikrullah-mueenah/elder.jpg",
        "An older guest in a patterned headtie and pink outfit."
      ),
      media(
        "/media/photography/dhikrullah-mueenah/serving.jpg",
        "A man serving food at a long, red-covered table."
      ),
      media(
        "/media/photography/dhikrullah-mueenah/speaker.jpg",
        "A young man speaking into a microphone at the ceremony."
      ),
      media(
        "/media/photography/dhikrullah-mueenah/bride.jpg",
        "The bride's beaded pink veil and dress in close detail."
      ),
      media(
        "/media/photography/dhikrullah-mueenah/seated-couple.jpg",
        "The couple seated together during the ceremony."
      ),
      media(
        "/media/photography/dhikrullah-mueenah/family.jpg",
        "The couple standing with family members after the ceremony."
      ),
      media(
        "/media/photography/dhikrullah-mueenah/guests.jpg",
        "A procession of guests in colorful outfits crossing the venue."
      ),
      media(
        "/media/photography/dhikrullah-mueenah/group-portrait.jpg",
        "A large group portrait under the canopy."
      ),
    ],
    featured: true,
    featuredOrder: 1,
    displayOrder: 1,
  },
  {
    id: "fatima",
    slug: "fatima",
    title: "Fatima",
    date: "2026-08-16",
    dateDisplay: "16 August 2026",
    year: "2026",
    category: "portraits",
    typeLabel: "Portrait session",
    description:
      "A portrait session in sage and olive, made at a desk under low studio light. A book, a laptop, a lamp — and a still centre through all of it.",
    cover: media(
      "/media/photography/fatima/veil.jpg",
      "A portrait holding a dark veil across one shoulder."
    ),
    media: [
      media(
        "/media/photography/fatima/desk.jpg",
        "A woman in a sage-green outfit seated at a desk in a studio."
      ),
      media(
        "/media/photography/fatima/standing.jpg",
        "A full-length portrait in a sage-green dress and dark hijab."
      ),
      media(
        "/media/photography/fatima/veil.jpg",
        "A portrait holding a dark veil across one shoulder."
      ),
      media(
        "/media/photography/fatima/smile.jpg",
        "A woman smiling in a sage-green outfit against a dark studio backdrop."
      ),
      media(
        "/media/photography/fatima/reading.jpg",
        "A woman reading an open book at a studio desk."
      ),
      media(
        "/media/photography/fatima/lamp.jpg",
        "A seated portrait beside a plant and a table lamp."
      ),
      media(
        "/media/photography/fatima/lean.jpg",
        "A woman resting her chin on her hand at the desk."
      ),
      media(
        "/media/photography/fatima/laptop.jpg",
        "A portrait working at a laptop in the studio."
      ),
    ],
    featured: false,
    displayOrder: 2,
  },
  {
    id: "zee-diaries",
    slug: "zee-diaries",
    title: "Zee Diaries",
    date: "2026-08-11",
    dateDisplay: "11 August 2026",
    year: "2026",
    category: "portraits",
    typeLabel: "Conversation portraits",
    description:
      "A seated conversation recorded around a microphone — white, burgundy, and the small pauses between answers.",
    cover: media(
      "/media/photography/zee-diaries/microphone.jpg",
      "A woman in white and burgundy seated beside a microphone."
    ),
    media: [
      media(
        "/media/photography/zee-diaries/microphone.jpg",
        "A woman in white and burgundy seated beside a microphone."
      ),
      media(
        "/media/photography/zee-diaries/conversation.jpg",
        "A woman laughing during a recorded conversation."
      ),
      media(
        "/media/photography/zee-diaries/seated.jpg",
        "A portrait in a white outfit and burgundy headwrap."
      ),
      media(
        "/media/photography/zee-diaries/standing.jpg",
        "A standing portrait against pale curtains."
      ),
      media(
        "/media/photography/zee-diaries/detail.jpg",
        "A portrait beside a microphone and a small vase of flowers."
      ),
      media(
        "/media/photography/zee-diaries/listening.jpg",
        "A woman listening while holding a microphone."
      ),
    ],
    featured: false,
    displayOrder: 3,
  },
  {
    id: "afa",
    slug: "afa",
    title: "AFA",
    date: "2026-06-26",
    dateDisplay: "26 June 2026",
    year: "2026",
    category: "institutions",
    typeLabel: "Brand & editorial",
    description:
      "A menswear story on the lawn: four friends, tonal cloth, and embroidery in the afternoon light.",
    cover: media(
      "/media/photography/afa/group.jpg",
      "Four men in coordinated pale and dark traditional outfits on a lawn."
    ),
    media: [
      media(
        "/media/photography/afa/group.jpg",
        "Four men in coordinated pale and dark traditional outfits on a lawn."
      ),
      media(
        "/media/photography/afa/rust.jpg",
        "A man in a rust-colored tunic and patterned cap on the lawn."
      ),
      media(
        "/media/photography/afa/pale.jpg",
        "A man in a pale embroidered tunic under trees."
      ),
      media(
        "/media/photography/afa/dark.jpg",
        "A man in a dark tunic with geometric embroidery."
      ),
      media(
        "/media/photography/afa/duo.jpg",
        "Two men standing together in coordinating outfits."
      ),
      media(
        "/media/photography/afa/lineup.jpg",
        "Four men standing in a row on the grass."
      ),
      media(
        "/media/photography/afa/walk.jpg",
        "A group walking together across the lawn."
      ),
      media(
        "/media/photography/afa/group-close.jpg",
        "A close group portrait of four men in patterned outfits."
      ),
      media(
        "/media/photography/afa/group-wide.jpg",
        "A wide portrait of the group on the lawn."
      ),
    ],
    featured: false,
    displayOrder: 4,
  },
  {
    id: "aisha-birthday",
    slug: "aisha-birthday",
    title: "Aisha Birthday",
    date: "2026-06-18",
    dateDisplay: "18 June 2026",
    year: "2026",
    category: "portraits",
    typeLabel: "Birthday portraits",
    description: "Birthday portraits in purple, photographed in open shade.",
    cover: media(
      "/media/photography/aisha-birthday/portrait.jpg",
      "A young woman in a purple floral dress against green trees."
    ),
    media: [
      media(
        "/media/photography/aisha-birthday/portrait.jpg",
        "A young woman in a purple floral dress against green trees."
      ),
      media(
        "/media/photography/aisha-birthday/seated.jpg",
        "A portrait of a young woman sitting on a wall outdoors."
      ),
      media(
        "/media/photography/aisha-birthday/smile.jpg",
        "A woman smiling in a purple floral dress."
      ),
      media(
        "/media/photography/aisha-birthday/walking.jpg",
        "A full-length portrait in a purple dress on a path."
      ),
      media(
        "/media/photography/aisha-birthday/braids.jpg",
        "A portrait showing long braided hair with a dark bow."
      ),
      media(
        "/media/photography/aisha-birthday/grass.jpg",
        "A young woman seated on the grass in a purple dress."
      ),
    ],
    featured: false,
    displayOrder: 5,
  },
  {
    id: "jcin-unilorin-photoshoot",
    slug: "jcin-unilorin-photoshoot",
    title: "JCIN Unilorin Photoshoot",
    date: "2026-06-06",
    dateDisplay: "6 June 2026",
    year: "2026",
    category: "institutions",
    typeLabel: "Institutional portraits",
    description:
      "Formal portraits for the JCIN Unilorin chapter, made in studio and on campus.",
    cover: media(
      "/media/photography/jcin-unilorin-photoshoot/group.jpg",
      "A JCIN Unilorin group portrait in formal suits and blue dresses."
    ),
    media: [
      media(
        "/media/photography/jcin-unilorin-photoshoot/group.jpg",
        "A JCIN Unilorin group portrait in formal suits and blue dresses."
      ),
      media(
        "/media/photography/jcin-unilorin-photoshoot/group-wide.jpg",
        "A wide group portrait on the steps of a campus building."
      ),
      media(
        "/media/photography/jcin-unilorin-photoshoot/portrait-man.jpg",
        "A studio portrait of a young man in a dark suit."
      ),
      media(
        "/media/photography/jcin-unilorin-photoshoot/portrait-smile.jpg",
        "A smiling young man in a dark suit with his arms folded."
      ),
      media(
        "/media/photography/jcin-unilorin-photoshoot/portrait-hijab.jpg",
        "A portrait of a woman in a black blazer and hijab."
      ),
      media(
        "/media/photography/jcin-unilorin-photoshoot/portrait-glasses.jpg",
        "A young man in a suit wearing blue-tinted glasses."
      ),
      media(
        "/media/photography/jcin-unilorin-photoshoot/portrait-white-wrap.jpg",
        "A woman in a black blazer and white head wrap."
      ),
      media(
        "/media/photography/jcin-unilorin-photoshoot/portrait-navy.jpg",
        "A portrait of a man in a navy double-breasted suit."
      ),
      media(
        "/media/photography/jcin-unilorin-photoshoot/portrait-blue.jpg",
        "A woman in a blue blazer and dark hijab."
      ),
      media(
        "/media/photography/jcin-unilorin-photoshoot/portrait-scarf.jpg",
        "A woman in a black blazer with a white headscarf."
      ),
    ],
    featured: false,
    displayOrder: 6,
  },
  {
    id: "aminat",
    slug: "aminat",
    title: "Aminat",
    date: "2026-06-06",
    dateDisplay: "6 June 2026",
    year: "2026",
    category: "portraits",
    typeLabel: "Studio portraits",
    description: "A studio portrait session in black and white patterns.",
    cover: media(
      "/media/photography/aminat/seated.jpg",
      "A studio portrait of a woman in a patterned blouse and white head wrap."
    ),
    media: [
      media(
        "/media/photography/aminat/seated.jpg",
        "A studio portrait of a woman in a patterned blouse and white head wrap."
      ),
      media(
        "/media/photography/aminat/smile.jpg",
        "A woman smiling in a patterned blouse against a pale backdrop."
      ),
      media(
        "/media/photography/aminat/close.jpg",
        "A close portrait in a patterned blouse and white head wrap."
      ),
      media(
        "/media/photography/aminat/arms-folded.jpg",
        "A portrait with arms folded, wearing a black skirt."
      ),
      media(
        "/media/photography/aminat/standing.jpg",
        "A full-length studio portrait in a patterned blouse."
      ),
    ],
    featured: false,
    displayOrder: 7,
  },
  {
    id: "law-and-sport-week",
    slug: "law-and-sport-week",
    title: "Law and Sport Week",
    date: "2026-06-04",
    dateDisplay: "4 June 2026",
    year: "2026",
    category: "events",
    typeLabel: "Event coverage",
    description:
      "The Law and Sport Week symposium — speeches, awards, and the people in the room.",
    cover: media(
      "/media/photography/law-and-sport-week/interview.jpg",
      "A man in a blue suit speaking into a microphone at Law and Sport Week."
    ),
    media: [
      media(
        "/media/photography/law-and-sport-week/interview.jpg",
        "A man in a blue suit speaking into a microphone at Law and Sport Week."
      ),
      media(
        "/media/photography/law-and-sport-week/speaker-young.jpg",
        "A young man in a suit speaking to an audience."
      ),
      media(
        "/media/photography/law-and-sport-week/guest.jpg",
        "A guest in blue traditional attire at the symposium."
      ),
      media(
        "/media/photography/law-and-sport-week/stage.jpg",
        "Two speakers on a purple-lit stage."
      ),
      media(
        "/media/photography/law-and-sport-week/audience-portrait.jpg",
        "A smiling woman in a black dress in the audience."
      ),
      media(
        "/media/photography/law-and-sport-week/speaker-podium.jpg",
        "A man at a podium addressing the hall."
      ),
      media(
        "/media/photography/law-and-sport-week/audience.jpg",
        "Audience members seated in a row at the event."
      ),
      media(
        "/media/photography/law-and-sport-week/award.jpg",
        "A man in a suit holding a glass award."
      ),
      media(
        "/media/photography/law-and-sport-week/trophy-bw.jpg",
        "A black-and-white photograph of a trophy celebration."
      ),
      media(
        "/media/photography/law-and-sport-week/medal.jpg",
        "A young man in a football jersey holding a medal."
      ),
    ],
    featured: true,
    featuredOrder: 5,
    displayOrder: 8,
  },
  {
    id: "epi-2020",
    slug: "epi-2020",
    title: "EPI 2020",
    date: "2026-06-01",
    dateDisplay: "1–3 June 2026",
    year: "2026",
    category: "events",
    typeLabel: "Documentary series",
    description:
      "Three days with the EPI programme: a visitation, a public lecture, and the awareness walk.",
    cover: media(
      "/media/photography/epi-2020/banner.jpg",
      "EPI volunteers holding a banner outside a campus building."
    ),
    media: [
      media(
        "/media/photography/epi-2020/banner.jpg",
        "EPI volunteers holding a banner outside a campus building."
      ),
      media(
        "/media/photography/epi-2020/group.jpg",
        "A group portrait of EPI volunteers outdoors."
      ),
      media(
        "/media/photography/epi-2020/banner-close.jpg",
        "Volunteers standing behind a pink EPI Week banner."
      ),
      media(
        "/media/photography/epi-2020/speaker.jpg",
        "A volunteer speaking into a microphone."
      ),
      media(
        "/media/photography/epi-2020/sign.jpg",
        "A smiling volunteer holding an EPI Week sign."
      ),
      media(
        "/media/photography/epi-2020/greeting.jpg",
        "A volunteer greeting another volunteer in a blue hijab."
      ),
      media(
        "/media/photography/epi-2020/bus.jpg",
        "Volunteers standing at the open door of a white and blue bus."
      ),
      media(
        "/media/photography/epi-2020/volunteers.jpg",
        "Two volunteers smiling outdoors."
      ),
      media(
        "/media/photography/epi-2020/lecture-hall.jpg",
        "A large group portrait in a lecture hall."
      ),
      media(
        "/media/photography/epi-2020/audience.jpg",
        "Students seated in a lecture hall."
      ),
      media(
        "/media/photography/epi-2020/listening.jpg",
        "Two volunteers listening in a lecture hall."
      ),
      media(
        "/media/photography/epi-2020/embrace-bw.jpg",
        "A black-and-white frame of two people embracing in a classroom."
      ),
      media(
        "/media/photography/epi-2020/performer.jpg",
        "A dancer performing in front of an audience."
      ),
    ],
    featured: false,
    displayOrder: 9,
  },
  {
    id: "misturoh",
    slug: "misturoh",
    title: "Misturoh",
    date: "2026-05-22",
    dateDisplay: "22 May 2026",
    year: "2026",
    category: "portraits",
    typeLabel: "Portrait story",
    description:
      "A portrait study in burgundy and white, made around a tiled courtyard at midday.",
    cover: media(
      "/media/photography/misturoh/dua.jpg",
      "A woman in white and burgundy with her hands raised in a tiled courtyard."
    ),
    media: [
      media(
        "/media/photography/misturoh/hands.jpg",
        "A close view of cupped hands and rings against white and burgundy fabric."
      ),
      media(
        "/media/photography/misturoh/courtyard.jpg",
        "A woman in white and burgundy seated in a tiled courtyard."
      ),
      media(
        "/media/photography/misturoh/dua.jpg",
        "A woman in white and burgundy with her hands raised in a tiled courtyard."
      ),
      media(
        "/media/photography/misturoh/profile.jpg",
        "A portrait from behind, a hoop earring visible against patterned tiles."
      ),
      media(
        "/media/photography/misturoh/monochrome.jpg",
        "A black-and-white portrait of a woman seated on patterned tiles."
      ),
      media(
        "/media/photography/misturoh/outdoors.jpg",
        "A woman outdoors with hands raised under trees."
      ),
      media(
        "/media/photography/misturoh/wide-bw.jpg",
        "A wide black-and-white view of the courtyard and seated woman."
      ),
      media(
        "/media/photography/misturoh/ledge.jpg",
        "A woman in a white embroidered outfit sitting on a ledge."
      ),
      media(
        "/media/photography/misturoh/side-profile.jpg",
        "A side-profile portrait in a burgundy headwrap."
      ),
      media(
        "/media/photography/misturoh/handbag.jpg",
        "A seated portrait on a tiled ledge with a burgundy handbag."
      ),
      media(
        "/media/photography/misturoh/full-length.jpg",
        "A full-length portrait in white and burgundy on a tiled ledge."
      ),
    ],
    featured: true,
    featuredOrder: 2,
    displayOrder: 10,
  },
  {
    id: "hikmarh",
    slug: "hikmarh",
    title: "Hikmarh",
    date: "2026-05-21",
    dateDisplay: "21 May 2026",
    year: "2026",
    category: "portraits",
    typeLabel: "Portrait story",
    description:
      "An afternoon in the library — stacks, shelves, and a blue headwrap between the spines.",
    cover: media(
      "/media/photography/hikmarh/books-frame.jpg",
      "A woman in a blue headwrap and glasses framed by tall stacks of books."
    ),
    media: [
      media(
        "/media/photography/hikmarh/books-frame.jpg",
        "A woman in a blue headwrap and glasses framed by tall stacks of books."
      ),
      media(
        "/media/photography/hikmarh/library-exterior.jpg",
        "A portrait outside the University of Ilorin library."
      ),
      media(
        "/media/photography/hikmarh/reading.jpg",
        "A woman reading a book between library shelves."
      ),
      media(
        "/media/photography/hikmarh/shelf.jpg",
        "A portrait leaning out from a library shelf."
      ),
      media(
        "/media/photography/hikmarh/book-towers.jpg",
        "A portrait seen between towers of stacked books."
      ),
      media(
        "/media/photography/hikmarh/library-wide.jpg",
        "A full-length portrait outside the library building."
      ),
      media(
        "/media/photography/hikmarh/reading-chair.jpg",
        "A woman reading in a chair beside a bookshelf."
      ),
      media(
        "/media/photography/hikmarh/call.jpg",
        "A portrait outside the library, a hand raised to her glasses."
      ),
      media(
        "/media/photography/hikmarh/between-shelves.jpg",
        "A woman standing between shelves of books."
      ),
      media(
        "/media/photography/hikmarh/seated-book.jpg",
        "A woman seated with an open book in a library."
      ),
    ],
    featured: false,
    displayOrder: 11,
  },
  {
    id: "rofiat",
    slug: "rofiat",
    title: "Rofiat",
    date: "2026-05-04",
    dateDisplay: "4 May 2026",
    year: "2026",
    category: "portraits",
    typeLabel: "Portrait session",
    description: "A short portrait session on a brick path, around the trees.",
    cover: media(
      "/media/photography/rofiat/bench.jpg",
      "A woman in a red top and white hijab seated on a bench."
    ),
    media: [
      media(
        "/media/photography/rofiat/bench.jpg",
        "A woman in a red top and white hijab seated on a bench."
      ),
      media(
        "/media/photography/rofiat/standing.jpg",
        "A woman standing on a brick path among trees."
      ),
      media(
        "/media/photography/rofiat/seated.jpg",
        "A seated portrait on brick steps."
      ),
      media(
        "/media/photography/rofiat/profile.jpg",
        "A side-profile portrait against a brick wall."
      ),
    ],
    featured: false,
    displayOrder: 12,
  },
  {
    id: "edts-2026",
    slug: "edts-2026",
    title: "EDTS 2026",
    date: "2026-05-16",
    dateDisplay: "16 May 2026",
    year: "2026",
    category: "events",
    typeLabel: "Community documentary",
    description:
      "A community outreach day: food parcels, health checks, music, and children on the field.",
    cover: media(
      "/media/photography/edts-2026/children.jpg",
      "A group of smiling children with volunteers at a community outreach."
    ),
    media: [
      media(
        "/media/photography/edts-2026/supplies.jpg",
        "Food parcels and supplies arranged on the ground at a community outreach."
      ),
      media(
        "/media/photography/edts-2026/children.jpg",
        "A group of smiling children with volunteers at a community outreach."
      ),
      media(
        "/media/photography/edts-2026/embrace.jpg",
        "A man holding a young child at the outreach."
      ),
      media(
        "/media/photography/edts-2026/gathering.jpg",
        "Volunteers and community members gathered outdoors."
      ),
      media(
        "/media/photography/edts-2026/speaker.jpg",
        "A man speaking into a microphone under a canopy."
      ),
      media(
        "/media/photography/edts-2026/table.jpg",
        "Volunteers working behind a table of supplies."
      ),
      media(
        "/media/photography/edts-2026/care.jpg",
        "A volunteer attending to a child's arm at the outreach."
      ),
      media(
        "/media/photography/edts-2026/hands.jpg",
        "A volunteer holding a woman's hand during a health check."
      ),
      media(
        "/media/photography/edts-2026/group.jpg",
        "A group of young people posing together at the outreach."
      ),
      media(
        "/media/photography/edts-2026/red.jpg",
        "A woman in a red patterned outfit walking across a field."
      ),
      media(
        "/media/photography/edts-2026/dance.jpg",
        "Two people dancing at the outreach."
      ),
      media(
        "/media/photography/edts-2026/volunteers.jpg",
        "Two smiling volunteers in blue outreach shirts."
      ),
      media(
        "/media/photography/edts-2026/football.jpg",
        "Children playing football on a field at the outreach."
      ),
    ],
    featured: true,
    featuredOrder: 3,
    displayOrder: 13,
  },
  {
    id: "harmony-academy-2026",
    slug: "harmony-academy-2026",
    title: "Harmony Academy 2026",
    date: "2026-04-17",
    dateDisplay: "17 April 2026",
    year: "2026",
    category: "institutions",
    typeLabel: "Programme coverage",
    description:
      "The JCI Harmony Academy cohort at work — laptops open, mentors at the table, certificates at the end.",
    cover: media(
      "/media/photography/harmony-academy-2026/group.jpg",
      "A group portrait of Harmony Academy students in blue shirts."
    ),
    media: [
      media(
        "/media/photography/harmony-academy-2026/group.jpg",
        "A group portrait of Harmony Academy students in blue shirts."
      ),
      media(
        "/media/photography/harmony-academy-2026/laptops.jpg",
        "Students working on laptops during a session."
      ),
      media(
        "/media/photography/harmony-academy-2026/portrait.jpg",
        "A smiling woman at a laptop during the academy."
      ),
      media(
        "/media/photography/harmony-academy-2026/pair.jpg",
        "Two students working together on laptops."
      ),
      media(
        "/media/photography/harmony-academy-2026/duo.jpg",
        "Two students posing in Harmony Academy shirts."
      ),
      media(
        "/media/photography/harmony-academy-2026/laptop-duo.jpg",
        "Two young men at a laptop during the academy."
      ),
      media(
        "/media/photography/harmony-academy-2026/volunteer.jpg",
        "A woman smiling in a blue Harmony Academy shirt."
      ),
      media(
        "/media/photography/harmony-academy-2026/certificate.jpg",
        "A man holding a framed certificate."
      ),
      media(
        "/media/photography/harmony-academy-2026/hijab-duo.jpg",
        "Two participants in hijabs posing at the academy."
      ),
      media(
        "/media/photography/harmony-academy-2026/audience.jpg",
        "Participants seated at an outdoor session."
      ),
    ],
    featured: false,
    displayOrder: 14,
  },
  {
    id: "global-surveyor-day-2",
    slug: "global-surveyor-day-2",
    title: "Global Surveyor Day 2, Kwara",
    date: "2026-03-28",
    dateDisplay: "28 March 2026",
    year: "2026",
    category: "events",
    typeLabel: "Community outreach",
    description:
      "A community health outreach during Global Surveyor Day 2 in Kwara — blood pressure checks, conversation, and care.",
    cover: media(
      "/media/photography/global-surveyor-day-2/embrace.jpg",
      "A volunteer embracing a man during a community health outreach."
    ),
    media: [
      media(
        "/media/photography/global-surveyor-day-2/embrace.jpg",
        "A volunteer embracing a man during a community health outreach."
      ),
      media(
        "/media/photography/global-surveyor-day-2/conversation.jpg",
        "A man speaking with a volunteer under a canopy."
      ),
      media(
        "/media/photography/global-surveyor-day-2/check.jpg",
        "A volunteer checking a man's blood pressure."
      ),
      media(
        "/media/photography/global-surveyor-day-2/check-second.jpg",
        "A volunteer taking a blood pressure reading at a table."
      ),
      media(
        "/media/photography/global-surveyor-day-2/table.jpg",
        "Young men seated at a table during the outreach."
      ),
      media(
        "/media/photography/global-surveyor-day-2/sashes.jpg",
        "Volunteers tying sashes on guests at the outreach."
      ),
      media(
        "/media/photography/global-surveyor-day-2/audience.jpg",
        "An audience of older men at the outreach."
      ),
      media(
        "/media/photography/global-surveyor-day-2/portrait.jpg",
        "A smiling woman in a pale hijab and patterned outfit."
      ),
    ],
    featured: false,
    displayOrder: 15,
  },
  {
    id: "eid-2026",
    slug: "eid-2026",
    title: "Eid 2026",
    date: "2026-03-19",
    dateDisplay: "19 March 2026",
    year: "2026",
    category: "celebrations",
    typeLabel: "Festival portraits",
    description:
      "Eid portraits in the open air: colour, henna, and reunions.",
    cover: media(
      "/media/photography/eid-2026/men.jpg",
      "Three men in pale traditional outfits laughing together in the sun."
    ),
    media: [
      media(
        "/media/photography/eid-2026/men.jpg",
        "Three men in pale traditional outfits laughing together in the sun."
      ),
      media(
        "/media/photography/eid-2026/teal.jpg",
        "A man in a pale blue tunic and cap standing outside."
      ),
      media(
        "/media/photography/eid-2026/white.jpg",
        "A man in a white outfit and sunglasses posing near a mosque."
      ),
      media(
        "/media/photography/eid-2026/green.jpg",
        "A smiling woman in a pale green hijab."
      ),
      media(
        "/media/photography/eid-2026/red.jpg",
        "A woman in a red headscarf smiling in the sun."
      ),
      media(
        "/media/photography/eid-2026/striped.jpg",
        "A woman in a red striped outfit waving."
      ),
      media(
        "/media/photography/eid-2026/pink.jpg",
        "A close portrait in a pink hijab."
      ),
      media(
        "/media/photography/eid-2026/henna.jpg",
        "Hands decorated with henna resting over a black phone."
      ),
      media(
        "/media/photography/eid-2026/laughing.jpg",
        "A woman in a burgundy hijab laughing with a hand over her face."
      ),
      media(
        "/media/photography/eid-2026/friends.jpg",
        "Two friends in purple and pink outfits standing together."
      ),
      media(
        "/media/photography/eid-2026/purple.jpg",
        "A portrait of a woman in a purple outfit and white headscarf."
      ),
      media(
        "/media/photography/eid-2026/black.jpg",
        "A side-profile portrait in a dark patterned dress."
      ),
    ],
    featured: true,
    featuredOrder: 4,
    displayOrder: 16,
  },
];

export const featuredProjects = projects
  .filter((project) => project.featured)
  .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}

export function getRelatedProjects(slug: string, limit = 3) {
  const current = getProject(slug);
  if (!current) return [];
  const sameCategory = projects.filter(
    (project) => project.slug !== slug && project.category === current.category
  );
  const others = projects.filter(
    (project) => project.slug !== slug && project.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export const projectCount = projects.length;

export type ArchiveProject = {
  id: string;
  slug: string;
  title: string;
  date: string;
  dateDisplay: string;
  category: CategoryId;
  typeLabel: string;
  cover: MediaAsset;
};

export const archiveProjects: ArchiveProject[] = projects.map((project) => ({
  id: project.id,
  slug: project.slug,
  title: project.title,
  date: project.date,
  dateDisplay: project.dateDisplay,
  category: project.category,
  typeLabel: project.typeLabel,
  cover: project.cover,
}));

// Curated selection for the spatial archive.
export const spatialProjectSlugs = [
  "dhikrullah-mueenah",
  "misturoh",
  "eid-2026",
  "jcin-unilorin-photoshoot",
  "edts-2026",
  "hikmarh",
  "fatima",
  "law-and-sport-week",
  "aisha-birthday",
];

const spatialTextures: Record<string, string> = {
  "dhikrullah-mueenah": "/media/textures/hero-couple.jpg",
  misturoh: "/media/textures/hero-dua.jpg",
  "eid-2026": "/media/textures/hero-eid-men.jpg",
  "jcin-unilorin-photoshoot": "/media/textures/hero-jcin.jpg",
  "edts-2026": "/media/textures/hero-children.jpg",
  hikmarh: "/media/textures/hero-library.jpg",
  fatima: "/media/textures/hero-portrait.jpg",
  "law-and-sport-week": "/media/textures/hero-law.jpg",
  "aisha-birthday": "/media/textures/hero-aisha.jpg",
};

export type SpatialProject = ArchiveProject & { texture: string };

export const spatialArchiveProjects: SpatialProject[] = spatialProjectSlugs
  .map((slug) => archiveProjects.find((project) => project.slug === slug))
  .filter((project): project is ArchiveProject => Boolean(project))
  .map((project) => ({
    ...project,
    texture: spatialTextures[project.slug],
  }));

export const categoryCounts = categories.reduce<Record<string, number>>(
  (counts, category) => {
    counts[category.id] =
      category.id === "all"
        ? projects.length
        : projects.filter((project) => project.category === category.id).length;
    return counts;
  },
  {}
);

export const spatialProjects = spatialProjectSlugs
  .map((slug) => getProject(slug))
  .filter((project): project is Project => Boolean(project));
