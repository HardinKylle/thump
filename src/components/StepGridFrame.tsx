import type { CSSProperties } from 'react';
import type { Track } from '../state/sequencer';
import { range } from '../lib/range';

type StepGridFrameProps = {
  tracks: Track[];
  steps: number;
};

export function StepGridFrame({ tracks, steps }: StepGridFrameProps) {
  return (
    <div className="grid-frame" aria-label={`${tracks.length} track by ${steps} step sequencer grid`}>
      <div className="grid-top-rule" aria-hidden="true">
        {range(steps).map((step) => (
          <span className="step-marker" key={step}>
            {step + 1}
          </span>
        ))}
      </div>

      <div className="step-grid" aria-hidden="true">
        {tracks.map((track) =>
          range(steps).map((step) => (
            <span
              className="step-cell"
              key={`${track.id}-${step}`}
              style={{ '--track-color': track.color } as CSSProperties}
            />
          )),
        )}
      </div>
    </div>
  );
}
