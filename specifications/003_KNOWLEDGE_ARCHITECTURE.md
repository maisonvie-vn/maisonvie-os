# 🏛️ MVOS Knowledge Architecture (003)

## 1. Document Management Catalog
The Document Library serves as the repository's knowledge catalog. It classifies assets to support easy search and compliance:

### Metadata Schema
- **`title`**: String describing the procedure or policy.
- **`document_type`**: Enumeration (`SOP`, `GUIDELINE`, `POLICY`).
- **`department`**: Target operational department.
- **`status`**: State machine (`DRAFT`, `REVIEW`, `APPROVED`, `ARCHIVED`).
- **`version`**: Semantic versioning identifier (e.g. `1.0`, `1.2-RC1`).
- **`owner`**: Individual responsible for the document's validity.
- **`effective_date`**: ISO date when the rule takes effect.

## 2. Version Auditing
Every content modification generates a child record inside the `document_versions` table. This tracks:
- **`version_string`**: Version changes.
- **`file_path`**: Storage location inside Supabase buckets.
- **`changelog`**: Text explaining the reasons for modification.
- **`created_by`**: ID of the editor.
