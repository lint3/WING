# Project Architecture

## Source Package Structure

```
/document_template.json   # Base document layout template.
/document_data.json       # Data specific to this specific document
/document/...			        # Additional JSONs to append to document construction
/assets/images/...        # embedded images (raster and/or vector, but excluding CCA board SVGs)
/assets/cca/...           # CCA SVG images and BOM
```

## `document_template.json`

Defines the company-wide standard for general formatting, layout, font, color schemes, and so on. Should be as reusable and generic as possible. Encodes standards such as:

- The "DNI" page should have a diagram of the CCA and some components colored #ff0000a0.
- Page header and footer layout

## `document_data.json`

Fills out fields defined in `document_template.json` and `document/*`. Also includes:

- Document Metadata
  - Last edited date and user (Updated automatically by app)
  - Schema version
- Document-level assembly data
  - Customer name
  - Assembly name
  - Assembly rev name
  - BOM version
  - Custom data may be added.
- Ordered list of page templates
- Lists of meatspace items used in the assembly process
  - Tooling
  - Label programs
  - Consumables (solder, chipbonder)
  - Others (we should be able to add custom lists)
-
