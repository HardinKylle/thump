import type { BeatPreset } from '../state/presets';

type PresetStripProps = {
  presets: BeatPreset[];
  activePresetId: string | null;
  onSelectPreset: (preset: BeatPreset) => void;
  onClear: () => void;
  onRandomize: () => void;
};

export function PresetStrip({ presets, activePresetId, onSelectPreset, onClear, onRandomize }: PresetStripProps) {
  return (
    <section className="preset-strip" aria-label="Beat presets">
      <div className="preset-bank">
        {presets.map((preset) => (
          <button
            className="preset-chip"
            type="button"
            aria-pressed={activePresetId === preset.id}
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
          >
            {preset.name}
          </button>
        ))}
      </div>
      <div className="preset-bank" style={{ justifyContent: 'flex-end' }}>
        <button className="preset-chip preset-chip--random" type="button" aria-label="Randomize pattern" title="Generate random beat" onClick={onRandomize}>
          ⚄ RANDOM
        </button>
        <button className="preset-chip preset-chip--clear" type="button" onClick={onClear}>
          CLEAR
        </button>
      </div>
    </section>
  );
}
