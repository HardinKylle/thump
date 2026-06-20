import { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { createSequencerAudioEngine, type SequencerAudioEngine } from './audio/engine';
import { StepGridFrame } from './components/StepGridFrame';
import { TrackRail } from './components/TrackRail';
import { TransportBar } from './components/TransportBar';
import { defaultSequencerState } from './state/sequencer';

export default function App() {
  const engineRef = useRef<SequencerAudioEngine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [, setPlayheadStep] = useState<number | null>(null);

  useEffect(() => {
    const engine = createSequencerAudioEngine({
      bpm: defaultSequencerState.bpm,
      pattern: defaultSequencerState.pattern,
    });
    const unsubscribePlayhead = engine.subscribePlayhead(setPlayheadStep);

    engineRef.current = engine;

    return () => {
      unsubscribePlayhead();
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

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

  return (
    <main className="device-shell" aria-label="THUMP groovebox interface">
      <TransportBar
        bpm={defaultSequencerState.bpm}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onStop={handleStop}
      />

      <section className="work-surface" aria-label="Sequencer grid">
        <TrackRail tracks={defaultSequencerState.tracks} />
        <StepGridFrame tracks={defaultSequencerState.tracks} steps={defaultSequencerState.steps} />
      </section>
    </main>
  );
}
