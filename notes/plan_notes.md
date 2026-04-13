# eDoc Format

## Goals:

Editor for multi-page instruction documents. 

## Requirements / End-User Workflow

1. User launches the editor tool.
2. "Document Setup" dialog appears.
	2a. User loads in some data files.
	2c. User loads in a requirements file, or some other TBD file format describing "starter" data such as manufacturing processes to be used, customer requirements, and so on.
	2d. User selects a "confirm" button
3. The main editor area appears, with the following (adjustable portion) sections:
	3a. A "config" pane on the left hand 20% of the page. Various dropdown sections can be expanded or collapsed:
		- Document metadata like date last edited, loaded ODB++ and BOM filenames, etc.
		- A document-wide "scratchpad / notes" text area
		- Page list
		- Load/save buttons
		- Export to PDF button
	3b. A "document" pane on the right 80% with the following:
		- At the top: Various common editing tools like "add text box", "add rectangle", font and color dropdowns, and a button to show a per-page notes/scratchpad text area popup
		- In the main area, a large page canvas for the primary editing area, graphical editing (Move, resize, add, and remove elements) without end-user needing to see or write code
4. User makes their desired edits.
5. Allow the user to export (or "print") a document cleanly and predictably to PDF

## File Storage (Save/Load)

Deterministic ZIP container with the following:

```
/manifest.ndjson        # line-by-line catalog of package contents (diffable)
/doc.json               # canonical JSON: document metadata & page layout
/history.ndjson         # optional: command/event log for undo/redo
/assets/images/...      # embedded bitmaps (png/jpg)
/assets/vector/...      # embedded SVGs
/cad/odbpp/...          # embedded ODB++ tree or other CAD sources
/bom/...                # BOM and ancillary CSV/JSON
```

## 3rd-Party Code

### Framework

Preact

### Document Interaction

- Moveable - Move, scale, rotate etc objects. + Selecto - Moveable integration for clean selection boxes
- fabric.js - "Interactive object model on top of canvas element

(Will need to choose one)

### Undo Stack

- Zustand + zundo

