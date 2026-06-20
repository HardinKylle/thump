import type { BeatPreset } from '../state/presets';

type PresetStripProps = {
  presets: BeatPreset[];
  activePresetId: string | null;
  onSelectPreset: (preset: BeatPreset) => void;
  onClear: () => void;
};

export function PresetStrip({ presets, activePresetId, onSelectPreset, onClear }: PresetStripProps) {
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
      <button className="preset-chip preset-chip--clear" type="button" onClick={onClear}>
        CLEAR
      </button>
    </section>
  );
}
