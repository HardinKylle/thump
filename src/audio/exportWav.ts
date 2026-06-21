import * as Tone from 'tone';
import { createDrumInstruments } from './instruments';
import { STEP_COUNT, TRACK_IDS, type SequencerPattern, type TrackControls } from '../state/sequencer';
import { SWING_SUBDIVISION, clampSwing } from './swing';

export type ExportWavOptions = {
  bpm: number;
  swing?: number;
  pattern: SequencerPattern;
  accents: SequencerPattern;
  trackControls: TrackControls;
  bars?: number;
};

export async function exportPatternAsWav({
  bpm,
  swing = 0,
  pattern,
  accents,
  trackControls,
  bars = 2,
}: ExportWavOptions): Promise<string> {
  const buffer = await renderPatternToBuffer({ bpm, swing, pattern, accents, trackControls, bars });
  const wavBlob = encodeToneBufferToWav(buffer);
  const filename = `thump-${createTimestamp()}.wav`;
  downloadBlob(wavBlob, filename);
  return filename;
}

async function renderPatternToBuffer({
  bpm,
  swing,
  pattern,
  accents,
  trackControls,
  bars,
}: Required<ExportWavOptions>): Promise<Tone.ToneAudioBuffer> {
  const duration = getBarsDurationSeconds(bpm, bars);

  return Tone.Offline(({ transport }) => {
    const instruments = createDrumInstruments();
    const hasSolo = TRACK_IDS.some((trackId) => trackControls[trackId].solo);

    transport.bpm.value = bpm;
    transport.swingSubdivision = SWING_SUBDIVISION;
    transport.swing = clampSwing(swing);

    for (let bar = 0; bar < bars; bar += 1) {
      for (let step = 0; step < STEP_COUNT; step += 1) {
        transport.schedule((time) => {
          for (const trackId of TRACK_IDS) {
            const trackControl = trackControls[trackId];

            if (
              pattern[trackId][step] &&
              !trackControl.muted &&
              (!hasSolo || trackControl.solo) &&
              trackControl.level > 0
            ) {
              const accentGain = accents[trackId][step] ? 1 : 0.68;
              instruments.voices[trackId].trigger(time, accentGain * trackControl.level);
            }
          }
        }, getStepTransportPosition(bar, step));
      }
    }

    transport.start(0);
  }, duration, 2);
}

function encodeToneBufferToWav(buffer: Tone.ToneAudioBuffer): Blob {
  const channelCount = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const sampleCount = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = channelCount * bytesPerSample;
  const dataSize = sampleCount * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channelCount, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const channels = Array.from({ length: channelCount }, (_, channel) => buffer.getChannelData(channel));
  let offset = 44;

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    for (let channel = 0; channel < channelCount; channel += 1) {
      const sample = Math.max(-1, Math.min(1, channels[channel][sampleIndex]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += bytesPerSample;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function writeString(view: DataView, offset: number, value: string): void {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function getBarsDurationSeconds(bpm: number, bars: number): number {
  return (60 / bpm) * 4 * bars;
}

function getStepTransportPosition(bar: number, step: number): string {
  return `${bar}:${Math.floor(step / 4)}:${step % 4}`;
}

function createTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
