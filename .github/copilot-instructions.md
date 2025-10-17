# Copilot Instructions for Notes Repository

## Repository Overview

This is a personal notes website built with Astro and automatically deployed to Vercel. It contains cooking/baking recipes and other personal notes organized in a hierarchical structure.

## Technology Stack

- **Framework**: Astro 5.x (Static Site Generator)
- **Language**: JavaScript (ES Modules)
- **Content**: Markdown files
- **Styling**: CSS
- **Deployment**: Vercel (automatic deployment on main branch)
- **Build Tool**: Vite (integrated with Astro)
- **Node Version**: 20.x or higher

## Project Structure

- **`src/`**: Source code for the Astro site
  - `pages/`: Astro page components
    - `index.astro`: Homepage
    - `[...slug].astro`: Dynamic route for all content pages
  - `layouts/`: Layout components
  - `components/`: Reusable Astro components
  - `styles/`: CSS stylesheets
- **Root directory**: Markdown content files organized in folders (e.g., `Cooking & Baking/`, `Snowboarding/`)
- **`_data/nav.yml`**: Navigation structure configuration
- **`public/`**: Static assets served directly
- **`dist/`**: Build output (generated, not committed)
- **`.astro/`**: Astro cache (generated, not committed)

## Content Organization

- Content is written in Markdown files located in the root directory and organized into folders
- The navigation structure is defined in `_data/nav.yml` using a hierarchical YAML format
- Each content item in `nav.yml` has:
  - `title`: Display name
  - `url`: URL-encoded path to the content
  - `children`: Optional nested items
- Dynamic routing via `[...slug].astro` renders all content pages

## Development Workflow

### Commands

- **Install dependencies**: `npm install`
- **Development server**: `npm run dev` (starts at http://localhost:4321)
- **Build**: `npm run build` (outputs to `dist/`)
- **Preview**: `npm run preview` (preview production build)

### Build Process

1. Astro processes all `.astro` components and pages
2. Markdown files are converted to HTML pages
3. YAML files are loaded using the `@rollup/plugin-yaml` plugin
4. Static files are generated in `dist/` directory
5. Build uses `directory` format with trailing slashes for Vercel compatibility

## Deployment

- **Automatic deployment**: Changes to `main` branch trigger GitHub Actions workflow (`.github/workflows/deploy.yml`)
- **Platform**: Vercel
- **Workflow steps**:
  1. Checkout code
  2. Setup Node.js 20
  3. Install dependencies with `npm ci`
  4. Build Astro site
  5. Deploy to Vercel using Vercel CLI
- **Required secret**: `VERCEL_TOKEN` in GitHub repository secrets

## Code Style and Conventions

- Use ES modules (`import`/`export`)
- Configuration files use `.mjs` extension (e.g., `astro.config.mjs`)
- Follow Astro component conventions for `.astro` files
- Markdown files use standard Markdown syntax
- YAML files use standard YAML syntax with proper indentation
- Keep URLs in `nav.yml` URL-encoded to match file paths

## Configuration Files

- **`astro.config.mjs`**: Astro configuration
  - Enables trailing slashes for routes
  - Configures markdown rendering with GitHub Light theme
  - Integrates YAML plugin for Vite
- **`package.json`**: Project dependencies and scripts
- **`_config.yml`**: Legacy Jekyll configuration file (unused in current Astro setup)
- **`vercel.json`**: Vercel deployment configuration

## Testing

- No automated test suite is currently set up
- Manual testing via development server and preview builds
- Verify builds complete successfully before deployment

## Key Considerations for AI Assistance

1. **Minimal changes**: Make focused, surgical changes to achieve objectives
2. **Content structure**: When adding new content, update both the Markdown file and `_data/nav.yml`
3. **URL encoding**: Ensure URLs in `nav.yml` are properly URL-encoded to match file paths
4. **Build verification**: Always test with `npm run build` after making changes
5. **Astro conventions**: Follow Astro best practices for components and pages
6. **Markdown content**: Preserve existing content formatting and structure
7. **Navigation hierarchy**: Maintain the existing hierarchical structure in `nav.yml`
8. **Static site generation**: This is a static site, not server-side rendered
9. **Deployment process**: Changes to main branch auto-deploy; test thoroughly before merging

## Common Tasks

- **Add new content**: Create Markdown file in appropriate folder and add entry to `_data/nav.yml`
- **Update navigation**: Edit `_data/nav.yml` following the existing structure
- **Modify styling**: Edit CSS files in `src/styles/`
- **Update layout**: Modify files in `src/layouts/`
- **Add components**: Create new `.astro` files in `src/components/`
- **Configure build**: Edit `astro.config.mjs`
