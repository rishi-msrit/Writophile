#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TECH_DIR = path.join(__dirname, '..', 'content', 'technical');

const REPOS_TO_IMPORT = [
  {
    repo: 'medsafe',
    title: 'MedSafe: Drug Interaction Safety Analyzer using Graph Neural Networks',
    pinned: true,
    tags: ['machine-learning', 'python', 'pytorch', 'gnn', 'documentation'],
    summary: 'A patient-level polypharmacy safety analyzer that models molecular structure with GIN and drug interaction graphs with R-GCN.'
  },
  {
    repo: 'anirec',
    title: 'AniRec: Recommendation Engine Built from First Principles',
    pinned: true,
    tags: ['algorithms', 'typescript', 'collaborative-filtering', 'full-stack'],
    summary: 'A user-user collaborative filtering recommendation platform built without third-party ML libraries.'
  },
  {
    repo: 'localdrop',
    title: 'LocalDrop: Zero-Configuration Local Wi-Fi File Sharing',
    pinned: true,
    tags: ['networking', 'javascript', 'peer-to-peer', 'developer-tools'],
    summary: 'Instant P2P file transfers over local Wi-Fi with no cables, no cloud relays, and no recipient setup.'
  },
  {
    repo: 'self-driving-car',
    title: 'Self-Driving Car Simulation with Neural Networks in Pure JavaScript',
    pinned: false,
    tags: ['javascript', 'neural-networks', 'simulation', 'canvas'],
    summary: 'A 2D autonomous vehicle simulation and physics engine built from scratch with genetic algorithm training.'
  },
  {
    repo: 'bengaluruflow',
    title: 'BengaluruFlow: Urban Traffic Forecasting & Anomaly Detection',
    pinned: false,
    tags: ['time-series', 'python', 'lstm', 'transformers', 'data-science'],
    summary: 'Forecasting urban road congestion and detecting temporal traffic anomalies using LSTM and Transformer architectures.'
  },
  {
    repo: 'Pinterest-automation-pipeline',
    title: 'Automated Media Processing & Bulk Publishing Pipeline',
    pinned: false,
    tags: ['automation', 'python', 'cli', 'data-pipeline'],
    summary: 'An automated local ingestion tool transforming raw media into validated bulk upload datasets.'
  },
  {
    repo: 'just-do-it',
    title: 'Just Do It: Interactive Mental Models & Decision Frameworks',
    pinned: false,
    tags: ['decision-theory', 'javascript', 'ui-design', 'tools'],
    summary: 'A distraction-free web tool implementing 18 classic decision-making frameworks like SWOT, Eisenhower, and Ikigai.'
  },
  {
    repo: 'thermal-pid-controller',
    title: 'Closed-Loop Thermal PID Controller: Discrete Simulation to Silicon',
    pinned: false,
    tags: ['embedded', 'control-theory', 'python', 'arduino', 'hardware'],
    summary: 'Mathematical plant modeling, Python discrete-time PID simulation, and hardware implementation on an Arduino Uno.'
  },
  {
    repo: 'smart-walking-cane',
    title: 'Smart Walking Cane: Assistive Haptic & Ultrasonic Navigation',
    pinned: false,
    tags: ['embedded', 'assistive-tech', 'arduino', 'sensors', 'hardware'],
    summary: 'Real-time obstacle detection and tactile alert system designed for visually impaired navigation safety.'
  }
];

async function fetchReadme(repo) {
  const url = `https://api.github.com/repos/rishi-msrit/${repo}/readme`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Writophile-App' }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${repo}: ${res.statusText}`);
  }
  const data = await res.json();
  const raw = Buffer.from(data.content, 'base64').toString('utf8');
  return raw;
}

async function fetchRepoMeta(repo) {
  const url = `https://api.github.com/repos/rishi-msrit/${repo}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Writophile-App' }
  });
  if (!res.ok) return null;
  return await res.json();
}

function cleanReadmeContent(content, repo) {
  // Strip existing frontmatter if any
  let cleaned = content.replace(/^---[\s\S]*?---\s*/, '');
  
  // Replace relative image and link paths with absolute GitHub URLs
  cleaned = cleaned.replace(/!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g, (match, alt, p) => {
    const cleanPath = p.replace(/^\.\//, '');
    return `![${alt}](https://raw.githubusercontent.com/rishi-msrit/${repo}/main/${cleanPath})`;
  });

  return cleaned.trim();
}

async function run() {
  console.log('Fetching GitHub READMEs for rishi-msrit...');
  if (!fs.existsSync(TECH_DIR)) {
    fs.mkdirSync(TECH_DIR, { recursive: true });
  }

  // Remove old sample-post.md if it exists
  const oldSample = path.join(TECH_DIR, 'sample-post.md');
  if (fs.existsSync(oldSample)) {
    fs.unlinkSync(oldSample);
    console.log('Removed sample-post.md');
  }

  for (const item of REPOS_TO_IMPORT) {
    try {
      console.log(`Importing ${item.repo}...`);
      const [readmeRaw, meta] = await Promise.all([
        fetchReadme(item.repo),
        fetchRepoMeta(item.repo)
      ]);

      const date = meta?.created_at ? meta.created_at.slice(0, 10) : '2024-06-01';
      const summary = item.summary || meta?.description || '';
      const cleanedBody = cleanReadmeContent(readmeRaw, item.repo);

      const frontmatter = [
        '---',
        `title: "${item.title.replace(/"/g, '\\"')}"`,
        `date: ${date}`,
        `summary: "${summary.replace(/"/g, '\\"')}"`,
        `tags: [${item.tags.join(', ')}]`,
        `link: https://github.com/rishi-msrit/${item.repo}`,
        `linkLabel: View on GitHub`,
        `pinned: ${item.pinned}`,
        '---',
        '',
        cleanedBody
      ].join('\n');

      const outFile = path.join(TECH_DIR, `${item.repo}.md`);
      fs.writeFileSync(outFile, frontmatter, 'utf8');
      console.log(`✓ Written: ${outFile}`);
    } catch (err) {
      console.error(`✗ Failed for ${item.repo}:`, err.message);
    }
  }

  console.log('Finished importing GitHub documentation!');
}

run();

