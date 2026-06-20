import type { ReactNode } from 'react';
import type { Track, TrackId, SequencerPattern } from '../state/sequencer';
import { range } from '../lib/range';

export type StepEditMode = 'toggle' | 'accent';

type StepGridFrameProps = {
  tracks: Track[];
  steps: number;
  pattern: SequencerPattern;
  accents: SequencerPattern;
  playheadStep: number | null;
  onStepPress: (trackId: TrackId, step: number, mode: StepEditMode) => void;
};

export function StepGridFrame({ tracks, steps, pattern, accents, playheadStep, onStepPress }: StepGridFrameProps) {
  return (
    <div className="grid-frame" aria-label={`${tracks.length} track by ${steps} step sequencer grid`}>
      <div className="grid-top-rule" aria-hidden="true">
        {range(steps).map((step) => (
          <FragmentWithGutter key={step} step={step}>
            <span className={getMarkerClassName(step, playheadStep)}>{step + 1}</span>
          </FragmentWithGutter>
        ))}
      </div>

      <div className="step-grid" role="grid" aria-label="Step pattern">
        {tracks.map((track) => (
          <div className={`step-row track-theme--${track.id}`} role="row" key={track.id}>
            {range(steps).map((step) => {
              const isOn = pattern[track.id][step];
              const isAccented = accents[track.id][step];
              const isPlayhead = playheadStep === step;

              return (
                <FragmentWithGutter key={`${track.id}-${step}`} step={step}>
                  <button
                    className={getStepClassName(isOn, isAccented, isPlayhead)}
                    type="button"
                    aria-pressed={isOn}
                    aria-label={getStepLabel(track.name, step, isOn, isAccented)}
                    title="Shift-click to accent"
                    onClick={(event) => onStepPress(track.id, step, event.shiftKey ? 'accent' : 'toggle')}
                  />
                </FragmentWithGutter>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

type FragmentWithGutterProps = {
  children: ReactNode;
  step: number;
};

function FragmentWithGutter({ children, step }: FragmentWithGutterProps) {
  return (
    <>
      {children}
      {hasBeatGutterAfter(step) ? <span className="beat-gutter" aria-hidden="true" /> : null}
    </>
  );
}

function hasBeatGutterAfter(step: number): boolean {
  return step === 3 || step === 7 || step === 11;
}

function getMarkerClassName(step: number, playheadStep: number | null): string {
  return ['step-marker', playheadStep === step ? 'step-marker--playhead' : ''].filter(Boolean).join(' ');
}

function getStepClassName(isOn: boolean, isAccented: boolean, isPlayhead: boolean): string {
  return [
    'step-cell',
    isOn ? 'step-cell--on' : '',
    isOn && isAccented ? 'step-cell--accent' : '',
    isPlayhead ? 'step-cell--playhead' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function getStepLabel(trackName: string, step: number, isOn: boolean, isAccented: boolean): string {
  const stepState = isOn ? (isAccented ? 'on accented' : 'on') : 'off';
  return `${trackName} step ${step + 1} ${stepState}`;
}
