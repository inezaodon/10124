import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const DEFAULT_TO_EMAIL = "inezaodon1@gmail.com";

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; email?: string; message?: string };

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!resend) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY" },
      { status: 500 }
    );
  }

  const destinationEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: destinationEmail,
      subject: `Portfolio message from ${body.name}`,
      replyTo: body.email,
      text: `From: ${body.name} <${body.email}>\n\n${body.message}`
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email provider error";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
