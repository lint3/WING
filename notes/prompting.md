I'm looking for software to create work instructions for my technical work environment. Requirements:

- Open source and locally-installable (not web-based)
- Source files machine-readable and source controllable
- Relatively simple UI - Things like margins, fonts, etc are OK. Advanced bulleting, text columns, etc. are unnecessary.
- Include/embed the following features:
	- Text boxes
	- Images
	- Basic shapes (arrows, rectangles, etc.)
- Template pages
- API or simple enough source files that a third-party program could generate an entire document.
- Since this is for an electronics manufacturing process, we need to somehow do the following:
	Option 1: Embed a bitmap or vector representation of electronics assembly CAD data (PCB layers, BOM data, highlighted components)
	Option 2: Somehow embed the data itself and render on the fly
- Some kind of graphical editor allowing things to be moved around the page manually

Options I've considered:
- Draw.io style XML - Good overall, but not sure how to handle the embedded CAD image(s)
- LaTeX - Could work but likely overkill. No graphical editing capabilities.
- Microsoft Word - Fairly user friendly, but closed-source, poor version control support, may not allow embedded CAD

I'm OK to write software to patch or augment the editing process, but I'd rather not design something from scratch.

Any recommendations?

---

I need some tooling recommendations and ideas around creating multi-page documents with HTML and CSS. Requirements: 
- Export (or "print") cleanly and predictably to PDF
- Graphical page editing (Move, resize, add, and remove elements) without needing to touch code
- Reuse assets across pages.

The workflow I'm imagining goes something like this:

1. User launches the editor tool.
2. "Document Setup" dialog appears.
	2a. User loads in an ODB++ file containing electronic assembly data.
	2b. User loads in a BOM file.
	2c. User loads in a requirements file, or some other TBD file format describing "starter" data such as manufacturing processes to be used, customer requirements, and so on.
	2d. User selects a "confirm" button or similar
3. The main editor area appears, with the following (adjustable portion) sections:
	3a. A "config" pane on the left hand 20% of the page. Various dropdown sections can be expanded or collapsed:
		- Document metadata like date last edited, loaded ODB++ and BOM filenames, etc.
		- Page list
	3b. Document editing area (canvas?) with draggable UI components