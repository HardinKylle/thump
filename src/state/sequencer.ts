export type TrackId = 'kick' | 'snare' | 'hat' | 'clap';

export type Track = {
  id: TrackId;
  name: string;
  color: string;
};

export type SequencerState = {
  bpm: number;
  steps: number;
  tracks: Track[];
};

export const defaultSequencerState: SequencerState = {
  bpm: 120,
  steps: 16,
  tracks: [
    { id: 'kick', name: 'KICK', color: '#FF4D1C' },
    { id: 'snare', name: 'SNARE', color: '#36A3FF' },
    { id: 'hat', name: 'HAT', color: '#F6C945' },
    { id: 'clap', name: 'CLAP', color: '#45B36B' },
  ],
};
