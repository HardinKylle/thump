import type { SequencerPattern } from './sequencer';
import { createEmptySequencerPattern, createEmptyStepPattern, defaultDemoAccents, defaultDemoPattern } from './sequencer';

export type BeatPreset = {
  id: string;
  name: string;
  pattern: SequencerPattern;
  accents: SequencerPattern;
};

export const beatPresets: BeatPreset[] = [
  {
    id: 'four-on-floor',
    name: 'FOUR ON FLOOR',
    pattern: defaultDemoPattern,
    accents: defaultDemoAccents,
  },
  {
    id: 'boom-bap',
    name: 'BOOM BAP',
    pattern: {
      kick: [true, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false],
      snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      clap: createEmptyStepPattern(),
    },
    accents: {
      kick: [true, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
      snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hat: createEmptyStepPattern(),
      clap: createEmptyStepPattern(),
    },
  },
  {
    id: 'house',
    name: 'HOUSE',
    pattern: {
      kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      snare: createEmptyStepPattern(),
      hat: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
      clap: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    },
    accents: {
      kick: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
      snare: createEmptyStepPattern(),
      hat: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
      clap: createEmptyStepPattern(),
    },
  },
  {
    id: 'breaks',
    name: 'BREAKS',
    pattern: {
      kick: [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false],
      snare: [false, false, false, false, true, false, false, false, false, false, true, false, true, false, false, false],
      hat: [true, false, true, true, false, true, true, false, true, false, true, true, false, true, false, true],
      clap: [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
    },
    accents: {
      kick: [true, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false],
      snare: [false, false, false, false, true, false, false, false, false, false, true, false, true, false, false, false],
      hat: createEmptyStepPattern(),
      clap: [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
    },
  },
];

export function createClearedPresetState(): Pick<BeatPreset, 'pattern' | 'accents'> {
  return {
    pattern: createEmptySequencerPattern(),
    accents: createEmptySequencerPattern(),
  };
}
