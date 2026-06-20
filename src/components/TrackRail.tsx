import type { Track, TrackControls, TrackId } from '../state/sequencer';

type TrackRailProps = {
  tracks: Track[];
  trackControls: TrackControls;
  onToggleMute: (trackId: TrackId) => void;
  onToggleSolo: (trackId: TrackId) => void;
  onLevelChange: (trackId: TrackId, level: number) => void;
};

export function TrackRail({ tracks, trackControls, onToggleMute, onToggleSolo, onLevelChange }: TrackRailProps) {
  return (
    <aside className="track-rail" aria-label="Track rail">
      {tracks.map((track, index) => (
        <div className={`track-strip track-theme--${track.id}`} key={track.id}>
          <span className="track-color" aria-hidden="true" />
          <span className="track-index">{String(index + 1).padStart(2, '0')}</span>
          <span className="track-name">{track.name}</span>

          <div className="track-button-bank" aria-label={`${track.name} controls`}>
            <button
              className="rail-toggle rail-toggle--mute"
              type="button"
              aria-pressed={trackControls[track.id].muted}
              aria-label={`${track.name} mute`}
              onClick={() => onToggleMute(track.id)}
            >
              M
            </button>
            <button
              className="rail-toggle rail-toggle--solo"
              type="button"
              aria-pressed={trackControls[track.id].solo}
              aria-label={`${track.name} solo`}
              onClick={() => onToggleSolo(track.id)}
            >
              S
            </button>
          </div>

          <label className="track-level">
            <span className="mono-label">LVL</span>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(trackControls[track.id].level * 100)}
              aria-label={`${track.name} level`}
              onChange={(event) => onLevelChange(track.id, Number(event.target.value) / 100)}
            />
          </label>
        </div>
      ))}
    </aside>
  );
}
