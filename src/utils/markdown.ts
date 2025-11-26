import { marked } from 'marked';
import matter from "gray-matter";
import { readFileSync } from 'fs';
import { join } from 'path';
import { processObsidianTransclusions } from './obsidian.js';

/**
 * Processes a markdown file and converts it to HTML
 * @param filepath - Absolute path to the markdown file
 * @returns Processed HTML content and frontmatter
 */
export async function processMarkdownFile(filepath: string): Promise<{content: string, frontmatter: any}> {
  // Read the file content
  const fileContent = readFileSync(filepath, 'utf-8');
  const content = `${fileContent}`;

  // Get the notes directory
  const notesDir = join(process.cwd(), 'src/data/notes');
  
  // Process Obsidian transclusions
  const processedContent = processObsidianTransclusions(content, notesDir);
  
  const parsed = matter(processedContent);
  // Frontmatter
  const frontmatter = parsed.data;
  // Use marked to render markdown
  const htmlContent = await marked(parsed.content);

  // Post-process the HTML
  const finalHtml = postProcessHTML(htmlContent);

  return {content: finalHtml, frontmatter};
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
