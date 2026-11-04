'use client';

import { useState, useMemo, useCallback } from 'react';

type Section = 'technical' | 'fiction' | 'bits-and-bytes' | 'blog';
type FileType = 'md' | 'txt';
type FictionType = 'standalone' | 'story-chapter';
type StoryStatus = 'ongoing' | 'complete';

interface FormState {
  section: Section;
  fictionType: FictionType;
  fileType: FileType;
  title: string;
  date: string;
  summary: string;
  tags: string;        // comma-separated
  link: string;
  linkLabel: string;
  pinned: boolean;
  draft: boolean;
  storySlug: string;   // for chapters
  chapterNum: string;  // for chapters
  storyStatus: StoryStatus; // for story.md
  content: string;
}

const today = new Date().toISOString().slice(0, 10);

const DEFAULT: FormState = {
  section: 'technical',
  fictionType: 'standalone',
  fileType: 'md',
  title: '',
  date: today,
  summary: '',
  tags: '',
  link: '',
  linkLabel: '',
  pinned: false,
  draft: false,
  storySlug: '',
  chapterNum: '01',
  storyStatus: 'ongoing',
  content: '',
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function linkLabelFor(url: string, override: string): string {
  if (override) return override;
  if (url.includes('github.com')) return 'View on GitHub';
  if (url.includes('wattpad.com')) return 'Read on Wattpad';
  if (url) return 'Open link';
  return '';
}

/** Build the complete file content (frontmatter + body) */
function buildFile(f: FormState): string {
  const lines: string[] = ['---'];

  if (f.title)   lines.push(`title: ${JSON.stringify(f.title)}`);
  if (f.date)    lines.push(`date: ${f.date}`);
  if (f.summary) lines.push(`summary: ${JSON.stringify(f.summary)}`);

  const tags = f.tags.split(',').map((t) => t.trim()).filter(Boolean);
  if (tags.length) lines.push(`tags: [${tags.join(', ')}]`);

  if (f.link) {
    lines.push(`link: ${f.link}`);
    const lbl = linkLabelFor(f.link, f.linkLabel);
    if (lbl) lines.push(`linkLabel: ${JSON.stringify(lbl)}`);
  }

  if (f.pinned) lines.push('pinned: true');
  if (f.draft)  lines.push('draft: true');

  // Story-only
  if (f.section === 'fiction' && f.fictionType === 'story-chapter') {
    // This is story.md — extra field
    lines.push(`status: ${f.storyStatus}`);
  }

  lines.push('---');
  lines.push('');
  lines.push(f.content);

  return lines.join('\n');
}

/** Determine the filename */
function buildFilename(f: FormState): string {
  const slug = slugify(f.title) || 'untitled';
  const prefix = f.date ? `${f.date}-` : '';

  if (f.section === 'fiction' && f.fictionType === 'story-chapter') {
    const num = f.chapterNum.padStart(2, '0');
    return `${num}-${slug}.${f.fileType}`;
  }

  return `${prefix}${slug}.${f.fileType}`;
}

/** Determine where to place the file */
function buildPlacePath(f: FormState): string {
  if (f.section === 'fiction') {
    if (f.fictionType === 'story-chapter') {
      const story = slugify(f.storySlug) || 'my-story';
      return `content/fiction/${story}/${buildFilename(f)}`;
    }
    return `content/fiction/${buildFilename(f)}`;
  }
  if (f.section === 'technical') return `content/technical/${buildFilename(f)}`;
  if (f.section === 'blog') return `content/blog/${buildFilename(f)}`;
  return `content/bits-and-bytes/${buildFilename(f)}`;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-[var(--color-ink)] mb-1">
        {label}
        {hint && <span className="ml-1.5 text-xs font-normal text-[var(--color-ink-muted)]">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-ink)] px-3 py-2 rounded-sm text-sm font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent placeholder:text-[var(--color-ink-muted)] transition";

export default function PublishClient() {
  const [form, setForm] = useState<FormState>(DEFAULT);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'form' | 'preview'>('form');

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const fileContent = useMemo(() => buildFile(form), [form]);
  const filename    = useMemo(() => buildFilename(form), [form]);
  const placePath   = useMemo(() => buildPlacePath(form), [form]);

  function download() {
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(fileContent);
    } catch {
      const ta  = document.createElement('textarea');
      ta.value  = fileContent;
      ta.style.position = 'fixed';
      ta.style.opacity  = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isFictionChapter = form.section === 'fiction' && form.fictionType === 'story-chapter';

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-0 mb-8 border border-[var(--color-rule)] rounded-sm overflow-hidden w-fit">
        {(['form', 'preview'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-mono capitalize transition-colors ${
              tab === t
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-paper)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'form' && (
        <div className="paper rounded-sm border border-[var(--color-rule)] p-6 sm:p-8">

          {/* Section */}
          <Field label="Section">
            <div className="flex flex-wrap gap-2">
              {(['technical', 'fiction', 'bits-and-bytes', 'blog'] as Section[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('section', s)}
                  className={`tag-chip transition ${form.section === s ? 'active' : ''}`}
                  style={form.section === s ? { borderColor: 'var(--color-accent)', color: 'var(--color-accent)', background: 'transparent' } : {}}
                >
                  {s === 'bits-and-bytes' ? 'Bits & Bytes' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </Field>

          {/* Fiction sub-type */}
          {form.section === 'fiction' && (
            <Field label="Fiction type">
              <div className="flex flex-wrap gap-2">
                {([
                  ['standalone', 'Standalone piece'],
                  ['story-chapter', 'Chapter in a story'],
                ] as [FictionType, string][]).map(([v, lbl]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => set('fictionType', v)}
                    className={`tag-chip transition ${form.fictionType === v ? 'active' : ''}`}
                    style={form.fictionType === v ? { borderColor: 'var(--color-accent)', color: 'var(--color-accent)' } : {}}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </Field>
          )}

          {/* Story slug (for chapters) */}
          {isFictionChapter && (
            <Field label="Story folder name" hint="must match the folder in content/fiction/">
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. the-weight-of-quiet-waters"
                value={form.storySlug}
                onChange={(e) => set('storySlug', e.target.value)}
              />
            </Field>
          )}

          {/* Chapter number */}
          {isFictionChapter && (
            <Field label="Chapter number" hint="numeric prefix for ordering">
              <input
                type="text"
                className={`${inputClass} w-24`}
                placeholder="01"
                value={form.chapterNum}
                onChange={(e) => set('chapterNum', e.target.value)}
              />
            </Field>
          )}

          {/* Story status (for standalone story meta) */}
          {form.section === 'fiction' && form.fictionType === 'story-chapter' && (
            <Field label="Story status">
              <div className="flex gap-2">
                {(['ongoing', 'complete'] as StoryStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set('storyStatus', s)}
                    className={`tag-chip ${form.storyStatus === s ? 'active' : ''}`}
                    style={form.storyStatus === s ? { borderColor: 'var(--color-accent)', color: 'var(--color-accent)' } : {}}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
          )}

          {/* File type */}
          <Field label="File format">
            <div className="flex gap-2">
              {(['md', 'txt'] as FileType[]).map((ft) => (
                <button
                  key={ft}
                  type="button"
                  onClick={() => set('fileType', ft)}
                  className={`tag-chip font-mono ${form.fileType === ft ? 'active' : ''}`}
                  style={form.fileType === ft ? { borderColor: 'var(--color-accent)', color: 'var(--color-accent)' } : {}}
                >
                  .{ft}
                </button>
              ))}
            </div>
            {form.fileType === 'txt' && (
              <p className="text-xs text-[var(--color-ink-muted)] mt-1.5">
                TXT = plain text, no markdown. Blank line = paragraph. <code>***</code> = scene break.
              </p>
            )}
          </Field>

          <hr className="border-[var(--color-rule)] my-6" />

          {/* Title */}
          <Field label="Title">
            <input
              type="text"
              className={inputClass}
              placeholder="My Post Title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </Field>

          {/* Date */}
          <Field label="Published date" hint="YYYY-MM-DD">
            <input
              type="date"
              className={`${inputClass} w-auto`}
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
          </Field>

          {/* Summary */}
          <Field label="Summary" hint="one sentence, used in cards and meta">
            <input
              type="text"
              className={inputClass}
              placeholder="A short description of this post."
              value={form.summary}
              onChange={(e) => set('summary', e.target.value)}
            />
          </Field>

          {/* Tags */}
          <Field label="Tags" hint="comma-separated">
            <input
              type="text"
              className={inputClass}
              placeholder="writing, documentation, fiction"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
            />
          </Field>

          <hr className="border-[var(--color-rule)] my-6" />

          {/* External link */}
          <Field label="Attached link" hint="optional — GitHub, Wattpad, etc.">
            <input
              type="url"
              className={inputClass}
              placeholder="https://github.com/you/repo"
              value={form.link}
              onChange={(e) => set('link', e.target.value)}
            />
            {form.link && (
              <p className="text-xs text-[var(--color-ink-muted)] mt-1.5">
                Auto-label: <strong>{linkLabelFor(form.link, form.linkLabel)}</strong>
              </p>
            )}
          </Field>

          {/* Link label override */}
          {form.link && (
            <Field label="Link label override" hint="leave blank to use auto-label">
              <input
                type="text"
                className={inputClass}
                placeholder={linkLabelFor(form.link, '')}
                value={form.linkLabel}
                onChange={(e) => set('linkLabel', e.target.value)}
              />
            </Field>
          )}

          <hr className="border-[var(--color-rule)] my-6" />

          {/* Flags */}
          <Field label="Flags">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.pinned}
                  onChange={(e) => set('pinned', e.target.checked)}
                  className="accent-[var(--color-accent)] w-4 h-4"
                />
                Pin to home page
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.draft}
                  onChange={(e) => set('draft', e.target.checked)}
                  className="accent-[var(--color-accent)] w-4 h-4"
                />
                Save as draft (hidden from site)
              </label>
            </div>
          </Field>

          <hr className="border-[var(--color-rule)] my-6" />

          {/* Content */}
          <Field label="Content" hint={form.fileType === 'md' ? 'Markdown' : 'Plain text'}>
            <textarea
              className={`${inputClass} font-mono text-xs resize-y`}
              rows={18}
              placeholder={
                form.fileType === 'md'
                  ? '# Title\n\nYour **markdown** content here...'
                  : 'Your plain text content here.\n\nBlank line = new paragraph.\n\n***\n\nScene break above.'
              }
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              spellCheck
            />
          </Field>
        </div>
      )}

      {tab === 'preview' && (
        <div className="paper rounded-sm border border-[var(--color-rule)] p-6 sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-[var(--color-ink-muted)]">Generated file</p>
              <p className="text-sm font-mono text-[var(--color-accent)] mt-0.5">{filename}</p>
            </div>
          </div>
          <pre className="bg-[var(--color-paper-dark)] border border-[var(--color-rule)] rounded-sm p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap text-[var(--color-ink)]">
            {fileContent || '(fill in the form to see the generated file)'}
          </pre>
        </div>
      )}

      {/* Actions + Placement guide */}
      <div className="mt-6 paper rounded-sm border border-[var(--color-rule)] p-5 sm:p-6">
        <div className="flex flex-wrap gap-3 mb-5">
          <button
            onClick={download}
            className="stamp-btn"
            disabled={!form.title}
          >
            ↓ Download {filename || 'file'}
          </button>
          <button
            onClick={copyToClipboard}
            className="stamp-btn"
          >
            {copied ? '✓ Copied!' : '⌘ Copy to clipboard'}
          </button>
        </div>

        <div className="border-t border-[var(--color-rule)] pt-4">
          <p className="text-xs font-mono text-[var(--color-ink-muted)] uppercase tracking-wider mb-2">
            Where to put this file
          </p>
          <code className="text-sm text-[var(--color-accent)] font-mono bg-[var(--color-paper-dark)] border border-[var(--color-rule)] px-3 py-1.5 rounded-sm block">
            {placePath || 'fill in the form above'}
          </code>
          <p className="text-xs text-[var(--color-ink-muted)] mt-2 leading-relaxed">
            Then <code className="text-xs bg-[var(--color-paper-dark)] px-1">git add . &amp;&amp; git commit -m &quot;add post&quot; &amp;&amp; git push</code> — Vercel redeploys automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

