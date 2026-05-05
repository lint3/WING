# Design Constraints

These items describe real-world constraints that influence what the app must do (and cannot do).

- Since sensitive or proprietary customer data is contained in the documents, no data can leave the company site.
- All customer documents and data at the company must be versioned and controlled using the company's system. In practice, this means a source package must be self-contained, and include all data necessary to render the document.
- There are limited ways to share data between technicians and other employees:
  - Include the data in a source package which is then uploaded to company document control system
  - Upload data to company network file share (Not recommended - No access controls of any kind, no versioning)
  - Send attachments directly via email or chat (Not recommended - Not centralized, no versioning)
- 

# Requirements / Acceptance Criteria

- App is used in a web browser.
- User can drag-and-drop a zip file into the viewport to import a project.
- User can click a "print" button, after which a rendered PDF is downloaded.

# Design Decisions

- Page dimensions may be hard-coded to 8.5x11 inches, landscape orientation.
-
