import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; email?: string; message?: string };

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!resend || !process.env.CONTACT_TO_EMAIL) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY or CONTACT_TO_EMAIL" },
      { status: 500 }
    );
  }

  await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL,
    subject: `Portfolio message from ${body.name}`,
    replyTo: body.email,
    text: body.message
  });

  return NextResponse.json({ ok: true });
}
