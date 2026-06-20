import type { Track } from '../state/sequencer';

type TrackRailProps = {
  tracks: Track[];
};

export function TrackRail({ tracks }: TrackRailProps) {
  return (
    <aside className="track-rail" aria-label="Track rail">
      {tracks.map((track, index) => (
        <div className="track-strip" key={track.id}>
          <span className="track-color" style={{ backgroundColor: track.color }} aria-hidden="true" />
          <span className="track-index">{String(index + 1).padStart(2, '0')}</span>
          <span className="track-name">{track.name}</span>
        </div>
      ))}
    </aside>
  );
}
