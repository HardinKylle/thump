import { describe, expect, it } from 'vitest';
import {
  STEP_COUNT,
  TRACK_IDS,
  cloneSequencerPattern,
  createEmptySequencerPattern,
  createEmptyStepPattern,
  createRandomPattern,
  defaultDemoPattern,
  defaultSequencerState,
} from './sequencer';

describe('sequencer state', () => {
  it('starts un-swung at 120 BPM with a full 16-step grid', () => {
    expect(defaultSequencerState.swing).toBe(0);
    expect(defaultSequencerState.bpm).toBe(120);
    expect(defaultSequencerState.steps).toBe(STEP_COUNT);
  });

  it('builds empty patterns sized to the step count for every track', () => {
    expect(createEmptyStepPattern()).toHaveLength(STEP_COUNT);
    const empty = createEmptySequencerPattern();
    for (const id of TRACK_IDS) {
      expect(empty[id]).toHaveLength(STEP_COUNT);
      expect(empty[id].some(Boolean)).toBe(false);
    }
  });

  it('deep-clones a pattern so edits do not leak into the source', () => {
    const clone = cloneSequencerPattern(defaultDemoPattern);
    clone.kick[0] = !clone.kick[0];
    expect(clone.kick[0]).not.toBe(defaultDemoPattern.kick[0]);
  });
});

describe('createRandomPattern', () => {
  it('creates varied valid patterns across repeated calls', () => {
    const signatures = new Set<string>();

    for (let i = 0; i < 100; i++) {
      const pattern = createRandomPattern();

      expect(Object.keys(pattern).sort()).toEqual([...TRACK_IDS].sort());
      expect(pattern.kick[0]).toBe(true);

      for (const trackId of TRACK_IDS) {
        const steps = pattern[trackId];

        expect(Array.isArray(steps)).toBe(true);
        expect(steps).toHaveLength(STEP_COUNT);
        expect(steps.every((step) => typeof step === 'boolean')).toBe(true);
        expect(steps.some(Boolean)).toBe(true);
        expect(steps.every(Boolean)).toBe(false);
      }

      signatures.add(JSON.stringify(pattern));
    }

    expect(signatures.size).toBeGreaterThan(1);
  });
});
