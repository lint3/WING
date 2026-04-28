# eDoc Format

## Goals:

Config-driven renderer for multi-page instruction documents. The user supplies a JSON file defining the document structure; the app renders it as an HTML page suitable for printing to PDF.

## Deployment

Served via GitHub Pages (fully static). No server-side processing.

## File Access Model

No native filesystem access. Users drag-and-drop a project `.zip` into the app to load it, and can download the rendered output (or print directly to PDF).

## Requirements / End-User Workflow

1. User launches the renderer.
2. User drops a `.zip` package into the app.
3. The app parses `doc.json` from the package and renders the full document.
4. User prints (or exports) to PDF via the browser's print dialog.

## File Package Format

Deterministic ZIP container with the following:

```
/doc.json               # canonical JSON: document metadata & page layout
/assets/images/...      # embedded bitmaps (png/jpg)
/assets/vector/...      # embedded SVGs (including CCA board view SVGs)
/bom/...                # BOM and ancillary CSV/JSON
```

## 3rd-Party Code

### Framework

Preact

### PDF Export

`window.print()` targeting Chrome's print-to-PDF, driven by `@media print` CSS. Assembly views are SVG and print as vectors. Text is real text.

### Assembly Views

The user supplies pre-converted SVGs of each CCA side (top/bottom) inside the ZIP. The renderer embeds these SVGs inline in the DOM so component highlights can be applied via CSS. ODB++ parsing is out of scope.

**Component Highlighting (class-tagged inline SVG):**

The ODB++→SVG converter emits each component as `<g class="R37">`. Assembly view elements are inlined as `<svg>` nodes, giving full CSS access to internals.

Each assembly view instance has a unique wrapper ID (e.g. `#assy00c3`). Highlights are stored in `doc.json` as legend entries `{ color, components: ["R37", "C12"] }` per instance, and rendered as a generated `<style>` block:

```css
#assy00c3 .R37, #assy00c3 .C12 { fill: yellow; }
```

This is print-compatible and trivial to generate from the JSON definition.

### Page Size

Hard-coded: **landscape Letter (11 × 8.5 inches)**. No user-selectable page size for now.
