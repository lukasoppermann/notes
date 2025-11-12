# URL Normalization Tests

## Overview

The `urlNormalization.test.js` file contains comprehensive tests for the URL normalization logic used in the navigation component to determine which menu items should be highlighted as active.

## Why These Tests Are Important

When users navigate to pages, the browser URL can be in different formats:
- **File system path**: `Cooking & Baking/Cakes/Crust — Pâte Brise (savory)` (from navigation data)
- **URL-encoded path**: `/Cooking%20%26%20Baking/Cakes/Crust%20-%20P%C3%A2te%20Brise%20(savory)/` (from `Astro.url.pathname`)
- **Partially decoded**: `/Cooking & Baking/Cakes/Crust - Pâte Brise (savory)/` (from browser URL bar)

The normalization function must handle all these formats and produce the same normalized output so that URL comparisons work correctly.

## Test Scenarios

The tests cover:

### 1. **Different folder depths**
   - Root level files
   - One level subfolders
   - Two level subfolders
   - Three or more levels

### 2. **Special characters**
   - Em-dashes (`—`) converted to hyphens (`-`)
   - Ampersands (`&`)
   - Spaces
   - Parentheses `()`

### 3. **Accented characters**
   - French accents: `â`, `é` (Pâte, Sucrée)
   - German umlauts: `ä`, `ü` (Dänischer, Kürbis)

### 4. **Edge cases**
   - File extensions (`.html`, `.md`)
   - Multiple trailing slashes
   - Mixed encoding states

## Running the Tests

```bash
# Run the URL normalization tests
npm run test:url-normalization
```

## Test Results

All 39 tests pass, covering:
- ✓ Root level files
- ✓ One level subfolders
- ✓ Two level subfolders with ampersands
- ✓ Em-dashes in filenames
- ✓ Accented characters (French, German)
- ✓ Multiple em-dashes in same path
- ✓ File extensions and trailing slashes

## The Normalization Function

The `normalizeUrl` function performs these transformations:

1. **URL decode**: Convert `%20` → space, `%C3%A2` → `â`, etc.
2. **Add leading slash**: Ensure path starts with `/`
3. **Remove extensions**: Strip `.html`, `.md`, `/index`
4. **Normalize slashes**: Replace multiple slashes with single slash
5. **Remove trailing slash**: For consistent comparison
6. **Replace em-dashes**: Convert `—` to `-` (matches slug normalization in `[...slug].astro`)

This ensures that regardless of how the URL is formatted (encoded, partially decoded, with or without extensions), it normalizes to the same value for comparison.
