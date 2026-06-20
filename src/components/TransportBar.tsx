type TransportBarProps = {
  bpm: number;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
};

export function TransportBar({ bpm, isPlaying, onPlay, onStop }: TransportBarProps) {
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
      </div>

      <div className="bpm-display" aria-label={`${bpm} BPM`}>
        <span className="mono-label">BPM</span>
        <span className="bpm-value">{bpm}</span>
      </div>
    </header>
  );
}
