type TransportBarProps = {
  bpm: number;
};

export function TransportBar({ bpm }: TransportBarProps) {
  return (
    <header className="transport-bar">
      <div className="brand-lockup" aria-label="THUMP">
        <span className="brand-mark">THUMP</span>
        <span className="brand-subtitle">STEP UNIT 01</span>
      </div>

      <div className="transport-controls" aria-label="Transport controls">
        <button className="hardware-button hardware-button--accent" type="button">
          PLAY
        </button>
        <button className="hardware-button" type="button">
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
