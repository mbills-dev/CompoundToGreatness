/**
 * Early-access events, provider-agnostic. No provider is installed yet: when one is chosen (Vercel Web Analytics,
 * Plausible, …) it is wired here and nowhere else. Events carry the placement (`source`) only — never an email
 * address or anything typed into the form.
 *
 *   early_access_view        page shown (signup form)
 *   early_access_signup      the server accepted a signup
 *   early_access_error       the server or network refused it ({ kind: 'invalid' | 'error' })
 *   early_access_confirmed   the post-confirmation landing was shown (not proof of confirmation)
 *
 * Conversion rate = early_access_signup / early_access_view, by source.
 */
type Props = Record<string, string | undefined>;
type Win = Window & { va?: (e: 'event', p: { name: string; data?: Props }) => void; plausible?: (n: string, o?: { props?: Props }) => void };

export function track(name: string, props: Props = {}): void {
  try {
    const w = window as Win;
    if (typeof w.va === 'function') w.va('event', { name, data: props });
    else if (typeof w.plausible === 'function') w.plausible(name, { props });
  } catch {
    /* analytics must never break the page */
  }
}
