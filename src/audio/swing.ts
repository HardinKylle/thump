// Pure swing helpers — Tone-free so they're unit-testable without an AudioContext.

// The default pattern's content sits on the 8th-note grid (offbeat 8ths = the "&"s),
// so shuffle must delay the off-beat 8ths to be audible. '16n' would swing silence.
export const SWING_SUBDIVISION = '8n' as const;

// Tone's transport.swing accepts 0..1. The UI exposes 0..0.66; clamp defensively anyway.
export function clampSwing(amount: number): number {
  return Math.min(1, Math.max(0, amount));
}
