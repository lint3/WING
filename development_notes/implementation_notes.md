## Assembly Views

The user supplies top and bottom SVGs of CCA inside the ZIP. The renderer embeds these SVGs inline in the DOM so component highlights can be applied via CSS. ODB++ parsing is out of scope.

**Component Highlighting (class-tagged inline SVG):**

The ODB++→SVG converter emits each component as `<g class="R37">`. Assembly view elements are inlined as `<svg>` nodes, giving full CSS access to internals.

Each assembly view instance has a unique wrapper ID (e.g. `#assy00c3`). Highlights are stored in `doc.json` as legend entries `{ color, components: ["R37", "C12"] }` per instance, and rendered as a generated `<style>` block:

```css
#assy00c3 .R37, #assy00c3 .C12 { fill: yellow; }
```

This is print-compatible and trivial to generate from the JSON definition.
