# Early access → Kit

`POST /api/early-access` (`api/early-access.ts`) adds an email address to the CTG early-access list in Kit. The page
calls it from the browser. Only the server holds the Kit key. It does not use Supabase or the old Bolt database
(`beta_signups`, `stripe-webhook`), and it does not touch Resend, which stays for app account email.

## What one signup does

1. Refuses anything that is not a same-origin JSON POST under 4 KB.
2. Drops bots quietly: a filled `company` honeypot, or a submit less than 0.8 s after the page loaded, gets the normal
   success answer and nothing is sent to Kit.
3. Limits, per function instance (best effort): 6 per IP per 10 minutes, 3 per address per hour → 429.
4. Kit v4, with the key in the `X-Kit-Api-Key` header:
   1. `POST /v4/subscribers` `{ email_address, state: "inactive" }` (+ custom fields when switched on). Kit upserts by
      address and never changes an existing subscriber's state, so nobody is reactivated or resubscribed by the API.
   2. `POST /v4/forms/{KIT_EARLY_ACCESS_FORM_ID}/subscribers` `{ email_address, referrer }` (the page URL with UTMs).
   3. `POST /v4/tags/{KIT_EARLY_ACCESS_TAG_ID}/subscribers` `{ email_address }`.
   429, 5xx and network errors are retried twice (0.3 s, 0.9 s). Other failures return a calm 503.
5. Always answers `{ ok: true }` for an accepted address, whether or not it was already on the list.

Logs are one JSON line per request with an outcome code and a 12-character SHA-256 prefix of the address. Neither the
address nor the key is ever logged.

## Consent

- The page's consent line says what people get (the launch email plus occasional updates) and that they confirm by
  email first.
- Only people who submit this form are added. Do not import historical contacts or app accounts into this audience.
  Creating an app account is not marketing consent.
- New addresses are created `inactive`, so Kit sends them no broadcasts until they confirm.

## Not verified yet: the confirmation email

Kit's docs say adding subscribers to a double opt-in form through the *bulk* endpoint sends the form's incentive
(confirmation) email. They say nothing about the single add-to-form endpoint used here. **Until a real inbox test
proves it, assume no confirmation email is sent.** If none is sent, new signups stay `inactive` and never receive
anything. That fails safe, but it fails silently, so this test gates launch.

Fallbacks if the API path does not send it, in order of preference:
1. Post the page's form to Kit's own hosted form endpoint (Kit then runs double opt-in itself). This needs Kit's support
   to confirm that endpoint for custom HTML forms, because it is not in the v4 docs.
2. Keep this function, and have it send a confirmation email of our own that links to a Kit confirmation. This is more
   work and needs a decision.

## One-time setup (owner, in Kit and Vercel)

Kit:
1. Create a form named **CTG Early Access**. Turn on double opt-in and write the incentive email (subject, body,
   "Confirm" button). After confirmation, redirect to `https://www.compoundtogreatness.com/early-access?confirmed=1`.
   Note the numeric form id.
2. Create the tag **CTG - Early Access** and note its numeric id. Optionally, have the form also apply the tag on
   confirmation.
3. Optional: create custom fields `early_access_source` and `early_access_utm`.
4. Create a **new v4 API key** just for the website, so it can be revoked without touching the app's `KIT_API_KEY`.

Vercel (marketing project → Settings → Environment Variables; Preview first, Production only after approval):

| Name | Value |
|---|---|
| `KIT_API_KEY` | the website's v4 key (mark it Sensitive) |
| `KIT_EARLY_ACCESS_FORM_ID` | `10187227` (CTG Early Access) |
| `KIT_EARLY_ACCESS_TAG_ID` | `25842370` (CTG - Early Access) |
| `KIT_EARLY_ACCESS_FIELDS` | leave unset until the custom fields exist, then `on` |

No origin setting is needed: the function accepts the page's own origin (production or any Preview URL) and refuses
everything else. `EARLY_ACCESS_ALLOWED_ORIGINS` exists only for an extra origin.

This repository is public on GitHub. Never commit a key, an `.env` file, or Kit export data.

Recommended: a Vercel Firewall rate-limit rule on `/api/early-access` (for example 10 requests per minute per IP). The
in-function limits reset whenever a new instance starts.

## Verification before launch (Preview deployment, real inbox)

Use addresses the owner controls.

| # | Case | Expect in Kit | Expect in the inbox |
|---|---|---|---|
| 1 | New address | subscriber `inactive`, on the form, tagged | confirmation email (**the unverified part**) |
| 2 | Click confirm in #1 | subscriber `active`, tag kept | redirect to `/early-access?confirmed=1` |
| 3 | Same address again | no duplicate, still one subscriber | nothing new, or one more confirmation if still unconfirmed |
| 4 | Existing active subscriber (e.g. newsletter) | stays `active`, gains the tag | no confirmation needed |
| 5 | Unsubscribed address | stays `cancelled` | none (Kit does not resubscribe through the API) |
| 6 | Honeypot filled / instant submit | nothing in Kit | none |
| 7 | 7 quick submits from one IP | 7th gets 429 | none |
| 8 | Wrong key in Preview | page shows "couldn't save" | none |

Local checks: `npm test` (server against a fake Kit + browser signup module), `npm run typecheck:api`.
`npm run dev` serves `/early-access` with the real handler against a fake Kit (see `vite.config.ts`): `…+fail@…`,
`…+slow@…` and `…+bad@…` addresses exercise the error, loading and rejected-address states.

## The page

`/early-access` is its own Vite entry (`early-access/index.html` → `src/early-access/`), with its own title, share
image (`public/early-access/og-early-access.jpg`) and plain CSS; `vercel.json` routes `/early-access` to it.
`/early-access?confirmed=1` is the landing Kit redirects to after Confirm. It shows "You're on the list." but is not
proof of confirmation: Kit is the record.

The featured visual is set in `src/early-access/visuals.ts` (real captures only; originals outside git in
`~/Projects/CTG-marketing/captures-2026-11-13`). Analytics events are defined in `src/early-access/analytics.ts` and
are no-ops until a provider is chosen. They never include the email address.
