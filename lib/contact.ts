export const CONTACT_TOPICS = [
  { value: "internship", label: "Internship or recruiting" },
  { value: "collaboration", label: "Collaboration or project idea" },
  { value: "research", label: "Research / CVRL / ML question" },
  { value: "project", label: "Question about a specific project" },
  { value: "other", label: "Something else" }
] as const;

export type ContactTopicValue = (typeof CONTACT_TOPICS)[number]["value"];

export const CONTACT_PROJECT_OPTIONS = [
  { value: "intro_to_iris_recognition", label: "Intro to Iris Recognition" },
  { value: "image-quality-cnn", label: "Image Quality CNN" },
  { value: "trading-model", label: "Trading Model" },
  { value: "cicd-internship-page", label: "CI/CD Self-Updating Internship Page" },
  { value: "tumor-classification", label: "Tumor Classification" },
  { value: "nanochat-replica", label: "Nanochat" },
  { value: "sketching_with_fouriers", label: "Sketching with Fouriers" },
  { value: "brilliantsciences", label: "Brilliant Sciences" },
  { value: "PRINCOMP_FINAL_PREOJECT", label: "NYC Taxi Plots" },
  { value: "other-project", label: "Another project" }
] as const;

export function topicLabel(value: string | undefined): string {
  return CONTACT_TOPICS.find((topic) => topic.value === value)?.label ?? "General question";
}

export function projectLabel(value: string | undefined): string | null {
  if (!value) return null;
  return CONTACT_PROJECT_OPTIONS.find((project) => project.value === value)?.label ?? value;
}

export function isContactTopic(value: string): value is ContactTopicValue {
  return CONTACT_TOPICS.some((topic) => topic.value === value);
}
