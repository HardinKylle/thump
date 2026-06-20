import { StepGridFrame } from './components/StepGridFrame';
import { TrackRail } from './components/TrackRail';
import { TransportBar } from './components/TransportBar';
import { defaultSequencerState } from './state/sequencer';

export default function App() {
  return (
    <main className="device-shell" aria-label="THUMP groovebox interface">
      <TransportBar bpm={defaultSequencerState.bpm} />

      <section className="work-surface" aria-label="Sequencer grid">
        <TrackRail tracks={defaultSequencerState.tracks} />
        <StepGridFrame tracks={defaultSequencerState.tracks} steps={defaultSequencerState.steps} />
      </section>
    </main>
  );
}
