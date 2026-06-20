import * as Tone from 'tone';
import { createDrumInstruments, type DrumInstruments } from './instruments';
import {
  STEP_COUNT,
  TRACK_IDS,
  cloneTrackControls,
  cloneSequencerPattern,
  defaultDemoAccents,
  defaultDemoPattern,
  defaultTrackControls,
  type TrackControls,
  type TrackControlState,
  type TrackId,
  type SequencerPattern,
} from '../state/sequencer';

export type PlayheadSubscriber = (step: number | null) => void;

export type SequencerAudioEngineOptions = {
  bpm?: number;
  pattern?: SequencerPattern;
  accents?: SequencerPattern;
  trackControls?: TrackControls;
};

export class SequencerAudioEngine {
  private instruments: DrumInstruments;
  private pattern: SequencerPattern;
  private accents: SequencerPattern;
  private trackControls: TrackControls;
  private sequence: Tone.Sequence<number>;
  private waveform: Tone.Waveform;
  private playheadSubscriber: PlayheadSubscriber | null = null;
  private disposed = false;

  constructor({
    bpm = 120,
    pattern = defaultDemoPattern,
    accents = defaultDemoAccents,
    trackControls = defaultTrackControls,
  }: SequencerAudioEngineOptions = {}) {
    this.pattern = cloneSequencerPattern(pattern);
    this.accents = cloneSequencerPattern(accents);
    this.trackControls = cloneTrackControls(trackControls);
    this.instruments = createDrumInstruments();
    this.waveform = new Tone.Waveform(64);
    this.instruments.master.connect(this.waveform);

    this.sequence = new Tone.Sequence<number>(
      (time, step) => {
        const currentPattern = this.pattern;
        const currentAccents = this.accents;
        const currentTrackControls = this.trackControls;
        const hasSolo = TRACK_IDS.some((trackId) => currentTrackControls[trackId].solo);

        for (const trackId of TRACK_IDS) {
          const trackControl = currentTrackControls[trackId];

          if (
            currentPattern[trackId][step] &&
            !trackControl.muted &&
            (!hasSolo || trackControl.solo) &&
            trackControl.level > 0
          ) {
            const accentGain = currentAccents[trackId][step] ? 1 : 0.68;
            this.instruments.voices[trackId].trigger(time, accentGain * trackControl.level);
          }
        }

        Tone.getDraw().schedule(() => {
          this.playheadSubscriber?.(step);
        }, time);
      },
      Array.from({ length: STEP_COUNT }, (_, step) => step),
      '16n',
    );
    this.sequence.loop = true;
    this.sequence.loopStart = 0;
    this.sequence.loopEnd = STEP_COUNT;
    this.sequence.start(0);

    this.setBpm(bpm);
  }

  start(): void {
    this.assertUsable();
    const transport = Tone.getTransport();

    if (transport.state !== 'started') {
      transport.start();
    }
  }

  stop(): void {
    this.assertUsable();
    const transport = Tone.getTransport();
    transport.stop();
    transport.position = 0;
    this.playheadSubscriber?.(null);
  }

  setBpm(bpm: number): void {
    this.assertUsable();
    Tone.getTransport().bpm.value = bpm;
  }

  setPattern(pattern: SequencerPattern, accents = this.accents): void {
    this.assertUsable();
    this.pattern = cloneSequencerPattern(pattern);
    this.accents = cloneSequencerPattern(accents);
  }

  setTrackControl(trackId: TrackId, trackControl: TrackControlState): void {
    this.assertUsable();
    this.trackControls = {
      ...this.trackControls,
      [trackId]: {
        muted: trackControl.muted,
        solo: trackControl.solo,
        level: clampLevel(trackControl.level),
      },
    };
  }

  subscribePlayhead(subscriber: PlayheadSubscriber): () => void {
    this.assertUsable();
    this.playheadSubscriber = subscriber;

    return () => {
      if (this.playheadSubscriber === subscriber) {
        this.playheadSubscriber = null;
      }
    };
  }

  getWaveformData(): Float32Array {
    this.assertUsable();
    return this.waveform.getValue();
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    const transport = Tone.getTransport();
    transport.stop();
    transport.position = 0;
    this.sequence.dispose();
    this.waveform.dispose();
    this.instruments.dispose();
    this.playheadSubscriber = null;
    this.disposed = true;
  }

  private assertUsable(): void {
    if (this.disposed) {
      throw new Error('SequencerAudioEngine has been disposed.');
    }
  }
}

export function createSequencerAudioEngine(options?: SequencerAudioEngineOptions): SequencerAudioEngine {
  return new SequencerAudioEngine(options);
}

function clampLevel(level: number): number {
  return Math.min(1, Math.max(0, level));
}
