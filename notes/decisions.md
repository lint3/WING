# Architecture Decisions

## Renderer / Composition Split

The renderer is dumb. It takes a single, already-resolved `doc.json` and renders it. It has no knowledge of templates, layers, or variances. All composition happens upstream as a separate pre-processing step.

## Document Composition: Layered Merge Stack

A document is produced by merging an ordered stack of JSON layers. Later layers override earlier ones. Example ordering:

```
company_defaults → product_family → customer_variance → document_specific
```

The CAD-tree visualization shows this stack; clicking a layer shows the document as it would render if the stack stopped there.

## Pages: Template Instantiations with Slots

A document's page list is an ordered array of page instantiations. Each instantiation names a template and fills its slots:

```json
{ "id": "xray_01", "template": "xray_page", "slots": { ... } }
```

Templates define structural layout regions (slots) — not semantic content fields. Slot content is free-form data (table rows, text strings, SVG refs). This keeps the template schema stable while allowing content to grow freely.

## Escape Hatch

Every template should expose an `extra_elements` slot: an ordered list of freeform elements (text block, image, table, assembly view) appended below the structured content. Avoids needing a template change for one-off additions.

## Open Questions

- **Page list merge semantics**: how a variance layer expresses "insert page after X" or "remove page Y" without replacing the whole list.
- **Template versioning**: what happens to existing documents when a template gains or removes a slot.
