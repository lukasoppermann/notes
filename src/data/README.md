---
title: "README"
---

# Raw Data Processing

This directory is monitored by a GitHub Action that automatically processes files when changes are detected.

## How It Works

1. Add your markdown files to the `raw_data/` directory (maintaining any folder structure you want)
2. Commit and push your changes to GitHub
3. The GitHub Action automatically:
   - Copies all files to `src/data/`
   - Adds frontmatter with the original filename as the title
   - Renames files by:
     - Replacing `&` with `and`
     - Replacing em-dashes (—) and en-dashes (–) with hyphens (-)
     - Removing accented characters (é → e, â → a, etc.)
     - Removing other special characters
     - Replacing spaces with hyphens (-)

## Example

**Input file:** `raw_data/Cooking & Baking/Crème Brûlée.md`
```markdown
Some recipe content here.
```

**Output file:** `src/data/Cooking-and-Baking/Creme-Brulee.md`
```markdown
---
title: "Crème Brûlée"
---

Some recipe content here.
```

## Testing Locally

To test the processing script locally before pushing:

```bash
node .github/scripts/process-raw-data.js
```

This will process all files in `raw_data/` and output them to `src/data/`.
