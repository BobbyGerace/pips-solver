# Pips Solver

A web app for building and solving NYT Pips puzzles.

## Stack

- Vite + React 19 + TypeScript
- CSS Modules for styling (no Tailwind)
- `npm run dev` to start the dev server

## Project structure

```
src/
  lib/          # Non-React logic (game model, solver)
  App.tsx       # Root component
  index.css     # Global styles
```

## Architecture: The Mullet Pattern

The core data model lives in `src/lib/game-model.ts` and uses mutable OOP classes internally (for solver performance), but exposes immutable snapshots to React via the `useGame` hook. The model implements an observer pattern; the hook subscribes and calls `setState` on each publish.

- **`Game`** — top-level container. Cells are stored in a `Map<string, Cell>` keyed by `"row,col"`.
- **`Domino`** — always normalized so `left <= right` (important for the solver to avoid treating 3|5 and 5|3 as distinct). `placement` is `{ left: Cell, right: Cell } | null`.
- **`Cell`** — knows its `contents` (which domino occupies it and which side).
- **`Constraint`** — a colored group of cells with a rule (`not-equal`, `equal`, `sum-equal`, etc.). `satisfied()` doubles as a pruning check: returns true if the constraint is fully met, or still satisfiable if cells are only partially occupied.
- **`GameData`** — the plain-object snapshot passed to React. `placedDominos` includes `cell` (anchor coordinates), `anchor` (`"left" | "right"` — which pip is at the anchor cell), and `rotation` (0–3).
- **`useGame`** — returns `GameData & GameActions`. Actions mutate the `Game` instance and trigger a publish.

## Decisions made

- No loading/solving state in `GameData` for now — solve is synchronous and expected to be fast enough.
- `GameData.cells` is a flat array with no contents; the renderer layers components and doesn't need to join cells to their occupants directly.
- O(n) joins in the renderer are acceptable.
- Domino and Constraint both get unique ids from a module-level counter (`getUniqueId()`).
- `solve()` on `GameActions` returns void for now.
- localStorage persistence is planned but not yet implemented (stubbed `useEffect` in `useGame`).
