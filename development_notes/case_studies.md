# Case Studies

## Serial Number Format Change — Family-Wide Propagation

A product family of six assemblies underwent a serial number format change. Every work instruction in the family required the same three updates:

- The specified label printer program (by name/ID)
- Reference photos of the label on multiple pages
- QR code images linking to the printer program

All six documents had to be updated individually. Each was opened, located, and manually edited — eighteen discrete changes in total, any of which could be missed or made inconsistently.

**The gap this exposes:** there was no shared source of truth for label details. Each document held its own copy, so a family-wide change multiplied into per-document manual work.

**What the app should support:** a shared base layer defining CCA label details (printer program, reference images, QR codes) that all six documents inherit. Updating the base propagates the change to every document in the family automatically, with no per-document editing required.

This is the primary motivation for the modifier inheritance model: document-specific files should only contain what is actually specific to that document. Shared properties belong in a shared layer.

## Leaded or Lead-Free Assembly

Some CCA assemblies are lead-free (RoHS) and some are leaded (aerospace). Documents typically should have an indicator icon in the header which indicates which is the case.

This could be captured by a modifier applied to the base-level page template - This highlights the importance of a heirarchical design.
