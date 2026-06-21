import { describe, expect, it } from 'vitest';
import { SWING_SUBDIVISION, clampSwing } from './swing';

describe('swing helpers', () => {
  it('delays the offbeat 8ths so the default pattern actually swings', () => {
    // Regression guard: the default pattern sits on the 8th grid; '16n' would swing silence.
    expect(SWING_SUBDIVISION).toBe('8n');
  });

  it('passes through in-range swing untouched', () => {
    expect(clampSwing(0)).toBe(0);
    expect(clampSwing(0.5)).toBe(0.5);
    expect(clampSwing(0.66)).toBe(0.66);
  });

  it('clamps out-of-range swing to [0, 1]', () => {
    expect(clampSwing(-0.3)).toBe(0);
    expect(clampSwing(2)).toBe(1);
  });
});
