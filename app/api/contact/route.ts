import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY?.trim();
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const DEFAULT_TO_EMAIL = "inezaodon1@gmail.com";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function providerMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error && typeof (error as { message: unknown }).message === "string") {
    return (error as { message: string }).message;
  }
  return "Email provider rejected the message.";
}

export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = (await request.json()) as { name?: string; email?: string; message?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body", code: "BAD_REQUEST" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required.", code: "MISSING_FIELDS" }, { status: 400 });
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address.", code: "INVALID_EMAIL" }, { status: 400 });
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

  const destinationEmail = (process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL).trim();
  const fromEmail = (process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>").trim();

  if (!emailPattern.test(destinationEmail)) {
    return NextResponse.json(
      { error: "This site cannot send mail yet (invalid CONTACT_TO_EMAIL).", code: "EMAIL_NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: destinationEmail,
      subject: `Portfolio message from ${name}`,
      replyTo: email,
      text: `From: ${name} <${email}>\n\n${message}`
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
