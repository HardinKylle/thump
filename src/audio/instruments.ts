import * as Tone from 'tone';
import type { TrackId } from '../state/sequencer';

type DrumTrigger = (time: number, velocity: number) => void;

export type DrumVoice = {
  trigger: DrumTrigger;
};

export type DrumInstruments = {
  voices: Record<TrackId, DrumVoice>;
  master: Tone.Gain;
  dispose: () => void;
};

export function createDrumInstruments(): DrumInstruments {
  const masterGain = new Tone.Gain(0.9).connect(Tone.getDestination());

  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 6,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.1 },
  }).connect(masterGain);

  const snareFilter = new Tone.Filter(2000, 'highpass').connect(masterGain);
  const snare = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 },
  }).connect(snareFilter);

  const hat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  }).connect(masterGain);
  hat.volume.value = -12;

  const clap = new Tone.NoiseSynth({
    noise: { type: 'pink' },
    envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.02 },
  }).connect(masterGain);

  return {
    master: masterGain,
    voices: {
      kick: {
        trigger: (time, velocity) => {
          kick.triggerAttackRelease('C1', '8n', time, velocity);
        },
      },
      snare: {
        trigger: (time, velocity) => {
          snare.triggerAttackRelease('16n', time, velocity);
        },
      },
      hat: {
        trigger: (time, velocity) => {
          hat.triggerAttackRelease('C5', '32n', time, velocity);
        },
      },
      clap: {
        trigger: (time, velocity) => {
          clap.triggerAttackRelease('32n', time, velocity);
          clap.triggerAttackRelease('32n', time + 0.01, velocity);
          clap.triggerAttackRelease('32n', time + 0.02, velocity);
        },
      },
    },
    dispose: () => {
      kick.dispose();
      snare.dispose();
      snareFilter.dispose();
      hat.dispose();
      clap.dispose();
      masterGain.dispose();
    },
  };
}
