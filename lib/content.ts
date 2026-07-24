import { resumePdfPath, resumeShortPath } from "@/lib/resume-paths";

export const resumeHighlights = {
  name: "Odon Ineza",
  title: "Computer Science Student @ University of Notre Dame",
  pitch:
    "I build practical ML systems and full-stack software that blend research rigor, product thinking, and measurable impact.",
  education: [
    {
      school: "University of Notre Dame",
      degree: "B.S. in Computer Science, Minor in Mathematics",
      detail: "GPA 3.73 / 4.00 | Expected May 2029"
    }
  ],
  experience: [
    {
      role: "Research Intern: Face Image Quality CNN",
      org: "University of Notre Dame",
      period: "June 2026 – August 2026",
      bullets: [
        "Designed and trained a compact SmallResNet (0.33M params) in PyTorch to predict OFIQ face-image quality on 70K FFHQ images (MAE 1.32, Pearson r = 0.866).",
        "Built the model as a frozen differentiable quality critic for GAN training, enabling millisecond OFIQ-like feedback instead of multi-second full scoring.",
        "Delivered a reproducible training/evaluation pipeline plus Streamlit/Flask demos."
      ]
    },
    {
      role: "Full Stack Developer; Front End Developer & Research Intern",
      org: "Pivot Access Ltd",
      period: "Aug 2023 – Jul 2025",
      bullets: [
        "Maintained production infrastructure with Kubernetes, Docker, Prometheus, Grafana, Loki, and New Relic.",
        "Automated CI/CD and monitoring workflows, reducing manual release steps and shortening incident detection time.",
        "Shipped responsive React + Tailwind interfaces and used PostgreSQL/Matplotlib analysis to drive product decisions."
      ]
    }
  ],
  strengths: [
    "Machine learning & computer vision (PyTorch, TensorFlow/Keras, scikit-learn)",
    "Full-stack web development (React, Next.js, Node.js, Flask, FastAPI)",
    "Cloud-native tooling (Docker, Kubernetes, monitoring stacks)",
    "Data analysis and visualization (Python, SQL, Plotly, Matplotlib)"
  ],
  resumePdfPath,
  resumeShortPath
};

/** Long-form personal narrative for the Origin Story overlay on the home page (single essay, no segments). */
export const originStory = {
  launchCta: "Click here if you’re interested in my journey into computer science",
  launchHint: "How memes, Twitter, and a lot of scrolling led me here.",
  paragraphs: [
    "I’m a Rwandan guy, and my journey into computer science didn’t start with code. It started with memes.",
    "I used to spend way too much time on Instagram, mostly because of memes. At some point, though, I thought, “There has to be more elite memes out there.”",
    "That’s how I ended up on Twitter (X), then Discord, then Slack channels, basically migrating across the internet like a meme-hunting specialist.",
    "Somewhere along the way, I came across people like Andrej Karpathy and Dwarkesh Patel. At first, I won’t lie: I followed them for the memes. But then I started actually listening to what they were saying.",
    "That’s when things got dangerous. These guys weren’t just funny. They were talking about AI, the future, how the world is changing, and how fast everything is evolving. Suddenly, my meme feed turned into a low-key education in Machine Learning and Large Language Models.",
    "Next thing I know, I’m a Rwandan guy who came for memes but stayed for neural networks.",
    "What really pulled me in was how fast everything moves. In AI, even something like prompt engineering has a lifespan of about six months before engineers improve the models so much that your “genius trick” becomes basic. That kind of rapid progress is insane, and honestly, kind of addictive to follow.",
    "Now I find myself genuinely interested in careers like Machine Learning Engineering, Inference Engineering, and Systems Engineering. Not just because they’re important, but because they’re shaping the future in real time.",
    "It’s funny: growing up in Rwanda, I didn’t think my path into tech would come from scrolling through memes. But somehow, by following humor, I ended up following people building some of the most advanced technology in the world.",
    "So yeah, maybe in 10 years I’ll be building something impactful too. Maybe I’ll be the next Andrej Karpathy. Maybe even the next Dario Amodei.",
    "Or maybe I’ll just be a guy who came for the memes and accidentally stayed to help build the future."
  ]
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

/** Papers ordered with CS / ML work first. */
export const papers = [
  {
    title: "Face Image Quality Prediction with a Compact CNN",
    category: "ML Research / Tech Report",
    file: "/papers/face-image-quality-cnn-tech-report.pdf",
    summary:
      "Summer research tech report on SmallResNet (0.33M params) for OFIQ face-image quality prediction on FFHQ. Covers motivation for a compact differentiable quality critic, architecture design, anti-overfitting strategy, and evaluation for generative training support under advisors Spencer Giddens and Prof. Adam Czajka."
  },
  {
    title: "Model, Documentation, and Visualization Fixes",
    category: "ML Engineering / Companion Report",
    file: "/papers/face-quality-model-fixes.pdf",
    summary:
      "Companion fix log to the face-quality tech report. Audits ten issues spanning regression-to-the-mean at score extremes, training stability, documentation contradictions, and visualization gaps — with evidence and applied fixes in training, evaluation, and reporting code."
  },
  {
    title: "Brain Tumor MRI Classification",
    category: "Machine Learning Deliverable",
    file: "/papers/brain-tumor-mri-classification.pdf",
    summary:
      "Educational multi-class neuroimaging prototype (glioma, meningioma, pituitary, no tumor) comparing classical and deep learning approaches. Documents the end-to-end pipeline, transfer learning with MobileNetV2, and deployment-oriented evaluation for AME 34351 Machine Learning for Engineers."
  },
  {
    title: "Predictive Technologies and Justice in Sub-Saharan Africa",
    category: "Research Evaluation",
    file: "/papers/lumiere-research-evaluation.pdf",
    summary:
      "This research and mentor evaluation examines how AI-driven risk and predictive systems can support judicial efficiency in countries such as Kenya and Rwanda while introducing governance and fairness concerns. It balances opportunity with caution by discussing algorithmic bias, data limitations, accountability, and public trust. The work argues for context-aware, rights-preserving implementation frameworks rather than one-size-fits-all imports from Global North models."
  },
  {
    title: "Virtuous Engineering Design — Final Project Part 4",
    category: "Engineering Design",
    file: "/papers/virtuous-engineering-final-project-part-4.pdf",
    summary:
      "Team design report for AME 34560 covering stakeholder research, virtues-guided requirements, and ethical engineering specifications for projects such as multilingual bus RTPI displays and rural transport access. Includes subsystem modeling, measures of merit, and concept selection via decision matrices."
  },
  {
    title: "Personal Energy Expenditure on Kylemore Abbey Week 1 Hikes",
    category: "Engineering Analysis",
    file: "/papers/kylemore-abbey-energy-expenditure.pdf",
    summary:
      "Field-based analysis estimating gravitational potential energy expended across four Kylemore Abbey Week 1 hikes. Combines elevation change, summit times, and body mass in a MATLAB potential-energy model, comparing total energy and energy rate across routes."
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
    title: "Lumiere Research Scholar Program Certificate",
    category: "Recognition",
    file: "/papers/lumiere-program-certificate.pdf",
    summary:
      "This certificate confirms successful completion of the Lumiere Research Scholar Program (2024 Fall Cohort). It supports the broader research profile shown across the portfolio."
  }
];
