export const resumeHighlights = {
  name: "Odon Ineza",
  title: "Computer Science Student @ University of Notre Dame",
  pitch:
    "I build practical software that blends product thinking, strong engineering fundamentals, and measurable user impact.",
  education: [
    {
      school: "University of Notre Dame",
      degree: "B.S. in Computer Science, Minor in Mathematics",
      detail: "GPA 3.794 | Expected May 2029"
    }
  ],
  experience: [
    {
      role: "Full Stack Developer",
      org: "Pivot Access Ltd",
      period: "Feb 2025 - Jul 2025",
      bullets: [
        "Maintained production infrastructure with Kubernetes, Docker, Prometheus, Grafana, Loki, and New Relic.",
        "Improved reliability by automating deployment and monitoring workflows across services."
      ]
    },
    {
      role: "Front End Developer & Research Intern",
      org: "Pivot Access Ltd",
      period: "Aug 2023 - Feb 2025",
      bullets: [
        "Built responsive interfaces with React Hooks and Tailwind CSS to improve usability.",
        "Used PostgreSQL and Matplotlib-driven analysis to support design and product decisions."
      ]
    }
  ],
  strengths: [
    "Full-stack web development (React, Next.js, Node.js)",
    "Cloud-native tooling (Docker, Kubernetes, monitoring stacks)",
    "Analytical thinking (Python, SQL, data visualization)",
    "Leadership and communication in research and student organizations"
  ],
  resumePdfPath: "/resume/Odon-Ineza-Resume.pdf"
};

export type OriginStoryChapter = {
  id: string;
  badge: string;
  headline: string;
  body: string[];
  flavor?: "meme" | "turn" | "future" | "punch";
};

/** Long-form personal narrative for the Origin Story overlay on the home page. */
export const originStory = {
  launchCta: "Click here if you’re interested in my journey into computer science",
  launchHint: "How memes, Twitter, and a lot of scrolling led me here.",
  chapters: [
    {
      id: "rwanda-memes",
      badge: "🇷🇼",
      headline: "It didn’t start with code—it started with memes.",
      flavor: "meme",
      body: [
        "I’m a Rwandan guy, and my journey into computer science didn’t start with code—it started with memes.",
        "I used to spend way too much time on Instagram, mostly because of memes. At some point, though, I thought, “There has to be more elite memes out there.”"
      ]
    },
    {
      id: "migration",
      badge: "🧭",
      headline: "Migrating across the internet like a meme-hunting specialist.",
      flavor: "meme",
      body: [
        "That’s how I ended up on Twitter (X), then Discord, then Slack channels—basically migrating across the internet like a meme-hunting specialist."
      ]
    },
    {
      id: "karpathy",
      badge: "👀",
      headline: "Followed for the memes. Stayed for the ideas.",
      flavor: "turn",
      body: [
        "Somewhere along the way, I came across people like Andrej Karpathy and Dwarkesh Patel. At first, I won’t lie—I followed them for the memes. But then I started actually listening to what they were saying."
      ]
    },
    {
      id: "dangerous",
      badge: "⚠️",
      headline: "That’s when things got dangerous.",
      flavor: "punch",
      body: [
        "These guys weren’t just funny—they were talking about AI, the future, how the world is changing, and how fast everything is evolving. Suddenly, my meme feed turned into a low-key education in Machine Learning and Large Language Models.",
        "Next thing I know, I’m a Rwandan guy who came for memes but stayed for neural networks."
      ]
    },
    {
      id: "velocity",
      badge: "⚡",
      headline: "The speed of the field hooked me.",
      flavor: "turn",
      body: [
        "What really pulled me in was how fast everything moves. In AI, even something like prompt engineering has a lifespan of about six months before engineers improve the models so much that your “genius trick” becomes basic. That kind of rapid progress is insane—and honestly, kind of addictive to follow."
      ]
    },
    {
      id: "careers",
      badge: "🛠️",
      headline: "What I’m aiming at now",
      flavor: "future",
      body: [
        "Now I find myself genuinely interested in careers like Machine Learning Engineering, Inference Engineering, and Systems Engineering. Not just because they’re important, but because they’re shaping the future in real time."
      ]
    },
    {
      id: "rwanda-reflect",
      badge: "🌍",
      headline: "Humor first. Builders second.",
      flavor: "turn",
      body: [
        "It’s funny—growing up in Rwanda, I didn’t think my path into tech would come from scrolling through memes. But somehow, by following humor, I ended up following people building some of the most advanced technology in the world."
      ]
    },
    {
      id: "finale",
      badge: "🚀",
      headline: "Pick your ending.",
      flavor: "future",
      body: [
        "So yeah, maybe in 10 years I’ll be building something impactful too. Maybe I’ll be the next Andrej Karpathy. Maybe even the next Dario Amodei.",
        "Or maybe…I’ll just be a guy who came for the memes and accidentally stayed to help build the future."
      ]
    }
  ] satisfies OriginStoryChapter[]
};

