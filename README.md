# Notes

A personal notes website built with [Astro](https://astro.build) and automatically deployed to [Vercel](https://vercel.com).

## Features

- 🚀 Built with Astro for fast, modern static site generation
- 📝 Markdown-based content
- 🔗 Obsidian transclusion syntax support for embedding content from other files
- 🎨 Responsive design with mobile-friendly navigation
- 🔄 Automatic deployment to Vercel on every push to main
- 📁 Organized content structure with categories

## Development

### Prerequisites

- Node.js 20.x or higher
- npm

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:4321 in your browser

### Building for Production

```bash
npm run build
```

The built site will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

This site automatically deploys to Vercel when changes are pushed to the `main` branch.

### Setting up Vercel Deployment

1. Create a new project in Vercel and link it to your GitHub repository
2. Install the Vercel CLI: `npm install -g vercel`
3. Link your project: `npx vercel link` (follow the prompts)
4. Add the following secret to your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token (get it from https://vercel.com/account/tokens)

The `.vercel/project.json` file created by `vercel link` contains your project configuration and will be used during deployment.

## Content Structure

Content is organized in markdown files within `src/data/notes/`. The navigation is automatically generated from the folder structure during the build process. Simply add new markdown files in the appropriate folders, and they will be included in the navigation automatically.

### Obsidian Transclusion Syntax

This site supports Obsidian's transclusion syntax for embedding content from other markdown files:

**Embed a specific section:**
```markdown
![[Filename#Section Heading]]
```

**Embed an entire file:**
```markdown
![[Filename]]
```

**Example:**
```markdown
## Dark Chocolate Coating

Cover it with dark chocolate
![[Chocolate (tempered)#Dark chocolate]]

## Lemon Curd Topping

Add lemon curd topping (optional)
![[Curds#Lemon curd]]
```

The transclusion syntax will automatically:
- Find the referenced file anywhere in the notes directory
- Extract the specified section (case-insensitive heading match)
- Include all content under that heading until the next heading of the same or higher level
- Gracefully handle missing files or sections by leaving the original syntax in place

## License

ISC
