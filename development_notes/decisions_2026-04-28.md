

## Document Composition: Modifiers

A document is produced by taking `document_template.json` as a base and applying modifiers to it.

## Pages: Template Instantiations with Slots

A document's page list is an ordered array of page instantiations. Each instantiation names a template and fills its slots:

```json
{ "id": "xray_01", "template": "xray_page", "slots": { ... } }
```

Templates define structural layout regions (slots) — not semantic content fields. Slot content is free-form data (table rows, text strings, SVG refs). This keeps the template schema stable while allowing content to grow freely.

## Escape Hatch

Every template should expose an `extra_elements` slot: an ordered list of freeform elements (text block, image, table, assembly view) appended below the structured content. Avoids needing a template change for one-off additions.

## Build Tooling

Vite with JSX. Built output deployed to GitHub Pages via GitHub Actions on push. Source lives on `main`; Actions builds and publishes to `gh-pages`.

## Three-Pane UI Layout

| Pane | Width | Purpose |
|------|-------|---------|
| Tree | 20% | CAD-style tree of templates, modifiers, assets. Collapsible nodes. |
| Editor | 40% | Text editor showing the file or section for the selected tree item. |
| Preview | 40% | Rendered view of one page. Updates on last-valid JSON state. |

- Clicking a tree item loads the corresponding file/section in the editor and updates the preview.
- Clicking an element in the preview jumps to that element in the editor.
- While JSON is invalid mid-edit, the preview freezes on the last valid state with a small, unobtrusive error indicator.
- Page navigation: clicking any tree item renders whatever corresponds to it (to be refined later).

## Cross-Document Inheritance (Unresolved)

A real-world case study (serial number format change across six documents) revealed that the single-ZIP model doesn't support shared layers across multiple documents. Three options are under consideration: a browser-local layer library (IndexedDB), an external composition tool that produces ZIPs from a shared layer hierarchy, or folder-drop with client-side resolution — no decision yet.

## Open Questions

- What happens to existing documents when a template gains or removes a slot?
- How to control polarity/x-ray/self-mitigating component lists?
