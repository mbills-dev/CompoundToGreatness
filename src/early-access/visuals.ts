/**
 * The featured app visual on /early-access. Every entry is a real capture from the launch build (release-candidate
 * build-15, staging demo account on Day 47); nothing here is a mock-up. Originals and the B/C crops live outside git
 * in ~/Projects/CTG-marketing/captures-2026-11-13 — to switch to concept B or C, add its optimized file to
 * public/early-access/ and an entry below, then point FEATURED at it.
 */
export interface FeaturedVisual {
  /** A real recording plays once (muted) and rests on its last frame; `still` is shown instead for Reduce Motion. */
  video?: { src: string; poster: string };
  still: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  /** 'screen' = a slice of the app screen in a rounded frame; 'canvas' = drawn on the app's black canvas (no frame). */
  frame: 'screen' | 'canvas';
}

export const VISUALS = {
  successStackMotion: {
    video: { src: '/early-access/success-stack-checkoff.mp4', poster: '/early-access/success-stack-checkoff-poster.jpg' },
    still: '/early-access/success-stack-75.jpg',
    width: 760,
    height: 1266,
    alt: 'The Compound to Greatness Today screen on Day 47 of the 77-Day Challenge: three of four Success Stack inputs checked off, 75% complete.',
    caption: 'Today · Day 47 of 77',
    frame: 'screen',
  },
} satisfies Record<string, FeaturedVisual>;

export const FEATURED: FeaturedVisual = VISUALS.successStackMotion;
