export type TrackId = 'kick' | 'snare' | 'hat' | 'clap';

export const STEP_COUNT = 16;

export const TRACK_IDS = ['kick', 'snare', 'hat', 'clap'] as const satisfies readonly TrackId[];

export type Track = {
  id: TrackId;
  name: string;
  color: string;
};

export type StepPattern = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
];

export type SequencerPattern = Record<TrackId, StepPattern>;

export type SequencerState = {
  bpm: number;
  steps: number;
  tracks: Track[];
  pattern: SequencerPattern;
};

export const defaultDemoPattern: SequencerPattern = {
  kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
  hat: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
  clap: [false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false],
};

export const defaultSequencerState: SequencerState = {
  bpm: 120,
  steps: STEP_COUNT,
  tracks: [
    { id: 'kick', name: 'KICK', color: '#FF4D1C' },
    { id: 'snare', name: 'SNARE', color: '#36A3FF' },
    { id: 'hat', name: 'HAT', color: '#F6C945' },
    { id: 'clap', name: 'CLAP', color: '#45B36B' },
  ],
  pattern: defaultDemoPattern,
};

export function cloneSequencerPattern(pattern: SequencerPattern): SequencerPattern {
  return {
    kick: [...pattern.kick],
    snare: [...pattern.snare],
    hat: [...pattern.hat],
    clap: [...pattern.clap],
  };
}
