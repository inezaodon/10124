import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isContactTopic, projectLabel, topicLabel } from "@/lib/contact";

const resendApiKey = process.env.RESEND_API_KEY?.trim();
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const DEFAULT_TO_EMAIL = "oineza@nd.edu";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function providerMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error && typeof (error as { message: unknown }).message === "string") {
    return (error as { message: string }).message;
  }
  return "Email provider rejected the message.";
}

function parseDestinationEmails(raw: string): string[] {
  const unique = new Set<string>();
  for (const part of raw.split(/[,;]/)) {
    const email = part.trim();
    if (emailPattern.test(email)) unique.add(email);
  }
  return [...unique];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string; topic?: string; project?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: "BAD_REQUEST" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const topicRaw = typeof body.topic === "string" ? body.topic.trim() : "";
  const projectRaw = typeof body.project === "string" ? body.project.trim() : "";

  if (!name || !email || !message || !topicRaw) {
    return NextResponse.json(
      { error: "Name, email, topic, and question are required.", code: "MISSING_FIELDS" },
      { status: 400 }
    );
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address.", code: "INVALID_EMAIL" }, { status: 400 });
  }

  if (!isContactTopic(topicRaw)) {
    return NextResponse.json({ error: "Please choose a valid topic.", code: "MISSING_FIELDS" }, { status: 400 });
  }

  if (topicRaw === "project" && !projectRaw) {
    return NextResponse.json(
      { error: "Please choose which project your question is about.", code: "MISSING_FIELDS" },
      { status: 400 }
    );
  }

  if (!resend) {
    return NextResponse.json(
      {
        error: "This site cannot send mail yet (missing email configuration).",
        code: "EMAIL_NOT_CONFIGURED"
      },
      { status: 503 }
    );
  }

  const destinationEmails = parseDestinationEmails(process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL);
  const fromEmail = (process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>").trim();

  if (destinationEmails.length === 0) {
    return NextResponse.json(
      { error: "This site cannot send mail yet (invalid CONTACT_TO_EMAIL).", code: "EMAIL_NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  const about = topicLabel(topicRaw);
  const relatedProject = topicRaw === "project" ? projectLabel(projectRaw) : null;
  const subject = relatedProject
    ? `[Portfolio] ${about} — ${relatedProject} — ${name}`
    : `[Portfolio] ${about} — ${name}`;

  const textLines = [
    `From: ${name} <${email}>`,
    `Topic: ${about}`,
    relatedProject ? `Project: ${relatedProject}` : null,
    "",
    message
  ].filter((line): line is string => line !== null);

  const html = `
    <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
    <p><strong>Topic:</strong> ${escapeHtml(about)}</p>
    ${relatedProject ? `<p><strong>Project:</strong> ${escapeHtml(relatedProject)}</p>` : ""}
    <p><strong>Question:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
  `;

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: destinationEmails,
      subject,
      replyTo: email,
      text: textLines.join("\n"),
      html
    });

    if (error) {
      return NextResponse.json({ error: providerMessage(error), code: "PROVIDER_ERROR" }, { status: 502 });
    }
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Unknown email provider error";
    return NextResponse.json({ error: messageText, code: "PROVIDER_ERROR" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
