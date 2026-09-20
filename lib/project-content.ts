export type ProjectGalleryImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type ProjectExtraLink = {
  label: string;
  href: string;
  /** When true, also shown on the home-page project card. */
  showOnCard?: boolean;
};

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
  galleryImages?: ProjectGalleryImage[];
  extraLinks?: ProjectExtraLink[];
  liveDeployUrl?: string;
  /** GitHub repo to fetch when the portfolio slug is synthetic (umbrella cards). */
  canonicalGitHubRepo?: string;
};

export function resolveGitHubRepoName(slug: string): string {
  return projectContentMap[slug]?.canonicalGitHubRepo ?? slug;
}

export function getProjectGallery(content?: ProjectContent): ProjectGalleryImage[] {
  if (!content) return [];
  const items: ProjectGalleryImage[] = [];
  const seen = new Set<string>();
  const add = (src?: string, alt?: string, caption?: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    items.push({ src, alt: alt ?? `${content.title} visual`, caption });
  };

  add(content.galleryImage, `${content.title} supporting visual`);
  for (const image of content.galleryImages ?? []) {
    add(image.src, image.alt, image.caption);
  }
  return items;
}

export const projectContentMap: Record<string, ProjectContent> = {
  "image-quality-cnn": {
    slug: "image-quality-cnn",
    title: "Image Quality CNN",
    tagline: "Face image quality prediction with a compact CNN on FFHQ/OFIQ data.",
    shortSummary:
      "SmallResNet-based classifier for face image quality, with a live Streamlit app for interactive scoring.",
    fullDescription: [
      "This project trains a SmallResNet CNN to predict face image quality using FFHQ and OFIQ datasets, turning perceptual quality into a measurable score.",
      "The pipeline covers data preparation, model training, and evaluation, with emphasis on making results accessible through an interactive interface.",
      "A deployed Streamlit app lets users upload images and explore quality predictions without running notebooks locally."
    ],
    highlights: [
      "End-to-end CNN workflow from face datasets to deployed inference UI.",
      "Interactive Streamlit deployment for hands-on quality scoring.",
      "Structured for reproducible experimentation in Jupyter."
    ],
    stack: ["Python", "Jupyter Notebook", "Streamlit", "PyTorch", "Computer Vision"],
    coverImage:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1400&q=80",
    galleryImage:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=80",
    liveDeployUrl: "https://image-quality-cnn-o3zjl95wsj3bwdqevqji7n.streamlit.app"
  },
  "tumor-classification": {
    slug: "tumor-classification",
    title: "Tumor Classification",
    tagline: "Machine learning pipeline for classifying tumor types from data.",
    shortSummary: "Jupyter-based ML project with a live Streamlit app for exploring tumor classification results.",
    fullDescription: [
      "This project applies machine learning to tumor classification, turning raw data into predictions that can support analysis and decision-making.",
      "The workflow covers data preparation, model training, and evaluation, with emphasis on making results accessible through an interactive interface.",
      "A deployed Streamlit app lets users explore the classifier without running notebooks locally."
    ],
    highlights: [
      "End-to-end ML workflow from data to deployed inference UI.",
      "Interactive Streamlit deployment for hands-on exploration.",
      "Structured for reproducible experimentation in Jupyter."
    ],
    stack: ["Python", "Jupyter Notebook", "Streamlit", "Machine Learning"],
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80",
    galleryImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1400&q=80",
    liveDeployUrl: "https://tumor-classification-g2msv3xmrgdva6ssnvecxp.streamlit.app"
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
    coverImage: "/images/projects/andrej-karpathy.webp",
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
  intro_to_iris_recognition: {
    slug: "intro_to_iris_recognition",
    title: "Intro to Iris Recognition",
    tagline: "Overnight study site for Daugman 2004 IrisCodes and Notre Dame’s ArcIris / NIST IREX stack.",
    shortSummary:
      "Interactive briefing of the six-step iris pipeline — NIR capture, rubber-sheet unwrapping, 2,048-bit Gabor IrisCodes, then ArcIris embeddings and IREX metrics — with slides, sources, and a quiz.",
    fullDescription: [
      "This site is a first-night map of iris recognition: Daugman’s 2004 explainer of the IrisCode, then the modern Notre Dame / IREX stack that still starts from the same geometry. Tabs walk through Start here, Pipeline, Daugman 2004 slides, Deep learning, ArcIris, IREX, and a readiness quiz.",
      "The through-line is the six-step chain every method on the reading list shares: NIR capture, localize pupil and iris, rubber-sheet unwrap to polar, encode (classic Gabor phase or a neural embedding), match, and decide. Daugman invented steps 2–5 in the 1990s; ArcIris keeps 2–3 and replaces encode/match with ResNet100 + ArcFace on 512×64 polar images.",
      "The Daugman tab is a full slide walkthrough of How iris recognition works: independence as a Hamming-distance test, HD ≤ 0.32 as a match, ~249 degrees of freedom, left ≠ right, and why iris could search at national scale when faces could not. ArcIris and IREX tabs turn that history into the numbers that matter on messy field data — FNIR at 1% FPIR, FTE, and why quality filtering is a forensic trap.",
      "Built as a static HTML study pack so the pipeline, independence test, and metric alphabet can be rehearsed without opening a paper cover-to-cover."
    ],
    highlights: [
      "Seven-tab study pack: pipeline, 2004 slides, deep learning, ArcIris, IREX, and quiz.",
      "Rubber-sheet unwrap, 2,048-bit IrisCodes, and XOR Hamming-distance independence tests, in plain English.",
      "ArcIris (ResNet100 + ArcFace) vs TripletIris, with NIST IREX ranking language (FNIR @ 1% FPIR, FTE).",
      "Live on Vercel as a self-contained overnight reading site."
    ],
    stack: ["HTML", "CSS", "JavaScript", "Biometrics", "Computer Vision", "Iris recognition"],
    coverImage: "/images/projects/iris-start.png",
    galleryImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1400&q=80",
    galleryImages: [
      {
        src: "/images/projects/iris-pipeline.png",
        alt: "Iris recognition pipeline tab with the six-step chain",
        caption: "Pipeline — capture, localize, unwrap, encode, match, decide."
      },
      {
        src: "/images/projects/iris-daugman.png",
        alt: "Daugman 2004 slide walkthrough",
        caption: "Daugman 2004 slides — independence test and the IrisCode."
      },
      {
        src: "/images/projects/iris-dl.png",
        alt: "Deep learning tab comparing where CNNs help vs IrisCodes",
        caption: "Deep learning — where nets win, and where XOR still wins at scale."
      },
      {
        src: "/images/projects/iris-arciris.png",
        alt: "ArcIris vs TripletIris comparison",
        caption: "ArcIris — ResNet100 + ArcFace on rubber-sheet polar images."
      },
      {
        src: "/images/projects/iris-irex.png",
        alt: "NIST IREX metrics cheat sheet",
        caption: "IREX — FNIR, FPIR, FTE, and the ranking alphabet."
      },
      {
        src: "/images/projects/iris-quiz.png",
        alt: "Iris recognition readiness quiz",
        caption: "Quiz — the questions that mean the pipeline is actually owned."
      },
      {
        src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=80",
        alt: "Camera and lenses used to capture iris texture",
        caption: "Capture — NIR cameras, not RGB selfies, make stromal texture visible."
      }
    ],
    extraLinks: [
      { label: "Start here", href: "https://intro-to-iris-recognition.vercel.app/#home" },
      { label: "Pipeline", href: "https://intro-to-iris-recognition.vercel.app/#pipeline" },
      { label: "Daugman 2004 slides", href: "https://intro-to-iris-recognition.vercel.app/#daugman/1" },
      { label: "ArcIris", href: "https://intro-to-iris-recognition.vercel.app/#arciris" },
      { label: "IREX", href: "https://intro-to-iris-recognition.vercel.app/#irex" },
      { label: "Quiz", href: "https://intro-to-iris-recognition.vercel.app/#quiz" }
    ],
    liveDeployUrl: "https://intro-to-iris-recognition.vercel.app"
  },
  "trading-model": {
    slug: "trading-model",
    title: "Trading Model",
    tagline: "Stochastic calculus research stack for NASDAQ-oriented path simulation, option pricing, and risk.",
    shortSummary:
      "FastAPI + Firebase Hosting umbrella with seven engines: GBM, Brownian motion, Ornstein–Uhlenbeck, Heston, Monte Carlo VaR, rough volatility, and MC option pricing.",
    fullDescription: [
      "Trading Model is an educational stochastic calculus stack aimed at liquid NASDAQ names and index options. Classical Brownian models are the baseline; Markov stochastic volatility (Heston) and rough Bergomi improve realism for fat tails, leverage (ρ < 0), and steep short-maturity implied-vol skews.",
      "Seven interactive engines share one umbrella site: Geometric Brownian Motion (Black–Scholes backbone), Wiener / Brownian paths, Ornstein–Uhlenbeck mean reversion, Heston spot–variance with leverage, Monte Carlo European options vs Black–Scholes, portfolio VaR / CVaR, and rough volatility. Each page exposes parameters, a Run control against the FastAPI backend, and Chart.js visuals.",
      "The repo layers core SDE simulators, NASDAQ-oriented market-data adapters, strategy hooks, and a Node multi-agent orchestrator for parallel simulate / calibrate / backtest work. The public Firebase Hosting site is the demo surface; the API is the research engine. Not investment advice — no live brokerage connectivity.",
      "Use it to see how GBM, OU, Heston, and rough vol actually behave when you change drift, mean reversion, vol-of-vol, or Hurst-like roughness, instead of treating the models as black boxes."
    ],
    highlights: [
      "Umbrella FastAPI + Firebase site covering seven stochastic engines.",
      "GBM, Brownian, OU, Heston, MC options, portfolio VaR/CVaR, and rough Bergomi.",
      "Parameter panels and Chart.js path / risk visuals against a shared backend.",
      "Research-oriented: NASDAQ liquid equities/ETFs and synthetic Wiener paths, not live trading."
    ],
    stack: ["Python", "FastAPI", "Firebase Hosting", "JavaScript", "Chart.js", "Stochastic calculus"],
    coverImage: "/images/projects/trading-home.png",
    galleryImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80",
    galleryImages: [
      {
        src: "/images/projects/trading-gbm.png",
        alt: "Geometric Brownian Motion simulator with SDE parameters",
        caption: "GBM — exact log-Euler equity paths, the Black–Scholes backbone."
      },
      {
        src: "/images/projects/trading-heston.png",
        alt: "Heston stochastic volatility project page",
        caption: "Heston — spot and variance with correlated Brownian motions."
      },
      {
        src: "/images/projects/trading-var.png",
        alt: "Monte Carlo Value-at-Risk project page",
        caption: "Monte Carlo VaR / CVaR on a liquid ETF basket."
      },
      {
        src: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1400&q=80",
        alt: "Market chart and order book on a trading screen",
        caption: "Markets — NASDAQ-oriented framing for research calibration."
      },
      {
        src: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1400&q=80",
        alt: "Laptop, watch, and phone showing candlestick charts",
        caption: "Multi-surface research — paths, vol, and risk in one stack."
      }
    ],
    extraLinks: [
      { label: "Umbrella site", href: "https://trading-model-oineza-8280d.web.app/" },
      { label: "GBM simulator", href: "https://trading-model-oineza-8280d.web.app/projects/gbm" },
      { label: "Heston SV", href: "https://trading-model-oineza-8280d.web.app/projects/heston" },
      { label: "Monte Carlo VaR", href: "https://trading-model-oineza-8280d.web.app/projects/var" }
    ],
    liveDeployUrl: "https://trading-model-oineza-8280d.web.app"
  },
  "cicd-internship-page": {
    slug: "cicd-internship-page",
    title: "CI/CD Self-Updating Internship Page",
    tagline: "Two live internship trackers that refresh from public sources twice a day via GitHub Actions.",
    shortSummary:
      "CS and EE internship boards that fetch SimplifyJobs and underclassmen listings at runtime, with a twice-daily GitHub Actions digest — no manual refresh.",
    fullDescription: [
      "One umbrella for two self-updating trackers. The CS site (ndpeeps_cs_internships) is a daily board of software internships pulled from SimplifyJobs/Summer internships and Underclassmen Opportunities. Views slice the same live JSON by day, big-tech / trading firms, and AI / ML / data roles. The client loads listings and markdown at runtime, so a Vercel deploy stays current without rebuilding the app for every new posting.",
      "The EE clone (ndpeeps_ee_internships) filters hardware-relevant roles: semiconductors and chip design, telecom, controls/robotics, signal/embedded, firmware/FPGA/ASIC, software-adjacent ML, and other hardware R&D. Company names stay large for fast scanning, with career hubs for Intel, NVIDIA, Qualcomm, TSMC, TI, Analog Devices, ASML, and defense labs.",
      "CI/CD is the product. GitHub Actions runs twice a day (~9 AM and ~9 PM Eastern): pull the latest listings, build a digest that highlights underclassmen and big-tech roles, and email it. The pages themselves are Vercel deploys; refreshing the browser is enough because the data is fetched live. A manual “Email today’s digest” control can re-run the workflow when you want an extra pass.",
      "Collapsed here as a single portfolio piece because the CS and EE sites are the same idea — a self-updating internship page — with two tracks and two live URLs."
    ],
    highlights: [
      "Live fetch from SimplifyJobs plus underclassmen sources — the UI is not a frozen scrape.",
      "GitHub Actions cron twice daily (~9 AM / 9 PM ET) pulls listings and emails a digest.",
      "CS tracker: by day, big tech, and AI roles. EE tracker: semiconductors, telecom, controls, embedded, FPGA, and software-adjacent.",
      "Both boards ship on Vercel; opening the site always shows the latest JSON, not last week’s build."
    ],
    stack: ["TypeScript", "React", "Vite", "Vercel", "GitHub Actions", "CI/CD"],
    coverImage: "/images/projects/internships-cs.png",
    galleryImage: "/images/projects/internships-ee.png",
    galleryImages: [
      {
        src: "/images/projects/internships-cs-bigtech.png",
        alt: "CS internship tracker Big tech view",
        caption: "CS tracker — Big tech slice of SimplifyJobs + underclassmen listings."
      },
      {
        src: "/images/projects/internships-ee-semiconductors.png",
        alt: "EE internships semiconductors and chip design track",
        caption: "EE tracker — semiconductors & chip design, grouped by date."
      },
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
        alt: "Analytics dashboard representing live listing metrics",
        caption: "Self-updating dashboards — counts and filters refresh from live JSON."
      },
      {
        src: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1400&q=80",
        alt: "GitHub mascot in front of a laptop",
        caption: "GitHub Actions — twice-daily pull, digest, and email."
      },
      {
        src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
        alt: "Circuit board for electrical engineering internships",
        caption: "EE track — hardware, silicon, firmware, and FPGA roles."
      },
      {
        src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80",
        alt: "Laptop with code editor open",
        caption: "CS track — software, AI, and underclassmen-friendly listings."
      }
    ],
    extraLinks: [
      { label: "CS tracker (live)", href: "https://ndpeeps-cs-internships.vercel.app", showOnCard: true },
      { label: "EE tracker (live)", href: "https://ndpeeps-ee-internships.vercel.app", showOnCard: true },
      { label: "CS GitHub", href: "https://github.com/inezaodon/ndpeeps_cs_internships", showOnCard: true },
      { label: "EE GitHub", href: "https://github.com/inezaodon/ndpeeps_ee_internships", showOnCard: true }
    ],
    liveDeployUrl: "https://ndpeeps-cs-internships.vercel.app",
    canonicalGitHubRepo: "ndpeeps_cs_internships"
  }
};

export const fallbackProjectContent: Pick<ProjectContent, "coverImage" | "shortSummary"> = {
  coverImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
  shortSummary: "A software project focused on practical engineering and measurable outcomes."
};
