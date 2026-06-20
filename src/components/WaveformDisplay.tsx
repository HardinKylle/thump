type WaveformDisplayProps = {
  samples: number[];
};

export function WaveformDisplay({ samples }: WaveformDisplayProps) {
  const isIdle = samples.every((sample) => Math.abs(sample) < 0.01);

  return (
    <div className={`waveform-display${isIdle ? ' waveform-display--idle' : ''}`} aria-label="Live output waveform">
      {samples.map((sample, index) => (
        <span
          className="scope-bar"
          key={index}
          style={{ transform: `scaleY(${Math.max(0.08, Math.min(1, Math.abs(sample)))})` }}
        />
      ))}
    </div>
  );
}
