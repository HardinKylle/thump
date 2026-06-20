import { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { createSequencerAudioEngine, type SequencerAudioEngine } from './audio/engine';
import { StepGridFrame, type StepEditMode } from './components/StepGridFrame';
import { TrackRail } from './components/TrackRail';
import { TransportBar } from './components/TransportBar';
import {
  TRACK_IDS,
  cloneSequencerPattern,
  cloneTrackControls,
  defaultSequencerState,
  type SequencerPattern,
  type TrackControls,
  type TrackId,
} from './state/sequencer';

type GridState = {
  pattern: SequencerPattern;
  accents: SequencerPattern;
};

export default function App() {
  const engineRef = useRef<SequencerAudioEngine | null>(null);
  const [gridState, setGridState] = useState<GridState>(() => ({
    pattern: cloneSequencerPattern(defaultSequencerState.pattern),
    accents: cloneSequencerPattern(defaultSequencerState.accents),
  }));
  const [trackControls, setTrackControls] = useState<TrackControls>(() =>
    cloneTrackControls(defaultSequencerState.trackControls),
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadStep, setPlayheadStep] = useState<number | null>(null);

  useEffect(() => {
    const engine = createSequencerAudioEngine({
      bpm: defaultSequencerState.bpm,
      pattern: gridState.pattern,
      accents: gridState.accents,
      trackControls,
    });
    const unsubscribePlayhead = engine.subscribePlayhead(setPlayheadStep);

    engineRef.current = engine;

    return () => {
      unsubscribePlayhead();
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.setPattern(gridState.pattern, gridState.accents);
  }, [gridState]);

  useEffect(() => {
    const engine = engineRef.current;

    if (!engine) {
      return;
    }

    for (const trackId of TRACK_IDS) {
      engine.setTrackControl(trackId, trackControls[trackId]);
    }
  }, [trackControls]);

  const handlePlay = useCallback(async () => {
    const engine = engineRef.current;

    if (!engine) {
      return;
    }

    await Tone.start();
    engine.start();
    setIsPlaying(true);
  }, []);

  const handleStop = useCallback(() => {
    engineRef.current?.stop();
    setIsPlaying(false);
    setPlayheadStep(null);
  }, []);

  const handleStepPress = useCallback((trackId: TrackId, step: number, mode: StepEditMode) => {
    setGridState((currentState) => {
      const nextPattern = cloneSequencerPattern(currentState.pattern);
      const nextAccents = cloneSequencerPattern(currentState.accents);

      if (mode === 'accent') {
        nextPattern[trackId][step] = true;
        nextAccents[trackId][step] = !nextAccents[trackId][step];
      } else {
        const nextIsOn = !nextPattern[trackId][step];
        nextPattern[trackId][step] = nextIsOn;
        nextAccents[trackId][step] = false;
      }

      return {
        pattern: nextPattern,
        accents: nextAccents,
      };
    });
  }, []);

  const handleToggleMute = useCallback((trackId: TrackId) => {
    setTrackControls((currentControls) => {
      const nextControls = cloneTrackControls(currentControls);
      nextControls[trackId].muted = !nextControls[trackId].muted;
      return nextControls;
    });
  }, []);

  const handleToggleSolo = useCallback((trackId: TrackId) => {
    setTrackControls((currentControls) => {
      const nextControls = cloneTrackControls(currentControls);
      nextControls[trackId].solo = !nextControls[trackId].solo;
      return nextControls;
    });
  }, []);

  const handleLevelChange = useCallback((trackId: TrackId, level: number) => {
    setTrackControls((currentControls) => {
      const nextControls = cloneTrackControls(currentControls);
      nextControls[trackId].level = level;
      return nextControls;
    });
  }, []);

  return (
    <main className="device-shell" aria-label="THUMP groovebox interface">
      <TransportBar
        bpm={defaultSequencerState.bpm}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onStop={handleStop}
      />

      <section className="work-surface" aria-label="Sequencer grid">
        <TrackRail
          tracks={defaultSequencerState.tracks}
          trackControls={trackControls}
          onToggleMute={handleToggleMute}
          onToggleSolo={handleToggleSolo}
          onLevelChange={handleLevelChange}
        />
        <StepGridFrame
          tracks={defaultSequencerState.tracks}
          steps={defaultSequencerState.steps}
          pattern={gridState.pattern}
          accents={gridState.accents}
          playheadStep={playheadStep}
          onStepPress={handleStepPress}
        />
      </section>
    </main>
  );
}
