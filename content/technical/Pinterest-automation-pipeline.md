---
title: "Automated Media Processing & Bulk Publishing Pipeline"
date: "2026-04-12"
summary: "An automated local ingestion tool transforming raw media into validated bulk upload datasets."
tags: ["automation", "python", "cli", "data-pipeline"]
link: "https://github.com/rishi-msrit/Pinterest-automation-pipeline"
linkLabel: "View on GitHub"
pinned: false
draft: false
---

# PinForge

A local tool that takes photos from your iPhone, runs them through an AI model, and spits out a Pinterest-ready bulk upload CSV. Built for personal use but works for anyone.

---

## How it works

Photos go from your iPhone Camera Roll to a local server running on your laptop over Wi-Fi. From there you organize them into boards, let the AI write the SEO copy, and export a CSV that Pinterest's bulk uploader accepts directly.

No cloud. No subscriptions. Just Node running locally.

---

## Stack

- **Node.js + Express** for the local server
- **Multer** handles file uploads, including iPhone HEIC files
- **Sharp** compresses images before sending to the AI (keeps originals untouched)
- **Groq (Llama 4 Scout)** or **Google Gemini 2.0 Flash** for vision and SEO generation
- **Ngrok** optionally creates a public URL so Pinterest can pull the images during bulk import
- Frontend is plain HTML, CSS, and vanilla JS

---

## Setup

**Requirements:** Node.js 18+, a free API key from [Groq](https://console.groq.com/keys) or [Google AI Studio](https://aistudio.google.com/apikey)

```bash
git clone https://github.com/rishi-msrit/Pinterest-automation-pipeline.git
cd Pinterest-automation-pipeline
copy .env.example .env
# fill in your API key in .env
npm install
npm start
```

Or on Windows, just double-click `start.bat`. It handles `npm install` automatically if node_modules is missing.

---

## Configuration

Copy `.env.example` to `.env` and fill in your values:

```env
AI_PROVIDER=groq           # 'groq' or 'gemini'
AI_API_KEY=               # Your Groq or Gemini key
NGROK_AUTHTOKEN=          # Optional, needed for Pinterest bulk image import
```

You can also set these from the Settings panel inside the web UI without touching the file.

---

## iPhone to PC transfer

Open the app on your laptop, note the local IP shown in the terminal (e.g. `http://192.168.1.x:3000`), then open that URL in Safari on your iPhone. The upload page works from mobile. Photos land directly in the `uploads/` folder on your laptop.

Supports HEIC, JPEG, PNG, WebP. Up to 50MB per file, 200 files per batch.

---

## Workflow

1. **Upload** from your iPhone or drag-drop on laptop
2. **Organize** into Pinterest boards. Board names give the AI context for better SEO
3. **Generate** AI writes title, description, and keywords for each photo. You can edit anything inline before exporting. Enable Multi-Pin mode to get 3 variations per photo
4. **Export** choose a posting schedule (immediate, daily, 2x daily, weekly), pick a start date, download the CSV. Upload it at [pinterest.com/pin-creation-tool](https://www.pinterest.com/pin-creation-tool/) using Bulk Create

---

## Notes on API keys

Keys are stored in `.env` locally and never committed to git. The `.gitignore` covers it. If you enter keys via the settings panel in the UI, they write to the same `.env` file.

Groq free tier is fast enough for this. The server adds a 4s delay between images to stay within rate limits. Gemini uses 10s.

---

## Project structure

```
.
├── server.js          main backend, handles uploads, AI calls, CSV export
├── public/
│   ├── index.html     4-step UI wizard
│   ├── app.js         frontend logic
│   └── styles.css     dark-mode UI
├── uploads/           where photos land (gitignored)
├── .env.example       config template
├── start.bat          windows one-click runner
└── package.json
```