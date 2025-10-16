# Notes

A personal notes website built with [Astro](https://astro.build) and automatically deployed to [Vercel](https://vercel.com).

## Features

- 🚀 Built with Astro for fast, modern static site generation
- 📝 Markdown-based content
- 🎨 Responsive design with mobile-friendly navigation
- 🔄 Automatic deployment to Vercel on every push to main
- 📁 Organized content structure with categories

## Development

### Prerequisites

- Node.js 20 or higher
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
2. Add the following secrets to your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token (get it from https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

To find your `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`:
```bash
npx vercel link
```

This will create a `.vercel/project.json` file with the IDs.

## Content Structure

Content is organized in folders and referenced in `_data/nav.yml`. Markdown files are automatically converted to HTML pages during the build process.

## License

ISC
