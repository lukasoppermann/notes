#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_DATA_DIR = path.join(process.cwd(), 'raw_data');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'data');

/**
 * Normalizes a filename by removing special characters
 * @param {string} filename - Original filename
 * @returns {string} Normalized filename
 */
function normalizeFilename(filename) {
  // Get the name without extension
  const ext = path.extname(filename);
  let name = path.basename(filename, ext);
  
  // Replace & with "and"
  name = name.replace(/&/g, 'and');
  
  // Replace em-dashes and en-dashes with regular hyphens
  name = name.replace(/[—–]/g, '-');
  
  // Remove or replace special characters
  // Keep letters, numbers, spaces, and basic punctuation
  name = name.replace(/[àáâãäå]/g, 'a');
  name = name.replace(/[èéêë]/g, 'e');
  name = name.replace(/[ìíîï]/g, 'i');
  name = name.replace(/[òóôõö]/g, 'o');
  name = name.replace(/[ùúûü]/g, 'u');
  name = name.replace(/[ýÿ]/g, 'y');
  name = name.replace(/[ñ]/g, 'n');
  name = name.replace(/[ç]/g, 'c');
  name = name.replace(/[ÀÁÂÃÄÅ]/g, 'A');
  name = name.replace(/[ÈÉÊË]/g, 'E');
  name = name.replace(/[ÌÍÎÏ]/g, 'I');
  name = name.replace(/[ÒÓÔÕÖ]/g, 'O');
  name = name.replace(/[ÙÚÛÜ]/g, 'U');
  name = name.replace(/[Ý]/g, 'Y');
  name = name.replace(/[Ñ]/g, 'N');
  name = name.replace(/[Ç]/g, 'C');
  
  // Remove any remaining special characters except spaces, hyphens, and parentheses
  name = name.replace(/[^a-zA-Z0-9\s\-()]/g, '');
  
  // Replace multiple spaces with single space
  name = name.replace(/\s+/g, ' ');
  
  // Replace spaces with hyphens
  name = name.replace(/\s/g, '-');
  
  // Remove multiple consecutive hyphens
  name = name.replace(/-+/g, '-');
  
  // Remove leading/trailing hyphens
  name = name.replace(/^-+|-+$/g, '');
  
  return name + ext;
}

/**
 * Adds or updates frontmatter in markdown content
 * @param {string} content - Original markdown content
 * @param {string} title - Title to add to frontmatter
 * @returns {string} Updated markdown content
 */
function addFrontmatter(content, title) {
  // Check if frontmatter exists
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    // Frontmatter exists, check if title is already present
    const frontmatter = match[1];
    if (/^title:/m.test(frontmatter)) {
      // Title exists, replace it
      const updatedFrontmatter = frontmatter.replace(
        /^title:.*$/m,
        `title: "${title}"`
      );
      return content.replace(frontmatterRegex, `---\n${updatedFrontmatter}\n---\n`);
    } else {
      // Title doesn't exist, add it
      const updatedFrontmatter = `title: "${title}"\n${frontmatter}`;
      return content.replace(frontmatterRegex, `---\n${updatedFrontmatter}\n---\n`);
    }
  } else {
    // No frontmatter, add it
    return `---\ntitle: "${title}"\n---\n\n${content}`;
  }
}

/**
 * Recursively copy and process files from source to destination
 * @param {string} srcDir - Source directory
 * @param {string} destDir - Destination directory
 */
function processDirectory(srcDir, destDir) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  const items = fs.readdirSync(srcDir);
  
  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      const normalizedDirName = normalizeFilename(item);
      const destPath = path.join(destDir, normalizedDirName);
      processDirectory(srcPath, destPath);
    } else if (item.endsWith('.md')) {
      // Process markdown files
      const content = fs.readFileSync(srcPath, 'utf-8');
      
      // Get the original filename without extension for the title
      const originalTitle = path.basename(item, '.md');
      
      // Add/update frontmatter with title
      const updatedContent = addFrontmatter(content, originalTitle);
      
      // Normalize the filename
      const normalizedFilename = normalizeFilename(item);
      const destPath = path.join(destDir, normalizedFilename);
      
      // Write the processed file
      fs.writeFileSync(destPath, updatedContent, 'utf-8');
      
      console.log(`Processed: ${item} -> ${normalizedFilename}`);
    } else {
      // Copy non-markdown files as-is
      const destPath = path.join(destDir, item);
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${item}`);
    }
  }
}

/**
 * Main function
 */
function main() {
  // Check if raw_data directory exists
  if (!fs.existsSync(RAW_DATA_DIR)) {
    console.log('No raw_data directory found. Nothing to process.');
    return;
  }
  
  console.log('Starting raw data processing...');
  console.log(`Source: ${RAW_DATA_DIR}`);
  console.log(`Destination: ${OUTPUT_DIR}`);
  console.log('');
  
  // Process all files and directories
  processDirectory(RAW_DATA_DIR, OUTPUT_DIR);
  
  console.log('');
  console.log('Processing complete!');
}

// Run the script
main();
