# Case Studies

## Serial Number Format Change — Family-Wide Propagation

A product family of six assemblies underwent a change to the serial number format on labels applied to CCAs. Every work instruction in the family required the same three updates:

- The specified label printer program (by name/ID)
- Reference photos of the label on multiple pages
- QR code images linking to the printer program

All six documents had to be updated individually. Each was opened, located, and manually edited — eighteen discrete changes in total, any of which could be missed or made inconsistently.

**Issue:** there was no shared source of truth for label details. Each document held its own copy, so a family-wide change multiplied into per-document manual work.

**Solution:** a shared base layer defining CCA label details (printer program, reference images, QR codes) that all six documents inherit. Updating the base propagates the change to every document in the family automatically, with no per-document editing required.

This is the primary motivation for the modifier inheritance model: document-specific files should only contain what is actually specific to that document. Shared properties belong in a shared layer.

## Solder Type Indicator

Some CCA assemblies are lead-free (RoHS) and some are leaded (aerospace). Documents have an icon in the header indicating solder type.

**Issue:** If an assembly status is changed, the icon must be replaced on each individual master page.

**Solution:** The solder type information conceptually applies to the whole assembly. Therefore, it should be stored at the assembly level, and inherited by each page.

## Semi-Unique Assemblies

Some programs have a large number of assemblies, each with their own very minor differences.

**Issue:** A program-level policy change requires manually making hundreds of identical edits to work instruction documents.

**Solution:** With a single program-level document plus small files describing assembly-level unique changes, editing the top level document propagates down to all affected assemblies.

## Comparing Documents is difficult

It is the engineer's responsibility to review changes made to work instruction documents. They must do this visually by flipping through each page. Attempts to automate visual diffing have proven impractical due to various factors.

**Issues:** No way to programatically detect changes. Engineer must review entire document each time a minor change is made, because they can't trust that the person editing didn't make some other change.

**Solution:** A source-render architecture allows easily diffing source files to deterministically detect changes.
