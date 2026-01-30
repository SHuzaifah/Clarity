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
        name: "Thomas Frank",
        category: "PRODUCTIVITY · FOCUS · SYSTEMS",
        handle: "ThomasFrank",
        description: "Study techniques, notion systems, and habit building.",
        badge: "Systems · Notion"
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
        name: "JEE Nexus by Unacademy",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "jeenexus",
        description: "Strategic guidance and preparation for JEE aspirants.",
        badge: "JEE · Strategy"
    },
    {
        name: "Next Toppers - 11th Science",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "nexttoppersscience",
        description: "Comprehensive 11th grade science curriculum coverage.",
        badge: "11th Science · Basics"
    },
    {
        name: "Abdul Bari",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "abdul_bari",
        description: "Mastering algorithms, data structures, and computer science.",
        badge: "CS · Algorithms"
    },
    {
        name: "LearnSATMath",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "learnsatmath",
        description: "Focused SAT math preparation and practice problems.",
        badge: "SAT · Math"
    },
    {
        name: "BrainStation",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "brain_station_videos",
        description: "Educational animations and explanations on various topics.",
        badge: "Education · Variety"
    },
    {
        name: "Your SAT Coach",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "yoursatcoach",
        description: "Expert tips, strategies, and coaching for the SAT.",
        badge: "SAT · Tips"
    },
    {
        name: "PW - 11th Science",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "pwudayclass11th",
        description: "Physics Wallah's dedicated channel for 11th science.",
        badge: "11th · Physics"
    },
    {
        name: "The Organic Chemistry Tutor",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "theorganicchemistrytutor",
        description: "Tutorials on chemistry, math, physics, and biology.",
        badge: "STEM · Help"
    },
    {
        name: "Gohar Khan",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "goharsguide",
        description: "Study tips, hacks, and advice for students.",
        badge: "Study Tips · Guide"
    },
    {
        name: "FloatHeadPhysics",
        category: "EDUCATIONAL · SCIENCE · ACADEMIC",
        handle: "Mahesh_Shenoy",
        description: "Visual and intuitive explanations of physics concepts.",
        badge: "Physics · Science"
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
];
