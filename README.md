# THUMP

**▶ Live: https://thump-beat.vercel.app**

THUMP is a browser groovebox and step sequencer for building a drum loop fast: pick a preset or click steps into the grid, press play, hear the beat, then export the loop as a WAV.

## Design POV

The interface treats the step grid as the instrument, not a settings panel. The visual language is tactile hardware: warm paper surfaces, near-black ink borders, hard offset shadows, solid color blocks, pressed button states, and a restrained signal-orange playhead.

The target feel is Teenage Engineering OP-1 meets Dieter Rams / Braun: direct, physical, readable at a glance, and built around the central sequencing surface.

## Features

- 4-track drum sequencer: kick, snare, hat, clap
- 16-step interactive grid with on/off and shift-click accent states
- Tone.js drum engine with mute, solo, level, BPM, synced playhead, and live waveform display
- Starter presets: FOUR ON FLOOR, BOOM BAP, HOUSE, BREAKS
- CLEAR control for starting fresh
- Offline WAV export of the current loop via `Tone.Offline`

## Architecture

- `src/components/` - React UI components for transport, presets, track rail, visualizer, and grid
- `src/audio/` - framework-agnostic Tone.js engine, instruments, and WAV export
- `src/state/` - typed sequencer state, defaults, controls, and presets
- `src/lib/` - small shared helpers
- `src/styles/` - global design system and hardware UI styling

## Run

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Libraries

- React + Vite + TypeScript
- Tone.js for synthesis, transport timing, offline rendering, and analysis

## Build Note

THUMP was built by a Claude-orchestrated team: Codex as implementer, with researcher and QA agents feeding Tone.js API guidance and design critique.
