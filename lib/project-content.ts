export type ProjectContent = {
  slug: string;
  title: string;
  tagline: string;
  shortSummary: string;
  fullDescription: string[];
  highlights: string[];
  stack: string[];
  coverImage: string;
  galleryImage: string;
  liveDeployUrl?: string;
};

export const projectContentMap: Record<string, ProjectContent> = {
  "10124": {
    slug: "10124",
    title: "Portfolio",
    tagline: "A recruiter-first portfolio experience with live signals.",
    shortSummary: "Next.js portfolio with live API integrations, project storytelling, and contact workflows.",
    fullDescription: [
      "This project is my personal portfolio platform, designed to communicate technical ability and product thinking in a clear, visual way. It combines live GitHub data, writing, and contact features into a single experience.",
      "The core goal is to make each project easy to understand quickly: what it solves, how it was built, and why it matters. I focused on responsive design, fast navigation, and a layout that supports both recruiters and collaborators.",
      "I continuously iterate on this repo as my central digital presence, adding richer project case studies, improved visual storytelling, and a more robust content structure."
    ],
    highlights: [
      "Built with modern Next.js App Router architecture and reusable UI sections.",
      "Integrates external APIs for live project and profile context.",
      "Structured for easy updates as new projects and research are published."
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80",
    galleryImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    liveDeployUrl: "https://portlanding.vercel.app"
  },
  "nanochat-replica": {
    slug: "nanochat-replica",
    title: "Nanochat",
    tagline: "A tiny LLM playground focused on core transformer concepts.",
    shortSummary: "Educational GPT-style project to understand tokenization, embeddings, and model behavior in-browser.",
    fullDescription: [
      "NanoChat Replica is a hands-on learning project where I break down core language model concepts into practical components. The aim is not just to use LLM APIs, but to understand how the internals behave.",
      "The project explores model structure, token flow, and generation behavior through a compact implementation that can run in lightweight environments. This makes experimentation quick and transparent.",
      "I use this repository as a deep-learning sandbox to strengthen fundamentals in AI systems, especially where implementation details matter."
    ],
    highlights: [
      "Focuses on first-principles understanding of modern language models.",
      "Designed for experimentation and explainability over black-box usage.",
      "Bridges theoretical AI ideas with practical engineering execution."
    ],
    stack: ["JavaScript", "HTML", "Transformer Concepts", "Model Experimentation"],
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80",
    galleryImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=80"
  },
  brilliantsciences: {
    slug: "brilliantsciences",
    title: "Brilliant Sciences",
    tagline: "Interactive learning platform for students and educators.",
    shortSummary: "Education web platform with course management, progress tracking, and content delivery.",
    fullDescription: [
      "Brilliant Sciences is a learning platform built to make science education accessible, trackable, and more engaging. It supports students with structured content and helps educators manage the learning journey.",
      "The platform emphasizes clarity and usability: students can follow topic-based pathways while instructors can upload materials, evaluate progress, and adapt teaching decisions.",
      "This project reflects my interest in education technology and product design for real-world impact."
    ],
    highlights: [
      "Supports both learner and instructor workflows in one product.",
      "Built around progress visibility and course continuity.",
      "Designed to scale from prototype to production-ready classroom usage."
    ],
    stack: ["React", "Next.js", "JavaScript", "Web Platform Design"],
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80",
    galleryImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80"
  },
  PRINCOMP_FINAL_PREOJECT: {
    slug: "PRINCOMP_FINAL_PREOJECT",
    title: "NYC Taxi Plots",
    tagline: "Data storytelling through interactive mobility visualizations.",
    shortSummary: "Visualization-focused analytics project using multi-page Plotly dashboards for taxi data.",
    fullDescription: [
      "NYC Taxi Analytics presents transportation patterns through structured visual dashboards. The project translates raw trip data into clear, interactive charts that reveal operational and behavioral trends.",
      "Each view is intentionally scoped to a specific angle of analysis, allowing the audience to understand insights progressively rather than through one overloaded dashboard.",
      "The repository demonstrates data communication skills: combining analysis, chart design, and narrative structure to make findings easy to interpret."
    ],
    highlights: [
      "Multi-view dashboard architecture with Plotly visualizations.",
      "Turns dense transport datasets into human-readable stories.",
      "Emphasizes clarity, interpretation, and exploratory insight."
    ],
    stack: ["Python", "Jupyter Notebook", "Plotly", "Data Visualization", "HTML"],
    coverImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=80",
    galleryImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=80"
  },
  sketching_with_fouriers: {
    slug: "sketching_with_fouriers",
    title: "Sketching with Fouriers",
    tagline: "Tracing curves with rotating vectors and complex Fourier series.",
    shortSummary:
      "Interactive visualization of how epicycles and Fourier coefficients reconstruct images and paths from simpler rotating components.",
    fullDescription: [
      "This project explores the geometry behind Fourier synthesis: many small rotating vectors can combine to trace surprisingly intricate shapes, including portraits and custom paths.",
      "The focus is intuition first: seeing phase and amplitude changes reflected in motion makes the mathematics feel concrete rather than abstract.",
      "It doubles as a playground for tuning series depth, comparing reconstruction error, and appreciating how much signal lives in the first few harmonics."
    ],
    highlights: [
      "Epicycle / rotating-vector mental model for complex Fourier series.",
      "Visual feedback loop between coefficients and the traced curve.",
      "Great bridge between linear algebra, complex numbers, and creative coding."
    ],
    stack: ["JavaScript", "Canvas or SVG", "Signal processing", "Visualization"],
    coverImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1400&q=80",
    galleryImage:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80"
  },
  inezaodon: {
    slug: "inezaodon",
    title: "GitHub Profile",
    tagline: "Personal brand and developer identity hub.",
    shortSummary: "Profile repository used to communicate skills, interests, and collaboration direction.",
    fullDescription: [
      "This repository powers my GitHub profile presence. It is a lightweight but important project because it serves as a first impression for collaborators, mentors, and recruiters.",
      "The focus is messaging clarity: what I am building, what I am learning, and where I am headed. Good developer branding is part of good software communication.",
      "I keep this repo aligned with my current interests so my open-source profile remains authentic and up to date."
    ],
    highlights: [
      "Maintains a clear, current public technical identity.",
      "Supports discoverability and collaboration readiness.",
      "Complements project repos with personal engineering context."
    ],
    stack: ["Markdown", "GitHub Profile", "Technical Branding"],
    coverImage: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1400&q=80",
    galleryImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80"
  }
};

export const fallbackProjectContent: Pick<ProjectContent, "coverImage" | "shortSummary"> = {
  coverImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
  shortSummary: "A software project focused on practical engineering and measurable outcomes."
};
