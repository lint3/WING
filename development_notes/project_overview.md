# eDoc Format

## Context

This app will be used by a very small group of technicians to create and edit work instructions for an electronics assembly company. The company's primary operations are soldering (SMT, THA, select solder, wave), bonding, conformal coat, environmental and electrical test, and packaging.

The existing document editing workflow is slow, clunky, and relatively uncontrolled. (Files are versioned, but performing a full manual visual diff is the only way to compare two documents.) The software used is abandonware and does not match our needs well.

## Goal

Config-driven renderer + editor for multi-page instruction documents. The user supplies a ZIP package defining the document structure; the app renders it and allows editing via a structured UI.

## Definitions

- Source Package: A bundle of files that can be rendered into a single complete work instruction document.
- Page: A single rectangular editing area, typically corresponding to one assembly step or area (SMT top, R112 bonding, etc.)
- Page Template: A reusable chunk of JSON that adds elements to a page and creates named slots.
- Document Template: A set of page templates.
- Element: A single item (text box, image, etc) that can be put on a page
- Modifier: An atomic change targeting exactly one element. Multiple modifiers are applied during rendering.
- Slot: A named input to a template whose value is provided at instantiation time, injected into specific elements within the template.

## Deployment

Served via GitHub Pages (fully static). No server-side processing. Built with Vite; see decisions.md.

## End-User Workflow

1. User launches the app. Sees a drop zone and a "create from scratch" button.
2. User drops a `.zip` package. App parses templates and modifiers, renders the document.
3. User edits via a three-pane UI.
4. User downloads the updated `.zip` and/or a PDF rendered by the app.

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
