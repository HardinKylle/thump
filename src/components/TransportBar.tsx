import { WaveformDisplay } from './WaveformDisplay';

type TransportBarProps = {
  bpm: number;
  swing: number;
  isPlaying: boolean;
  isExporting: boolean;
  waveform: number[];
  onPlay: () => void;
  onStop: () => void;
  onExport: () => void;
  onSwingChange: (swing: number) => void;
};

export function TransportBar({
  bpm,
  swing,
  isPlaying,
  isExporting,
  waveform,
  onPlay,
  onStop,
  onExport,
  onSwingChange,
}: TransportBarProps) {
  const swingPercent = Math.round(swing * 100);

  return (
    <header className="transport-bar">
      <div className="brand-lockup" aria-label="THUMP">
        <span className="brand-mark">THUMP</span>
        <span className="brand-subtitle">STEP UNIT 01</span>
      </div>

      <div className="transport-controls" aria-label="Transport controls">
        <button
          className="hardware-button hardware-button--accent"
          type="button"
          aria-pressed={isPlaying}
          onClick={onPlay}
        >
          PLAY
        </button>
        <button className="hardware-button" type="button" onClick={onStop}>
          STOP
        </button>
        <button className="hardware-button hardware-button--export" type="button" disabled={isExporting} onClick={onExport}>
          {isExporting ? 'RENDERING...' : 'EXPORT WAV'}
        </button>
      </div>

      <div className="transport-readouts">
        <WaveformDisplay samples={waveform} />

        <div className="bpm-display" aria-label={`${bpm} BPM`}>
          <span className="mono-label">BPM</span>
          <span className="bpm-value">{bpm}</span>
        </div>

        <label className="swing-control">
          <span className="mono-label">SWING</span>
          <span className="swing-value">{swingPercent}%</span>
          <input
            type="range"
            min="0"
            max="0.66"
            step="0.01"
            value={swing}
            aria-label="Swing amount"
            aria-valuetext={`${swingPercent}%`}
            onChange={(event) => onSwingChange(Number(event.target.value))}
          />
        </label>
      </div>
    </header>
  );
}
