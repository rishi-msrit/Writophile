# Writophile

A single-author publication site and writing portfolio built for technical documentation, fiction, and long-form essays. 

The core design principle is zero maintenance overhead: no database, no backend server, no runtime APIs, and no login portal. Content is authored directly in Markdown (`.md`) or plain text (`.txt`) and placed in the repository. Pushing to GitHub triggers a static build and instant redeploy on Vercel.

---

## Technical Architecture

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Deployment:** Vercel (Native SSG deployment, pre-rendered static delivery)
- **Styling:** Tailwind CSS with an antique parchment color system and editorial serif typography (Newsreader, Lora, JetBrains Mono)
- **Markdown Pipeline:** Unified, Remark (GFM, custom highlight spans), Rehype (Shiki syntax highlighting, slug anchors, alert blocks, scrollable tables)
- **Plain Text Processing:** Custom parser for raw `.txt` files with automated scene breaks (`***` / `---`), paragraph separation, and CRLF normalization
- **Deployment:** Vercel (Git-triggered CI/CD)

---

## Directory Structure

```
content/
├── about.md                      # Bio, writing philosophy, contact links
├── technical/                    # Engineering docs, architecture deep-dives
│   ├── medsafe.md
│   ├── anirec.md
│   └── localdrop.md
├── fiction/                      # Serialized stories and standalone fiction
│   ├── of-rain-and-anbarasi/     # Multi-chapter story folder
│   │   ├── story.md              # Story metadata (synopsis, status, Wattpad link)
│   │   ├── 01-rust-and-jasmine.txt
│   │   └── ...
│   ├── the-distance-between-us/
│   │   ├── story.md
│   │   ├── 01-the-girl-with-the-autumn-hair.txt
│   │   └── ...
│   └── standalone-satire.md      # Standalone short stories
├── bits-and-bytes/               # Quick engineering findings & snippet notes
└── blog/                         # Essays and reflections (auto-dated if omitted)
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start local dev server (http://localhost:3000)
npm run dev

# Validate all content files and frontmatter
npm run check

# Produce static production build (output to /out)
npm run build
```

---

## How to Publish New Work (The 3 Steps)

You do not need any developer tools or Antigravity to publish. Follow these three steps:

### 1. Technical Documents & Guides
1. Create your markdown file (e.g. `content/technical/my-project.md`).
2. Add the header block at the very top:
   ```yaml
   ---
   title: "Project Name: Subtitle or Architecture"
   date: "2026-11-04"
   summary: "A short one-line description of the project."
   tags: ["machine-learning", "python", "systems"]
   link: "https://github.com/rishi-msrit/your-repo"
   linkLabel: "View on GitHub"
   pinned: false
   ---
   ```
3. Commit and push:
   ```bash
   git add .
   git commit -m "Publish: my-project"
   git push origin main
   ```
   *Vercel builds and publishes the page in ~30 seconds. Filter tags on the site update automatically based on your tags.*

### 2. Blog Posts & Essays
1. Drop your file into `content/blog/my-essay.md`.
2. *(Optional)* Add `date: "YYYY-MM-DD"`. If you leave out the date, Writophile automatically assigns today's publication date at build time.
3. Commit and push:
   ```bash
   git add .
   git commit -m "Publish: my-essay"
   git push origin main
   ```

### 3. Fiction & Serialized Stories
- **Adding a new chapter to an existing story:**
  1. Open the story folder (e.g. `content/fiction/of-rain-and-anbarasi/`).
  2. Create a file with the next chapter number (e.g. `06-the-next-turn.txt`).
  3. Add the title at the top:
     ```yaml
     ---
     title: "Chapter 6: The Title"
     date: "2026-11-20"
     ---
     
     Paste your chapter text here...
     ```
  4. Push to GitHub. The story card automatically updates its total chapter count, reading time, and table of contents.

- **Adding a completely new story:**
  1. Create a new folder: `content/fiction/story-slug/`.
  2. Create `story.md` inside it with title, summary, status (`ongoing` or `complete`), and your Wattpad link.
  3. Add your numbered chapter files (`01-chapter-one.txt`, `02-chapter-two.txt`).
  4. Push to GitHub.

---

## Built-in Visual Assistant

If you don't want to type YAML frontmatter manually, open:
`https://your-domain.vercel.app/publish/`

Fill in the fields, click **Download file**, place it into the corresponding `content/` folder, and `git push`.
