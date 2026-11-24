# Early access → Kit

`POST /api/early-access` (`api/early-access.ts`) adds an email address to the CTG early-access list in Kit. The page
calls it from the browser. Only the server holds the Kit key. It does not use Supabase or the old Bolt database
(`beta_signups`, `stripe-webhook`), and it does not touch Resend, which stays for app account email.

## What one signup does

1. Refuses anything that is not a same-origin JSON POST under 4 KB.
2. Drops bots quietly: a filled `company` honeypot, or a submit less than 0.8 s after the page loaded, gets the normal
   success answer and nothing is sent to Kit.
3. Limits, per function instance (best effort): 6 per IP per 10 minutes, 3 per address per hour → 429.
4. Kit v4, with the key in the `X-Kit-Api-Key` header. **First a read-only lookup**,
   `GET /v4/subscribers?email_address=…&status=all`. Nothing in Kit is changed until it answers clearly. Then, by the
   address's current status:

   | Kit status | What the function does | Log outcome |
   |---|---|---|
   | not in Kit | `POST /v4/subscribers` `{ email_address, state: "inactive" }` → `POST /v4/forms/{form}/subscribers` `{ email_address, referrer }` (Kit sends the confirmation email) → `POST /v4/tags/{tag}/subscribers` | `ok_new` |
   | `active` (confirmed) | keep the status; **no** form add (no confirmation email); apply the tag | `ok_existing_tagged` |
   | `inactive` (unconfirmed) | nothing: their confirmation is already pending, so no repeat email | `pending_unchanged` |
   | `cancelled` (unsubscribed), `complained`, `bounced`, `blocked` | **nothing**: no form, no tag, no email, no reactivation | `suppressed` |
   | lookup fails, unknown state (e.g. `cold`), several matches, rows that don't match the address, no list | nothing; 503 "couldn't save" (fail closed) | `lookup_failed` / `lookup_ambiguous` |

   429, 5xx and network errors are retried twice (0.3 s, 0.9 s), for the lookup and for each change.
5. Every accepted path answers `{ ok: true }` with the same bytes, so the browser never learns whether or how an
   address is already in Kit. The page says "You're one step closer. If you're new here, check your inbox for a
   confirmation email from Compound to Greatness."

Trade-off of the status rules: someone who unsubscribed, or who has an old unconfirmed record, cannot re-join through
this page; they would contact support (a Kit re-subscribe needs a fresh confirmation, which only Kit can send).

Logs are one JSON line per request with an outcome code (plus the Kit state for `suppressed`) and a 12-character
SHA-256 prefix of the address. Neither the address, the key nor subscriber details are ever logged.

## Consent

- The page's consent line says what people get (the launch email plus occasional updates) and that they confirm by
  email first.
- Only people who submit this form are added. Do not import historical contacts or app accounts into this audience.
  Creating an app account is not marketing consent.
- New addresses are created `inactive`, so Kit sends them no broadcasts until they confirm.

## Verified: double opt-in (real inbox, 2026-11-13)

Kit's docs only say the *bulk* endpoint sends a double opt-in form's incentive email. A real test on the Vercel Preview
(form 10187227, tag 25842370, an owner-controlled address) showed the single add-to-form endpoint used here sends it
too. Checked in the Kit dashboard:

| Step | Result |
|---|---|
| Submit a new address once | `200`; page shows "Almost there. Check your inbox." |
| Kit right after | exactly 1 subscriber, **Unconfirmed**; form CTG Early Access "Unconfirmed"; tag CTG - Early Access applied |
| Confirmation email | Kit sent the form's incentive email ("One more step — you're on your way!") |
| Owner clicks Confirm | subscriber **Confirmed**; form "Subscribed"; tag kept; still 1 record |

Note: Kit's subscriber list shows only **Confirmed** people by default. Add "Unconfirmed" to the Status filter to see
pending early-access signups.

Kit redirects confirmed people to the production URL `/early-access?confirmed=1`. Until the page is live in production,
that URL shows the old site, so no real signups before the production deploy.

### Duplicate signup (2026-11-13)

The same, already confirmed address was submitted once more on the Preview: `200`, same success screen. Kit: still
exactly 1 subscriber, still **Confirmed**, tag unchanged, and no new email in the subscriber's email history (only the
original confirmation).

### Previously unsubscribed contact: first run FAILED (2026-11-13), fixed by the status lookup

