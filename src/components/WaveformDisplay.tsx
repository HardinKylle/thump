type WaveformDisplayProps = {
  samples: number[];
};

export function WaveformDisplay({ samples }: WaveformDisplayProps) {
  return (
    <div className="waveform-display" aria-label="Live output waveform">
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
