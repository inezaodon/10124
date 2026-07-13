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
  }
};

export const fallbackProjectContent: Pick<ProjectContent, "coverImage" | "shortSummary"> = {
  coverImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
  shortSummary: "A software project focused on practical engineering and measurable outcomes."
};
