# Decisions — 2026-07-14

## Renderer: SVG

- Page previews render as SVG elements (inline `<svg>`) in the right-hand filmstrip pane.
- Every element type maps directly to an SVG tag: `text` → `<text>`, `rectangle` → `<rect>`, `ellipse` → `<ellipse>`, `image` → `<image>`, `rich_text` → `<foreignObject>`.
- Coordinate system: `viewBox="0 0 11 8.5"` with `width="11in" height="8.5in"`. One SVG unit = 1 inch. No DPI conversion. (Matches Inkscape's approach.)

## Module Architecture

```
src/
  app.js        — UI controller: events, debounce, filmstrip, error badge
  state.js      — In-memory file store (extend as needed)
  parser.js     — Forest builder + inheritance resolver + validation
  renderer.js   — Resolved page data → SVGElement (one function per element type)
  styles.css
lib/
  jszip.min.js  — vendored
  codemirror/   — vendored (TBD)
```

## Pipeline (full rebuild, no incremental caching yet)

```
ZIP drop or file edit (debounced ~300ms)
  → state.updateFile()
  → parser.buildForest(state)       // materialize nodes from all files
  → parser.resolveInheritance()     // walk parent chain, merge properties
  → renderer.renderAllPages()       // returns array of SVGElements
  → swap into filmstrip pane
  → if JSON invalid: freeze preview at last valid state, show error badge
```

- Change detection / incremental rendering is deferred (too complex for now — full re-render on every edit is acceptable given the tiny document size).
- All pages are rendered and displayed as a vertically stacked filmstrip. User can scroll freely.

## State change notifications

- Explicit. `app.js` owns the pipeline loop and calls into `state.js` / `parser.js` / `renderer.js` directly after each mutation. No event bus or publish/subscribe.

## Code Editor: CodeMirror

- CodeMirror 6 will be vendored as a pre-built bundle in `lib/`, same pattern as `lib/jszip.min.js`.
- Provides syntax highlighting, line numbers, bracket matching, and undo history out of the box.
- Exact bundling approach TBD after reviewing CM6 docs.
