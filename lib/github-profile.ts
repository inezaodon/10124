import fs from "fs";
import path from "path";

const README_PATH = path.join(process.cwd(), "content", "github-profile", "README.md");

export function readGithubProfileReadme(): string {
  return fs.readFileSync(README_PATH, "utf-8");
}

/** Pulls GitHub-style bullet lines from the profile README (emoji intros). */
export function parseProfileReadmeBullets(markdown: string): string[] {
  const withoutComments = markdown.replace(/<!---[\s\S]*?--->/g, "").trim();
  return withoutComments
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^-\s+/.test(line))
    .map((line) => line.replace(/^-\s+/, "").trim());
}
