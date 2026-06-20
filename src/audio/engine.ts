import * as Tone from 'tone';
import { createDrumInstruments, type DrumInstruments } from './instruments';
import {
  STEP_COUNT,
  TRACK_IDS,
  cloneSequencerPattern,
  defaultDemoPattern,
  type SequencerPattern,
} from '../state/sequencer';

export type PlayheadSubscriber = (step: number | null) => void;

export type SequencerAudioEngineOptions = {
  bpm?: number;
  pattern?: SequencerPattern;
};

export class SequencerAudioEngine {
  private instruments: DrumInstruments;
  private pattern: SequencerPattern;
  private sequence: Tone.Sequence<number>;
  private playheadSubscriber: PlayheadSubscriber | null = null;
  private disposed = false;

  constructor({ bpm = 120, pattern = defaultDemoPattern }: SequencerAudioEngineOptions = {}) {
    this.pattern = cloneSequencerPattern(pattern);
    this.instruments = createDrumInstruments();

    this.sequence = new Tone.Sequence<number>(
      (time, step) => {
        const currentPattern = this.pattern;

        for (const trackId of TRACK_IDS) {
          if (currentPattern[trackId][step]) {
            this.instruments.voices[trackId].trigger(time);
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

  setPattern(pattern: SequencerPattern): void {
    this.assertUsable();
    this.pattern = cloneSequencerPattern(pattern);
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

  dispose(): void {
    if (this.disposed) {
      return;
    }

    const transport = Tone.getTransport();
    transport.stop();
    transport.position = 0;
    this.sequence.dispose();
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
