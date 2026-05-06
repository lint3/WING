# Project Architecture

See also: `documentation/package_spec.md`



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
- Ordered list of pages
- Lists of meatspace items used in the assembly process
  - Tooling
  - Label programs
  - Consumables (solder, chipbonder)
  - Others (we should be able to add custom lists)
