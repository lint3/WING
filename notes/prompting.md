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

I need some tooling recommendations and ideas around creating multi-page instruction documents with HTML and CSS. Requirements: 
- Export (or "print") a document cleanly and predictably to PDF
- Graphical page editing (Move, resize, add, and remove elements) without end-user needing to touch code
- Reuse assets across pages.

The workflow I'm imagining goes something like this:

1. User launches the editor tool.
2. "Document Setup" dialog appears.
	2a. User loads in some data files.
	2c. User loads in a requirements file, or some other TBD file format describing "starter" data such as manufacturing processes to be used, customer requirements, and so on.
	2d. User selects a "confirm" button or similar
3. The main editor area appears, with the following (adjustable portion) sections:
	3a. A "config" pane on the left hand 20% of the page. Various dropdown sections can be expanded or collapsed:
		- Document metadata like date last edited, loaded ODB++ and BOM filenames, etc.
		- A document-wide "scratchpad / notes" text area
		- Page list
		- Load/save buttons
		- Export to PDF button
	3b. A "document" pane on the right 80% with the following:
		- At the top: Various common editing tools like "add text box", "add rectangle", font and color dropdowns, and a button to show a per-page notes/scratchpad text area popup
		- In the main area, a large page canvas for the primary editing area
4. User makes their desired edits.
5. User exports to PDF.

First, please help me design the overall program structure. I think a JS/HTML-based program will be best here. The area I think will be most challenging is the "Document editing" canvas area. It needs to have all the UI paradigms that users have come to expect: Select object(s), "resize" handles appear, element can be dragged, resized, deleted, copied, pasted, etc. Instead of reinventing this all from scratch, is there any existing mature JS library that handles much of this?

Throughout our conversation, keep your responses brief and precise. Avoid fluff, emojis, followup suggestions, and other unnecessary commentary.

---

OK, let's proceed with Moveable and Selecto. Looks like they support vanilla, react, preact, angular, svelte, lit, vue, and vue3. Please lay out some of the pros and cons of each of these frameworks. Some considerations:
- Weight: I want fast load times and snappy interaction.
- Power: Extreme power isn't strictly necessary here - The UI won't be extremely complex - and I expect there to be less than about 50 elements on a document page. More likely something like 20 per page.
- Maturity: I want something tried-and-true.
Please list out a summary of each framework including the points above and any other attributes that seem relevant for this app.
In general, throughout our conversation, keep your responses fairly brief and concise.

---

Oh, speaking of state/undo, is there anything (built into these frameworks or otherwise) that handles an undo stack for graphical editing like I'm imagining?

---

Next, let's consider data storage. What seems like the best approach to store the document files? Some considerations:

- Needs to be a single file containing embedded images, CAD data, and document page layouts (even if it's a zip or other composite file)
- Needs to be diffable. Any of the following approaches may work:
	- Document source structure is simple enough that a simple naive code-style `diff` is readable and understandable to a human
	- File contains undo stack or rev history in an internal way, then this is exposed somehow when opened
	- Some other approach to enable a human to quickly detect what's changed between two revisions of a document.
	
---

Do you feel like the proposed structure is compatible with the overall idea of "document with text, images, multiple pages, embedded data" is compatible with this proposal? How would reading the file into a fresh app state work? Eg constructing each page into elements on screen by reading the package data?