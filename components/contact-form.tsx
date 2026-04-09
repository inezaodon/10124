"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setState("success");
        form.reset();
        return;
      }
    } catch {
      // Network/request failure falls through to error state.
    }

    setState("error");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-semibold">Contact Me</h3>
      <input name="name" required placeholder="Your name" className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
      <input type="email" name="email" required placeholder="Your email" className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
      <textarea name="message" required rows={4} placeholder="Your message" className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
      <button disabled={state === "sending"} className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-500 disabled:opacity-60">
        {state === "sending" ? "Sending..." : "Send Message"}
      </button>
      {state === "success" && <p className="text-sm text-green-600">Message sent successfully.</p>}
      {state === "error" && <p className="text-sm text-red-600">Could not send message. Try again.</p>}
    </form>
  );
}
