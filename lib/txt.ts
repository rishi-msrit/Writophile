// lib/txt.ts – renderer for .txt files (Wattpad paste-in format)

/**
 * Render a .txt file to HTML:
 * - HTML-escape all content
 * - Normalize CRLF, BOM, trailing spaces
 * - Blank line = paragraph break (<p>)
 * - Single newline = line break (<br>)
 * - A line containing only ***, * * * or --- = ornamental scene break
 * - Frontmatter block at top (---...---) is stripped before rendering
 */
export function renderTxt(raw: string): string {
  // Strip BOM
  let text = raw.replace(/^\uFEFF/, '');
  // Normalize CRLF
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Strip frontmatter if present (--- ... ---)
  text = text.replace(/^---\n[\s\S]*?\n---\n?/, '');

  // Split into paragraphs by blank lines
  const blocks = text.split(/\n\n+/);

  const html = blocks
    .map((block) => {
      // Trim trailing spaces from each line
      const trimmed = block
        .split('\n')
        .map((l) => l.trimEnd())
        .join('\n')
        .trim();

      if (!trimmed) return '';

      // Check if the whole block is a scene break line
      const lines = trimmed.split('\n');
      if (lines.length === 1 && /^(\*\*\*|\* \* \*|---)$/.test(trimmed)) {
        return '<hr class="scene-break" aria-hidden="true" />';
      }

      // HTML escape the block
      const escaped = escapeHtml(trimmed);

      // Convert single newlines within paragraph to <br>
      const withBreaks = escaped.replace(/\n/g, '<br />\n');

      return `<p>${withBreaks}</p>`;
    })
    .filter(Boolean)
    .join('\n');

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

