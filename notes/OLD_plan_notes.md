# eDoc Format

## Goals:

Editor for multi-page instruction documents. 

## Deployment

Served via GitHub Pages (fully static). No server-side processing.

## File Access Model

No native filesystem access. Users drag-and-drop a project `.zip` into the app to open it, and download the updated `.zip` when done saving.

## Requirements / End-User Workflow

1. User launches the editor tool.
2. "Document Setup" dialog appears.
	2a. User loads in SVG files for each side of the CCA (top/bottom board views). These are pre-converted from ODB++ externally; the editor does not parse ODB++ directly.
	2c. User loads in a requirements file (planned: YAML export from an external tool). This file describes assembly steps (e.g. SMT, through-hole, underfill) and is used to auto-generate a mostly-complete starting-point document. Format is not yet finalized — treat this as a future integration point; do not design around it prematurely.
	2d. User selects a "confirm" button
3. The main editor area appears, with the following (adjustable portion) sections:
	3a. A "config" pane on the left hand 20% of the page. Various dropdown sections can be expanded or collapsed:
		- Document metadata like date last edited, loaded CCA SVG and BOM filenames, etc.
		- A document-wide "scratchpad / notes" text area
		- Page list
		- Load/save buttons
		- Export to PDF button
	3b. A "document" pane on the right 80% with the following:
		- At the top: Various common editing tools like "add text box", "add rectangle", font and color dropdowns, and a button to show a per-page notes/scratchpad text area popup
		- In the main area, a large page canvas for the primary editing area, graphical editing (Move, resize, add, and remove elements) without end-user needing to see or write code
		- Supported element types: assembly views (CCA board SVGs with component highlights), text boxes, images, and other standard document elements
4. User makes their desired edits.
5. Allow the user to export (or "print") a document cleanly and predictably to PDF
	- A close approximation of WYSIWYG is required; large deviations are not acceptable
	- Pixel-perfect fidelity is not required (minor variation from font hinting, rasterization DPI, and PDF viewer differences is acceptable)

## File Storage (Save/Load)

Deterministic ZIP container with the following:

```
/manifest.ndjson        # line-by-line catalog of package contents (diffable)
/doc.json               # canonical JSON: document metadata & page layout
# (no history file — undo/redo is session-only, not persisted)
/assets/images/...      # embedded bitmaps (png/jpg)
/assets/vector/...      # embedded SVGs (including CCA board view SVGs)
/bom/...                # BOM and ancillary CSV/JSON
```

## 3rd-Party Code

### Framework

Preact

### Document Interaction

**Chosen: Moveable + Selecto** — DOM-based element manipulation.

Rationale: PDF export via `window.print()` / `@media print` produces genuine vector PDFs with real selectable text, full-resolution images, and SVG assembly views rendered as vectors — no rasterization required, zero extra export code. Native text fidelity in the PDF output is a priority.

fabric.js (canvas-based alternative) was considered but ruled out: all content is baked to raster on PDF export, making text non-selectable and quality DPI-dependent. A custom fabric→jsPDF exporter could partially mitigate this but adds significant maintenance burden.

### PDF Export

`window.print()` targeting Chrome's print-to-PDF, driven by `@media print` CSS. Assembly views are SVG and print as vectors. Text is real text.

### Assembly Views

The user loads pre-converted SVGs of each CCA side (top/bottom). The editor embeds these SVGs in the DOM as assembly view elements, which can be positioned and resized via Moveable like any other element. ODB++ parsing is out of scope for this project.

**Component Highlighting — Option A (class-tagged inline SVG):**

The ODB++→SVG converter emits each component as `<g class="R37">` (class, not ID — IDs must be unique per document and the same SVG is inlined multiple times). Assembly view elements are inlined as `<svg>` nodes in the DOM (not `<img>`), giving full CSS/JS access to internals.

Each assembly view instance has a unique wrapper ID (e.g. `#assy00c3`). Highlights are stored in `doc.json` as legend entries `{ color, components: ["R37", "C12"] }` per instance, and rendered as a generated `<style>` block:

```css
#assy00c3 .R37, #assy00c3 .C12 { fill: yellow; }
```

This is print-compatible and trivial to regenerate when the user edits a legend.

### Page Size

Hard-coded: **landscape Letter (11 × 8.5 inches)**. No user-selectable page size for now.

### Multi-Page Navigation

No simultaneous multi-page view. The left pane shows a page list; the user clicks a page to load it into the canvas. One page is active/visible at a time.

### Canvas Zoom

The canvas always fits the active page to the available editing area (maintaining aspect ratio — as large as possible while fully visible). No manual zoom control.

**Implementation note:** Element positions must be stored in **page-space units** (e.g. fraction of page width/height, or points at a fixed DPI) — never in screen pixels. A transform layer must convert between page units and screen pixels based on the current fit-scale at render/interaction time. Moveable's `zoom` prop must reflect the current scale so handles stay aligned. Retrofitting this coordinate system later is costly; build it in from the start.

### Selection

Rubber-band (marquee) multi-select is required. Selecto handles this; a bounding box is shown around all selected elements via Moveable's `--multiple` mode.

### Undo Stack

- Zustand + zundo

