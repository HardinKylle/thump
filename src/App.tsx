import { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { createSequencerAudioEngine, type SequencerAudioEngine } from './audio/engine';
import { exportPatternAsWav } from './audio/exportWav';
import { PresetStrip } from './components/PresetStrip';
import { StepGridFrame, type StepEditMode } from './components/StepGridFrame';
import { TrackRail } from './components/TrackRail';
import { TransportBar } from './components/TransportBar';
import { beatPresets, createClearedPresetState, type BeatPreset } from './state/presets';
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

const WAVEFORM_BAR_COUNT = 32;

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
  const [isExporting, setIsExporting] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(beatPresets[0].id);
  const [waveform, setWaveform] = useState<number[]>(() => Array.from({ length: WAVEFORM_BAR_COUNT }, () => 0));
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
    let animationFrameId = 0;

    const updateWaveform = () => {
      const engine = engineRef.current;

      if (engine) {
        setWaveform(sampleWaveform(engine.getWaveformData(), WAVEFORM_BAR_COUNT));
      }

      animationFrameId = requestAnimationFrame(updateWaveform);
    };

    animationFrameId = requestAnimationFrame(updateWaveform);

    return () => {
      cancelAnimationFrame(animationFrameId);
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

  const handleExport = useCallback(async () => {
    if (isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      await exportPatternAsWav({
        bpm: defaultSequencerState.bpm,
        pattern: gridState.pattern,
        accents: gridState.accents,
        trackControls,
      });
    } finally {
      setIsExporting(false);
    }
  }, [gridState, isExporting, trackControls]);

  const handleStepPress = useCallback((trackId: TrackId, step: number, mode: StepEditMode) => {
    setActivePresetId(null);
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

  const handleSelectPreset = useCallback((preset: BeatPreset) => {
    setGridState({
      pattern: cloneSequencerPattern(preset.pattern),
      accents: cloneSequencerPattern(preset.accents),
    });
    setActivePresetId(preset.id);
    setPlayheadStep(null);
  }, []);

  const handleClear = useCallback(() => {
    const clearedState = createClearedPresetState();

    setGridState({
      pattern: cloneSequencerPattern(clearedState.pattern),
      accents: cloneSequencerPattern(clearedState.accents),
    });
    setActivePresetId(null);
    setPlayheadStep(null);
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
        isExporting={isExporting}
        waveform={waveform}
        onPlay={handlePlay}
        onStop={handleStop}
        onExport={handleExport}
      />

      <PresetStrip
        presets={beatPresets}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        onClear={handleClear}
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

function sampleWaveform(data: Float32Array, sampleCount: number): number[] {
  const samples: number[] = [];
  const binSize = Math.max(1, Math.floor(data.length / sampleCount));

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    let total = 0;
    const start = sampleIndex * binSize;
    const end = Math.min(data.length, start + binSize);

    for (let dataIndex = start; dataIndex < end; dataIndex += 1) {
      total += Math.abs(data[dataIndex]);
    }

    samples.push(Math.min(1, total / Math.max(1, end - start) * 3.2));
  }

  return samples;
}
