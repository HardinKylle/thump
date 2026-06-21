# Changelog

Maintained by the Scribe. One entry per verified milestone.

## Randomize pattern — 2026-06-20
- **What:** Added a RANDOM button to the preset strip that fills the step grid with a musically-plausible random beat; new pure helper `createRandomPattern()` in src/state/sequencer.ts, wired via a handler in App.tsx, button (dice glyph ⚄ + accent color) in PresetStrip.tsx.
- **Who:** Frontend Developer (Gemini) implemented it and did a 2-round design fix; Implementer (Codex) wrote the unit tests; Reviewer (Codex) reviewed the diff (CONVERGED, no bugs); Design Critic (Gemini) judged composition (round 1 FAIL 4/10 → round 2 PASS 8/10); QA (Gemini, this run) ran the official checks.
- **Why:** Run as a light feature to exercise the full team loop; the design convergence loop caught a real regression (RANDOM crowded the CLEAR button to the edge) plus a font mismatch, fixed in round 2.
- **Verified:** `npm run build` green; `npm test` 7/7 (includes createRandomPattern invariant tests); behavioral shot click populated the grid with no console errors; mechanical gate OPEN (DESIGN-CRITIC: PASS + QA: PASS in feed.log).
- **Commit:** uncommitted (working tree)
