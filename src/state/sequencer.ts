export type TrackId = 'kick' | 'snare' | 'hat' | 'clap';

export const STEP_COUNT = 16;

export const TRACK_IDS = ['kick', 'snare', 'hat', 'clap'] as const satisfies readonly TrackId[];

export type Track = {
  id: TrackId;
  name: string;
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

export type TrackControlState = {
  muted: boolean;
  solo: boolean;
  level: number;
};

export type TrackControls = Record<TrackId, TrackControlState>;

export type SequencerState = {
  bpm: number;
  steps: number;
  tracks: Track[];
  pattern: SequencerPattern;
  accents: SequencerPattern;
  trackControls: TrackControls;
};

export function createEmptyStepPattern(): StepPattern {
  return [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
}

export function createEmptySequencerPattern(): SequencerPattern {
  return {
    kick: createEmptyStepPattern(),
    snare: createEmptyStepPattern(),
    hat: createEmptyStepPattern(),
    clap: createEmptyStepPattern(),
  };
}

export const defaultDemoPattern: SequencerPattern = {
  kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
  snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
  hat: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
  clap: [false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false],
};

export const defaultDemoAccents: SequencerPattern = {
  kick: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
  snare: createEmptyStepPattern(),
  hat: createEmptyStepPattern(),
  clap: createEmptyStepPattern(),
};

export const defaultTrackControls: TrackControls = {
  kick: { muted: false, solo: false, level: 0.9 },
  snare: { muted: false, solo: false, level: 0.82 },
  hat: { muted: false, solo: false, level: 0.72 },
  clap: { muted: false, solo: false, level: 0.78 },
};

export const defaultSequencerState: SequencerState = {
  bpm: 120,
  steps: STEP_COUNT,
  tracks: [
    { id: 'kick', name: 'KICK' },
    { id: 'snare', name: 'SNARE' },
    { id: 'hat', name: 'HAT' },
    { id: 'clap', name: 'CLAP' },
  ],
  pattern: defaultDemoPattern,
  accents: defaultDemoAccents,
  trackControls: defaultTrackControls,
};

export function cloneSequencerPattern(pattern: SequencerPattern): SequencerPattern {
  return {
    kick: [...pattern.kick],
    snare: [...pattern.snare],
    hat: [...pattern.hat],
    clap: [...pattern.clap],
  };
}

export function cloneTrackControls(trackControls: TrackControls): TrackControls {
  return {
    kick: { ...trackControls.kick },
    snare: { ...trackControls.snare },
    hat: { ...trackControls.hat },
    clap: { ...trackControls.clap },
  };
}
