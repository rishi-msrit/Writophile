#!/usr/bin/env node
// scripts/generate-og.mjs – generates a minimal default OG image (1200×630)

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'og-default.png');

const W = 1200, H = 630;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Background — warm cream parchment
ctx.fillStyle = '#FAF7F2';
ctx.fillRect(0, 0, W, H);

// Delicate border
ctx.strokeStyle = 'rgba(60,45,30,0.08)';
ctx.lineWidth = 2;
ctx.strokeRect(40, 40, W - 80, H - 80);

// Site name
ctx.fillStyle = '#1F1D1A';
ctx.font = 'bold 76px serif';
ctx.textBaseline = 'middle';
ctx.fillText('Writophile', 100, H / 2 - 30);

// Tagline
ctx.fillStyle = '#736B63';
ctx.font = '28px serif';
ctx.fillText('Technical writing, fiction, and engineering observations.', 100, H / 2 + 40);

// Accent bar
ctx.fillStyle = '#1E3F66';
ctx.fillRect(100, H / 2 - 85, 48, 4);

fs.writeFileSync(OUT, canvas.toBuffer('image/png'));
console.log('Written: og-default.png');
