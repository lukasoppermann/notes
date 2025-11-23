import { marked } from 'marked';
import { readFileSync } from 'fs';
import { join } from 'path';
import { processObsidianTransclusions } from './obsidian.js';

/**
 * Processes a markdown file and converts it to HTML
 * @param filepath - Absolute path to the markdown file
 * @param headline - The headline to prepend to the content
 * @returns Processed HTML content
 */
export async function processMarkdownFile(filepath: string, headline: string): Promise<string> {
  // Read the file content
  const fileContent = readFileSync(filepath, 'utf-8');
  const content = `# ${headline}\n\n${fileContent}`;

  // Get the notes directory
  const notesDir = join(process.cwd(), 'src/data/notes');
  
  // Process Obsidian transclusions
  const processedContent = processObsidianTransclusions(content, notesDir);

  // Use marked to render markdown
  const htmlContent = await marked(processedContent);

  // Post-process the HTML
  const finalHtml = postProcessHTML(htmlContent);

  return finalHtml;
}

/**
 * Post-processes HTML content to wrap tables and images
 * @param htmlContent - Raw HTML content from markdown conversion
 * @returns Post-processed HTML content
 */
export function postProcessHTML(htmlContent: string): string {
  // Wrap tables in div.table-wrapper (handle tables with or without attributes)
  htmlContent = htmlContent.replace(/<table(\s[^>]*)?\>/g, '<div class="table-wrapper"><table$1>');
  htmlContent = htmlContent.replace(/<\/table>/g, '</table></div>');

  // Wrap standalone images in figure elements (but not those already in other elements)
  htmlContent = htmlContent.replace(/<p>(<img[^>]*>)<\/p>/g, '<figure>$1</figure>');

  return htmlContent;
}
