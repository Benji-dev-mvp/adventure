#!/usr/bin/env node
/**
 * Compact Density Codemod
 *
 * Safely reduces Tailwind spacing/typography classes inside JSX/TSX className strings.
 * Only modifies the content of className attributes (", ', or template literals).
 */

import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd(), 'src');
const exts = new Set(['.js', '.jsx', '.ts', '.tsx']);

const replacements = [
  // spacing
  [/\bp-8\b/g, 'p-6'],
  [/\bp-6\b/g, 'p-4'],
  [/\bp-5\b/g, 'p-4'],
  [/\bpx-6\b/g, 'px-4'],
  [/\bpy-4\b/g, 'py-3'],
  [/\bgap-8\b/g, 'gap-6'],
  [/\bgap-6\b/g, 'gap-4'],
  [/\bgap-4\b/g, 'gap-3'],
  [/\bspace-y-6\b/g, 'space-y-4'],
  [/\bspace-y-4\b/g, 'space-y-3'],
  // typography
  [/\btext-3xl\b/g, 'text-2xl'],
  [/\btext-2xl\b/g, 'text-xl'],
  [/\btext-xl\b/g, 'text-lg'],
  // heights
  [/\bh-12\b/g, 'h-10'],
  [/\bh-10\b/g, 'h-9'],
  // radius
  [/\brounded-2xl\b/g, 'rounded-xl'],
  [/\brounded-xl\b/g, 'rounded-lg'],
];

function processFile(filePath) {
  const input = fs.readFileSync(filePath, 'utf8');

  // Find className attributes and replace within their quoted content
  const output = input.replace(
    /className\s*=\s*(\{?)(["'`])([\s\S]*?)(\2)(\}?)/g,
    (m, brace, quote, content, endQuote, endBrace) => {
      let next = content;
      for (const [regex, repl] of replacements) {
        next = next.replace(regex, repl);
      }
      return `className=${brace}${quote}${next}${endQuote}${endBrace}`;
    }
  );

  if (output !== input) {
    fs.writeFileSync(filePath, output, 'utf8');
    console.log(`Updated: ${path.relative(process.cwd(), filePath)}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(p);
    } else if (exts.has(path.extname(e.name))) {
      processFile(p);
    }
  }
}

walk(root);
console.log('Codemod complete. Run eslint --fix and build to verify.');