/** Optional per-file captions; all other images use rotating fallbacks from `slideshowCaptionFallbacks`. */
export const slideshowCaptionOverrides: Record<string, string> = {
  "IMG_0061.jpg": "Proof that debugging and good vibes can coexist.",
  "IMG_0787.jpg": "When the project ships and everything still works on the first deploy.",
  "IMG_7706.jpg": "Weekend mode: recharge, then come back with better ideas.",
  "IMG_7023.jpg": "Face of someone who just fixed a bug that survived three code reviews."
};

export const slideshowCaptionFallbacks = [
  "Real life > perfect lighting.",
  "Core memory unlocked.",
  "Low battery, high serotonin.",
  "Documenting the plot twists.",
  "Yes, I still think about this day.",
  "Debug later; live now.",
  "Proof I do touch grass sometimes.",
  "Main character energy (debug build).",
  "Chaos, but make it aesthetic.",
  "Another slide, another story."
];

export const papers = [
  {
    title: "Predictive Technologies and Justice in Sub-Saharan Africa",
    category: "Research Evaluation",
    file: "/papers/lumiere-research-evaluation.pdf",
    summary:
      "This research and mentor evaluation examines how AI-driven risk and predictive systems can support judicial efficiency in countries such as Kenya and Rwanda while introducing governance and fairness concerns. It balances opportunity with caution by discussing algorithmic bias, data limitations, accountability, and public trust. The work argues for context-aware, rights-preserving implementation frameworks rather than one-size-fits-all imports from Global North models."
  },
  {
    title: "Morality in the Northern Renaissance Workplace",
    category: "Academic Essay",
    file: "/papers/morality-in-the-northern-renaissance-workplace.pdf",
    summary:
      "This rhetorical analysis studies Marinus Van Reymerswaele's painting The Lawyer's Office and interprets it as a warning against professional greed. The essay tracks how visual details and symbolic exaggeration create appeals to ethos, pathos, and logos. Its central argument is that unethical behavior in positions of responsibility produces broader societal damage, not just individual failure."
  },
  {
    title: "Build Your Own Empire: Rhetorical Analysis",
    category: "Academic Essay",
    file: "/papers/build-your-own-empire-rhetorical-analysis.pdf",
    summary:
      "Based on an interview with entrepreneur Isaac Basomingera, this paper analyzes how rhetoric can persuade audiences to prioritize impact over profit. It highlights the use of ethos through lived credibility, logos through measurable outcomes, and pathos through personal transformation stories. The essay frames success as purpose-driven work that expands opportunity for others."
  },
  {
    title: "Further Up & Further In Discussion Guide",
    category: "Reference / Study Material",
    file: "/papers/further-up-further-in-discussion-guide.pdf",
    summary:
      "This guide presents key C.S. Lewis themes for reflective discussion, including reason and faith, moral law, suffering, prayer, and intellectual humility. It pairs quotations with deeper prompts that encourage both analytical and personal engagement. The document is especially useful for structured group dialogue around worldview, ethics, and meaning."
  },
  {
    title: "Lumiere Research Scholar Program Certificate",
    category: "Recognition",
    file: "/papers/lumiere-program-certificate.pdf",
    summary:
      "This certificate confirms successful completion of the Lumiere Research Scholar Program (2024 Fall Cohort). It supports the broader research profile shown across the portfolio."
  }
];
