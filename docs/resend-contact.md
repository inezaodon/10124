# Resend setup — portfolio contact form

The **Contact Me** form on the home page (`#contact`) posts to `/api/contact` and sends you email through [Resend](https://resend.com). Visitors pick a topic (internship, collaboration, research, a specific project, or other) and write a question. Replies go to the address they entered (`Reply-To`).

Until `RESEND_API_KEY` is set on the Vercel deployment, the form returns a friendly “not wired yet” error.

## 1. Create a Resend account and API key

1. Sign up at [https://resend.com/signup](https://resend.com/signup) with the inbox you can actually check (your ND email is fine).
2. Open [API Keys](https://resend.com/api-keys) → **Create API Key**.
3. Name it something like `10124-portfolio`. Permission: **Sending access**.
4. Copy the key (`re_…`). You will only see it once.

## 2. Choose a From address

**Testing (works immediately):**

```
CONTACT_FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>
```

Resend’s onboarding sender **only delivers to the email you used to sign up**. Use this to confirm the form works. Do not leave production on this sender if you want mail from strangers to reach you — they can send, but Resend may refuse delivery unless the recipient is your account email.

**Production (recommended):**

1. In Resend, open [Domains](https://resend.com/domains) → **Add Domain**.
2. Add a domain you control (for example `odonineza.com`, or a subdomain like `mail.yourdomain.com`). `*.vercel.app` cannot be verified.
3. Add the DNS records Resend shows (SPF, DKIM, and usually DMARC). Wait until the domain is **Verified**.
4. Then set:

```
CONTACT_FROM_EMAIL=Odon Ineza <hello@YOUR_DOMAIN>
```

The address after `@` must be on that verified domain.

## 3. Choose who receives the messages

`CONTACT_TO_EMAIL` is the inbox (or inboxes) that get the question. Comma-separated is allowed:

```
CONTACT_TO_EMAIL=oineza@nd.edu,inezaodon1@gmail.com
```

If you are still on `onboarding@resend.dev`, **every To address must be the Resend account email** or Resend will reject the send.

## 4. Local `.env.local`

From the repo root:

```bash
cp .env.example .env.local
```

Fill in:

```
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=oineza@nd.edu
CONTACT_FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>
```

Restart `npm run dev`. Submit the form on http://localhost:3000/#contact with your own email as the visitor address. You should receive a message whose subject looks like `[Portfolio] Internship or recruiting — Your Name`.

## 5. Vercel (live site)

In the Vercel project for this repo (Production **and** Preview):

1. **Settings → Environment Variables**
2. Add:

| Name | Value | Environments |
| ---- | ----- | ------------ |
| `RESEND_API_KEY` | `re_…` | Production, Preview |
| `CONTACT_TO_EMAIL` | `oineza@nd.edu` (or both inboxes, comma-separated) | Production, Preview |
| `CONTACT_FROM_EMAIL` | `Portfolio Contact <onboarding@resend.dev>` until the domain is verified, then `Odon Ineza <hello@YOUR_DOMAIN>` | Production, Preview |

3. **Redeploy** (env vars are only picked up on a new build).
4. Open https://10124.vercel.app/#contact, send a test question, and confirm it arrives.

## 6. What the visitor sees

- Required: name, email, topic, question
- If the topic is **Question about a specific project**, they also pick which project
- Success: “Message sent. I’ll get back to you soon.”
- You get the topic, optional project, their question, and can reply directly in your mail client

## Troubleshooting

| Symptom | Likely cause |
| ------- | ------------ |
| “This form is not wired to email on this deployment yet.” | `RESEND_API_KEY` missing on that Vercel environment |
| Provider error mentioning `onboarding@resend.dev` | From-address is the test sender, but `CONTACT_TO_EMAIL` is not the Resend account email |
| `domain is not verified` | Switch From to a verified domain, or temporarily use `onboarding@resend.dev` |
| Mail never arrives | Check [Resend Logs](https://resend.com/emails); spam folder; confirm you redeployed after adding env vars |
