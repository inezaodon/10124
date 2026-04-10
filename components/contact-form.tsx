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
    <form onSubmit={handleSubmit} className="pop-glass space-y-4 p-8">
      <div>
        <p className="pop-kicker">Get in touch</p>
        <h3 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">Contact Me</h3>
      </div>
      <input name="name" required placeholder="Your name" className="pop-input" />
      <input type="email" name="email" required placeholder="Your email" className="pop-input" />
      <textarea name="message" required rows={4} placeholder="Your message" className="pop-input resize-y" />
      <button
        type="submit"
        disabled={state === "sending"}
        className="pop-btn-primary w-full disabled:pointer-events-none disabled:opacity-60"
      >
        {state === "sending" ? "Sending..." : "Send Message"}
      </button>
      {state === "success" && <p className="text-sm text-green-600">Message sent successfully.</p>}
      {state === "error" && <p className="text-sm text-red-600">Could not send message. Try again.</p>}
    </form>
  );
}
