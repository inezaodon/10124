"use client";

import { FormEvent, useId, useState } from "react";

type FormState = "idle" | "sending" | "success" | "error";

function userFacingError(code: string | undefined, serverMessage: string): string {
  switch (code) {
    case "EMAIL_NOT_CONFIGURED":
      return "This form is not wired to email on this deployment yet. Use GitHub or your resume links to reach me.";
    case "MISSING_FIELDS":
    case "INVALID_EMAIL":
    case "BAD_REQUEST":
      return serverMessage || "Please check your details and try again.";
    case "PROVIDER_ERROR":
      return serverMessage || "The email service could not send right now. Try again in a few minutes.";
    default:
      return serverMessage.length > 0 ? serverMessage : "Could not send your message. Try again in a moment.";
  }
}

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const statusId = useId();

  function onFieldChange() {
    setErrorMessage(null);
    setState((s) => {
      if (s === "sending") return s;
      if (s === "success" || s === "error") return "idle";
      return s;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
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

      const raw = await response.text();
      let data: { ok?: boolean; error?: string; code?: string } = {};
      try {
        if (raw.trim()) data = JSON.parse(raw) as typeof data;
      } catch {
        if (!response.ok) {
          setErrorMessage("The server returned an unexpected response. Try again in a moment.");
          setState("error");
          return;
        }
        setState("success");
        form.reset();
        return;
      }

      if (response.ok && data.ok !== false) {
        setState("success");
        form.reset();
        return;
      }

      const serverMsg = typeof data.error === "string" ? data.error.trim() : "";
      setErrorMessage(userFacingError(data.code, serverMsg));
      setState("error");
    } catch {
      setErrorMessage("Network error. Check your connection and try again.");
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pop-glass space-y-4 p-8" aria-describedby={statusId}>
      <div>
        <p className="pop-kicker">Get in touch</p>
        <h3 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-zinc-50">Contact Me</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
          I read every message. Replies go to the email you provide.
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={nameId} className="text-sm font-medium text-slate-800 dark:text-zinc-200">
          Name
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          className="pop-input"
          onChange={onFieldChange}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={emailId} className="text-sm font-medium text-slate-800 dark:text-zinc-200">
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          className="pop-input"
          onChange={onFieldChange}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={messageId} className="text-sm font-medium text-slate-800 dark:text-zinc-200">
          Message
        </label>
        <textarea
          id={messageId}
          name="message"
          required
          rows={5}
          placeholder="What would you like to say?"
          className="pop-input resize-y"
          onChange={onFieldChange}
        />
      </div>

      <button
        type="submit"
        disabled={state === "sending"}
        className="pop-btn-primary w-full disabled:pointer-events-none disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send message"}
      </button>

      <div id={statusId} role="status" aria-live="polite" className="min-h-[1.25rem] text-sm">
        {state === "success" && (
          <p className="text-green-700 dark:text-green-400">Message sent. I’ll get back to you soon.</p>
        )}
        {state === "error" && errorMessage && (
          <p className="text-red-700 dark:text-red-400">{errorMessage}</p>
        )}
      </div>
    </form>
  );
}
