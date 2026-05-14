# WING — Agent Guidance

## Architecture

- Pure vanilla JS static web app. **No build step, no package.json, no npm.**
- Served via any static HTTP server (e.g. `python3 -m http.server`).
- Entry point: `index.html` → loads `lib/jszip.min.js` (vendored) then `src/app.js` (ES module).
- State: `src/state.js` — in-memory `Map`-backed store. Files loaded from drop-zip live only in memory.
- Planned deployment: GitHub Pages (no CI config exists yet).

## Project Structure

| Path | Purpose |
|------|---------|
| `index.html` | App shell, drop zone + three-pane editor |
| `src/app.js` | UI wiring: drag-drop, file tree, text editor |
| `src/state.js` | In-memory file store with JSON parse-on-write |
| `src/styles.css` | All styles (no CSS framework) |
| `lib/jszip.min.js` | Vendored JSZip for zip parsing |
| `documentation/` | Source package spec (`package_spec.md`) |
| `development_notes/` | Design decisions, requirements, case studies |

## Commands

- **Serve**: `python3 -m http.server` (or any static server)
- **No test, lint, format, or typecheck commands exist.**
- Branch: `main` (default), `dev` (created 2026-05-11).

## Source Package Format

See `documentation/package_spec.md`. ZIP must contain:
- `document_template.json` — base layout template
- `document_data.json` — per-document data, page list, slot fill-ins
- `document/` — additional JSON fragments
- `assets/` — images (`assets/images/`), CCA SVGs (`assets/cca/`)

## Key Constraints

- **No data leaves the browser** (customer proprietary data).
- Source packages are self-contained and include all rendering data.
- All rendering/editing is client-side only.

## Quirks

- `decisions.md` mentions Vite + JSX but **no Vite config or JSX usage exists yet** — the app is currently pure vanilla JS.
- No CI/CD workflows exist yet despite GitHub Pages being the target.
- No type checking, no linter — conventions are ad-hoc.
