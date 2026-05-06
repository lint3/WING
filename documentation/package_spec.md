# Document Source Package Specification

Document source packages have a heirarchical design. Properties and elements defined at a given level of the heirarchy apply broadly to everything downstream, and overwrite everything defined upstream.

For example, consider `myGranularTemplate`, with parent `myGeneralTemplate`, with parent `myBaseTemplate`. We might define `font_color` as black at `myBaseTemplate` and blue at `myGeneralTemplate`. The resulting font colors from top to bottom, then, would be black, blue, blue.

## Directory Structure

```
/document_template.json   # Base document layout template.
/document_data.json       # Data specific to this specific document
/document/...			        # Additional JSONs to append to document construction
/assets/images/...        # embedded images (raster and/or vector, but excluding CCA board SVGs)
/assets/cca/...           # CCA SVG images and BOM
```

## `document_template.json`

Defines the company-wide standard for general formatting, layout, font, color schemes, and so on. Defines reusable and generic features.

### Element Template

`element_templates` contains reusable element templates, each of which contains data `slots` and `elements`. Examples: Warning message box, groups of images, image with caption.

### Page Template

`page_templates` is the top-level object containing page template objects.

Possible fields:
- description
- page_width, page_height, page_margin
- page_background: background color
- Other general properties such as font, line_color, etc

Page templates may also contain `slots` and `elements`.
They may also have a `parent`. Elements defined by the parent are rendered below the current template, such that each template child appends its own elements as a new layer on the page. Slots, `extra_vars`, and so on are also concatenated to the ancestor(s) data.

## Data Slot

Data `slots` can be thought of as function arguments for an element template or page template. They are required. Slots are declared in templates, and filled out in `document_data.json`.

Possible types:
- text
- rich_text
- image

## Element

An element is a single graphical feature to be placed on a page.

Possible types:
- text
- rich_text
- rectangle
- ellipse
- image
- assembly

The `content` field defines what the element's content. If the element's key exactly matches a slot's key and there is no `content` field, the content is assumed to be that of the key.

They may have `loc` and `dims`, which are X, Y pairs defining location and dimensions. `dims` may be `auto`, which indicates that the renderer should try to choose an appropriate size.
