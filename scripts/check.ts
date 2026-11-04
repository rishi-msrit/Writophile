#!/usr/bin/env node
// scripts/check.ts – validates all content and prints readable errors/warnings
// Run: npx ts-node --esm scripts/check.ts  (or via npm run check)

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const SUPPORTED_EXTS = new Set(['.md', '.txt']);

let errors = 0;
let warnings = 0;

function error(msg: string) {
  console.error(`  ✗ ERROR: ${msg}`);
  errors++;
}

function warn(msg: string) {
  console.warn(`  ⚠ WARN:  ${msg}`);
  warnings++;
}

function fileSlug(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function checkFile(filePath: string, context: string) {
  const filename = path.basename(filePath);
  const ext = path.extname(filename);

  if (!SUPPORTED_EXTS.has(ext)) {
    warn(`${context}/${filename}: Unsupported extension "${ext}" — will be ignored`);
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let fm: Record<string, unknown> = {};
  try {
    fm = matter(raw).data as Record<string, unknown>;
  } catch {
    error(`${context}/${filename}: Could not parse frontmatter`);
  }

  // Validate date
  if (fm.date !== undefined) {
    const dateStr =
      fm.date instanceof Date
        ? fm.date.toISOString().slice(0, 10)
        : String(fm.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      warn(`${context}/${filename}: 'date' is not YYYY-MM-DD (got "${dateStr}")`);
    }
  }

  // Validate tags
  if (fm.tags !== undefined && !Array.isArray(fm.tags)) {
    warn(`${context}/${filename}: 'tags' is not an array`);
  }

  // Validate link
  if (fm.link !== undefined && typeof fm.link !== 'string') {
    warn(`${context}/${filename}: 'link' is not a string`);
  }

  // Validate pinned/draft
  for (const bool of ['pinned', 'draft'] as const) {
    if (fm[bool] !== undefined && typeof fm[bool] !== 'boolean') {
      warn(`${context}/${filename}: '${bool}' is not boolean`);
    }
  }

  return fileSlug(filename);
}

function checkSection(sectionDir: string, label: string) {
  console.log(`\nChecking ${label}...`);
  if (!fs.existsSync(sectionDir)) {
    warn(`${label}: directory not found at ${sectionDir}`);
    return;
  }

  const slugsSeen = new Map<string, string>();

  for (const entry of fs.readdirSync(sectionDir)) {
    if (entry.startsWith('_') || entry.startsWith('.')) continue;
    const entryPath = path.join(sectionDir, entry);
    const stat = fs.statSync(entryPath);

    if (stat.isFile()) {
      const slug = checkFile(entryPath, label);
      if (slug) {
        if (slugsSeen.has(slug)) {
          error(`${label}: Duplicate slug "${slug}" — ${entry} collides with ${slugsSeen.get(slug)}`);
        } else {
          slugsSeen.set(slug, entry);
        }
      }
    }
  }
}

function checkFiction() {
  console.log('\nChecking fiction...');
  const dir = path.join(CONTENT_DIR, 'fiction');
  if (!fs.existsSync(dir)) {
    warn('fiction: directory not found');
    return;
  }

  for (const entry of fs.readdirSync(dir)) {
    if (entry.startsWith('_') || entry.startsWith('.')) continue;
    const entryPath = path.join(dir, entry);
    const stat = fs.statSync(entryPath);

    if (stat.isDirectory()) {
      // Multi-chapter story
      const metaPath = path.join(entryPath, 'story.md');
      if (!fs.existsSync(metaPath)) {
        error(`fiction/${entry}: Multi-chapter story folder has no story.md`);
        continue;
      }
      checkFile(metaPath, `fiction/${entry}`);

      // Check chapters
      const chapters = fs
        .readdirSync(entryPath)
        .filter((f) => f !== 'story.md' && SUPPORTED_EXTS.has(path.extname(f)))
        .filter((f) => /^\d+/.test(f));

      if (chapters.length === 0) {
        warn(`fiction/${entry}: Story folder has story.md but no chapter files`);
      }

      // Check numeric prefixes
      const nums = chapters.map((f) => parseInt(f.match(/^(\d+)/)?.[1] ?? '0', 10));
      const sorted = [...nums].sort((a, b) => a - b);
      for (let i = 0; i < sorted.length; i++) {
        if (sorted[i] !== i + 1) {
          warn(`fiction/${entry}: Chapter numbering gap — expected ${i + 1}, found ${sorted[i]}`);
          break;
        }
      }

      for (const f of chapters) {
        checkFile(path.join(entryPath, f), `fiction/${entry}`);
      }
    } else {
      checkFile(entryPath, 'fiction');
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log('Writophile content check');
console.log('='.repeat(40));

checkSection(path.join(CONTENT_DIR, 'technical'), 'technical');
checkFiction();
checkSection(path.join(CONTENT_DIR, 'bits-and-bytes'), 'bits-and-bytes');
checkSection(path.join(CONTENT_DIR, 'blog'), 'blog');

const aboutPath = path.join(CONTENT_DIR, 'about.md');
console.log('\nChecking about.md...');
if (!fs.existsSync(aboutPath)) {
  warn('about.md not found');
} else {
  checkFile(aboutPath, 'content');
}

console.log('\n' + '='.repeat(40));
if (errors > 0 || warnings > 0) {
  console.log(`\nResult: ${errors} error(s), ${warnings} warning(s)`);
} else {
  console.log('\n✓ All content looks good!');
}

if (errors > 0) {
  process.exit(1);
}