Setup (owner-approved): a second owner-controlled address was added in Kit as a single subscriber (the dialog's
"Identify this subscriber with a new tag" option is on by default and was switched off; no tag, form or sequence), then
unsubscribed in Kit (status Unsubscribed / `cancelled`, no tags, no emails).

First run, with the original function (no lookup), one Preview submission:

| Check | Result |
|---|---|
| Stays unsubscribed | yes, still Unsubscribed / Cancelled |
| One record | yes |
| No confirmation email | **no: Kit sent it the form's confirmation email** |
| Not added to marketing | added to the CTG Early Access form as "Unconfirmed"; no sequence |
| Tag | CTG - Early Access attached |

Adding an unsubscribed address to a double opt-in form makes Kit send a re-opt-in confirmation (clicking it would most
likely resubscribe the address). Owner decision: never automatically email people who unsubscribed. The function now
looks up the status first and leaves `cancelled`, `complained`, `bounced` and `blocked` addresses untouched.

### Retest with the status lookup: PASSED (2026-11-13, commit 802fafb, Preview)

Same unsubscribed address, submitted once on the new Preview. Baseline recorded first (artifacts of the failed run,
not new failures): Unsubscribed, 1 record, 1 email in history (the earlier confirmation), tag CTG - Early Access,
form CTG Early Access "Unconfirmed".

| Check | Result |
|---|---|
| Page | `200`; "You're one step closer." (same screen as any signup) |
| Server decision (Vercel log) | `{"evt":"early_access","outcome":"suppressed","state":"cancelled","ref":"…"}`: no email, key or details |
| Status | still Unsubscribed / Cancelled; not reactivated |
| Records | still exactly 1 |
| Emails | still exactly 1 (the old one): no new confirmation email |
| Form / tag | unchanged from the baseline: no new form add, no new tag |

The duplicate test above ran before this change. With the status lookup, a confirmed address now gets the tag only
(no form add), which the automated tests cover.

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
image (`public/early-access/og-someday.jpg`) and plain CSS; `vercel.json` routes `/early-access` to it.
`/early-access?confirmed=1` is the landing Kit redirects to after Confirm. It shows "You're on the list." but is not
proof of confirmation: Kit is the record.

The featured visual is set in `src/early-access/visuals.ts` (real captures only; originals outside git in
`~/Projects/CTG-marketing/captures-2026-11-13`). Analytics events are defined in `src/early-access/analytics.ts` and
are no-ops until a provider is chosen. They never include the email address.

## Messaging (owner-approved 2026-11-24)

- Launch campaign headline: **Someday is not a day.** (page `<h1>`, page title, share image)
- Core brand tagline: **Small daily actions. Extraordinary results.** (meta description, share image, `?confirmed=1`)
- Call to action line: **Your Day One starts now.**

Share image: `public/early-access/og-someday.jpg` (1200 × 630, ~180 KB JPEG), referenced by absolute URL in
`early-access/index.html` only; the main site's `index.html` metadata is separate and unchanged. The previous
`og-early-access.jpg` is kept so links already shared keep a valid image until platforms re-scrape.

## Background photo: source and licence (verified 2026-11-24)

| | |
|---|---|
| Files | `public/early-access/someday-stairs-{1000,2000}.jpg`; also cropped into `og-someday.jpg` |
| Source | https://unsplash.com/photos/pwvZxGiyu1E ("Person running up stairs in a snowstorm"), published 2025-03-05 |
| Image | images.unsplash.com/photo-1741175076377-8248180bd1f4 (free library, not Unsplash+) |
| Photographer | Stas Ostrikov, https://unsplash.com/@stasostrikov |
| Licence | Unsplash License, https://unsplash.com/license: irrevocable, non-exclusive, worldwide; commercial use and modification allowed; attribution not required. Not allowed: selling unaltered copies, or compiling Unsplash images into a similar/competing service. Neither applies here. |
| Releases | Unsplash does not supply model/property releases (contributors agree uploads have them; Unsplash gives no guarantee). Users are responsible for third-party rights, e.g. of identifiable people. See help.unsplash.com articles 2612329 and 2646379. |
| Assessment | Subject is photographed from behind, hood up, at night in heavy snow: face not visible, no logos or distinguishing marks, location not identifiable, so not reasonably identifiable. Unsplash's caption calls the subject "a girl" (possibly a minor), another reason to keep the use non-identifying. Used as atmosphere only; nothing states or implies that the person uses or endorses the app. Low risk. Optional extra assurance: ask the photographer (Unsplash message) whether a release exists. |

Display treatment (grayscale, darkening, crop) is CSS only; the files are unaltered downloads.
