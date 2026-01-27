export type ChannelCategory =
    | "PRODUCTIVITY · FOCUS · SYSTEMS"
    | "TECH · CODING · AI"
    | "EDUCATIONAL · SCIENCE · ACADEMIC"
    | "FINANCE · ECONOMICS · CAREER"
    | "THINKING · PHILOSOPHY · LONG-FORM";

export interface Channel {
    name: string;
    category: ChannelCategory;
    description: string; // "What they teach"
    badge: string; // "Learning intent"
    id?: string;
    handle?: string;
    thumbnailUrl?: string;
}

export const CHANNELS: Channel[] = [
    // PRODUCTIVITY
    {
        name: "Ali Abdaal",
        category: "PRODUCTIVITY · FOCUS · SYSTEMS",
        handle: "AliAbdaal",
        description: "Evidence-based strategies for productivity and living a happier life.",
        badge: "Productivity · Lifestyle"
    },
    {
        name: "Thomas Frank",
        category: "PRODUCTIVITY · FOCUS · SYSTEMS",
        handle: "ThomasFrank",
        description: "Study techniques, notion systems, and habit building.",
        badge: "Systems · Notion"
    },
    {
        name: "Cal Newport",
        category: "PRODUCTIVITY · FOCUS · SYSTEMS",
        handle: "CalNewport",
        description: "Deep work, digital minimalism, and career craftsmanship.",
        badge: "Deep Work · Focus"
    },
    {
        name: "Matt D'Avella",
        category: "PRODUCTIVITY · FOCUS · SYSTEMS",
        handle: "MattDavella",
        description: "Minimalism, habit experiments, and creative filmmaking.",
        badge: "Minimalism · Habits"
    },

    // TECH
    {
        name: "Fireship",
        category: "TECH · CODING · AI",
        handle: "Fireship",
        description: "High-intensity code tutorials and tech news in 100 seconds.",
        badge: "Web Dev · Fast"
    },
    {
        name: "Traversy Media",
        category: "TECH · CODING · AI",
        handle: "TraversyMedia",
        description: "Comprehensive crash courses on web technologies.",
        badge: "Tutorials · Full Stack"
    },
    {
        name: "Computerphile",
        category: "TECH · CODING · AI",
        handle: "Computerphile",
        description: "Deep dives into the algorithms and history of computing.",
        badge: "CS Fundamentals"
    },
    {
        name: "Two Minute Papers",
        category: "TECH · CODING · AI",
        handle: "TwoMinutePapers",
        description: "Showcasing the latest breakthroughs in AI research.",
        badge: "AI Research"
    },
    {
        name: "freeCodeCamp.org",
        category: "TECH · CODING · AI",
        handle: "freeCodeCamp",
        description: "Full-length courses on virtually every programming topic.",
        badge: "Courseware"
    },
    {
        name: "Take U Forward",
        category: "TECH · CODING · AI",
        handle: "takeUforward",
        description: "DSA, algorithmic patterns, and interview prep.",
        badge: "Algorithms · Interview"
    },
    {
        name: "Gate Smashers",
        category: "TECH · CODING · AI",
        handle: "GateSmashers",
        description: "Simplified CS concepts for GATE and university exams.",
        badge: "CS · Exams"
    },
    {
        name: "CodeWithHarry",
        category: "TECH · CODING · AI",
        handle: "CodeWithHarry",
        description: "Programming tutorials in Hindi/English.",
        badge: "Coding · Hindi"
    },
    {
        name: "Gohar Khan",
        category: "PRODUCTIVITY · FOCUS · SYSTEMS",
        handle: "goharkhan",
        description: "Student hacks and study tips.",
        badge: "Student · Tips"
    },
    {
        name: "Better Ideas",
        category: "PRODUCTIVITY · FOCUS · SYSTEMS",
        handle: "BetterIdeas",
        description: "Ideas to help you improve your life.",
        badge: "Growth · Ideas"
    },

    // EDUCATIONAL (Formerly Science)
    {
        name: "Khan Academy",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "khanacademy",
        description: "World-class education for anyone, anywhere.",
        badge: "K-12 · Foundation"
    },
    {
        name: "3Blue1Brown",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "3blue1brown",
        description: "Visual explanations of advanced mathematics.",
        badge: "Math · Conceptual"
    },
    {
        name: "Veritasium",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "veritasium",
        description: "The element of truth in videos about science and engineering.",
        badge: "Physics · Exploration"
    },
    {
        name: "Kurzgesagt",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "kurzgesagt",
        description: "Optimistic nihilism and beautiful science animation.",
        badge: "Science · Animated"
    },
    {
        name: "MIT OpenCourseWare",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "mitocw",
        description: "Actual lectures from MIT's undergraduate and graduate courses.",
        badge: "University · Deep"
    },
    {
        name: "CrashCourse",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "crashcourse",
        description: "Refresher courses on history, science, and literature.",
        badge: "Overview · History"
    },
    {
        name: "Physics Wallah",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "PhysicsWallah",
        description: "Making physics accessbile to every student.",
        badge: "Physics · JEE"
    },
    {
        name: "Unacademy",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "unacademy",
        description: "India's largest free education initiative.",
        badge: "Competitive Exams"
    },
    {
        name: "Vedantu",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "VedantuInnovations",
        description: "Live online learning for personalized attention.",
        badge: "K-12 · JEE/NEET"
    },
    {
        name: "BYJU'S",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "Byjus",
        description: "Visual learning programs for K-12 students.",
        badge: "K-12 · Concepts"
    },
    {
        name: "FloatHeadPhysics",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "FloatHeadPhysics",
        description: "Intuitiive physics explanations and visualizations.",
        badge: "Physics · Visuals"
    },
    {
        name: "PW Class 11 Science",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "ScienceWallah", // Best guess or 'PhysicsWallah' var
        description: "Dedicated science curriculum for Class 11.",
        badge: "Class 11 · Science"
    },
    {
        name: "Andrew Huberman",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "hubermanlab",
        description: "Science and tools for everyday life.",
        badge: "Neuroscience · Health"
    },
    {
        name: "Your SAT Coach",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "YourSATCoach", // Assuming handle
        description: "Expert strategies for the Digital SAT.",
        badge: "SAT Preparation"
    },

    // FINANCE
    {
        name: "The Plain Bagel",
        category: "FINANCE · ECONOMICS · CAREER",
        handle: "ThePlainBagel",
        description: "Financial education without the hype.",
        badge: "Investing · Basics"
    },
    {
        name: "Patrick Boyle",
        category: "FINANCE · ECONOMICS · CAREER",
        handle: "PatrickBoyleOnFinance",
        description: "Quantitative finance and market history/commentary.",
        badge: "Markets · History"
    },
    {
        name: "Economics Explained",
        category: "FINANCE · ECONOMICS · CAREER",
        handle: "EconomicsExplained",
        description: "Explaining the economic forces driving the world.",
        badge: "Macro · Economics"
    },

    // THINKING
    {
        name: "Vsauce",
        category: "THINKING · PHILOSOPHY · LONG-FORM",
        handle: "Vsauce",
        description: "Exploring the curiosities of our world and mind.",
        badge: "Curiosity · Science"
    },
    {
        name: "The School of Life",
        category: "THINKING · PHILOSOPHY · LONG-FORM",
        handle: "theschooloflifetv",
        description: "Emotional intelligence and philosophy for daily life.",
        badge: "Philosophy · EQ"
    },
    {
        name: "Lex Fridman",
        category: "THINKING · PHILOSOPHY · LONG-FORM",
        handle: "lexfridman",
        description: " Conversations about AI, science, nature, and power.",
        badge: "Podcast · Deep"
    },
    {
        name: "Nathaniel Drew",
        category: "THINKING · PHILOSOPHY · LONG-FORM",
        handle: "nathanieldrew",
        description: "Mental clarity and intentional living.",
        badge: "Lifestyle · Philosophy"
    },
];
