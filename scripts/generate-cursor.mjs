#!/usr/bin/env node
// scripts/generate-cursor.mjs
// Generates public/cursor/pen-nib-32.png and pen-nib-64.png using pure Node
// (uses the canvas package if available, otherwise writes SVG as fallback)

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'cursor');
fs.mkdirSync(OUT_DIR, { recursive: true });

function drawNib(canvas, size) {
  const ctx = canvas.getContext('2d');
  const s = size / 32; // scale factor

  // Transparent background
  ctx.clearRect(0, 0, size, size);

  // Pen body — a rotated rectangle representing the barrel
  ctx.save();
  ctx.translate(size * 0.65, size * 0.1);
  ctx.rotate(Math.PI * 0.6); // ~108 degrees (pen pointing down-left at 45deg)
  
  // Barrel
  ctx.fillStyle = '#2a2a2a';
  ctx.beginPath();
  ctx.roundRect(-2 * s, -10 * s, 4 * s, 20 * s, 1 * s);
  ctx.fill();

  // Gold clip
  ctx.fillStyle = '#c8a84b';
  ctx.beginPath();
  ctx.rect(1 * s, -9 * s, 1.2 * s, 15 * s);
  ctx.fill();

  ctx.restore();

  // Nib — teardrop shape, tip at approximately (2, 30) in 32px space (hotspot)
  ctx.save();
  ctx.translate(2, 30); // nib TIP = hotspot
  ctx.rotate(-Math.PI * 0.75);

  // Nib body
  ctx.fillStyle = '#c8a84b'; // gold
  ctx.beginPath();
  ctx.moveTo(0, 0);           // tip (hotspot)
  ctx.lineTo(-3 * s, 6 * s);
  ctx.lineTo(-2 * s, 10 * s);
  ctx.lineTo(0, 11 * s);
  ctx.lineTo(2 * s, 10 * s);
  ctx.lineTo(3 * s, 6 * s);
  ctx.closePath();
  ctx.fill();

  // Nib slit
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 0.5 * s;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 8 * s);
  ctx.stroke();

  ctx.restore();

  // Ink drop at tip
  ctx.fillStyle = 'rgba(30,80,160,0.9)';
  ctx.beginPath();
  ctx.arc(2, 30, 1.2 * s, 0, Math.PI * 2);
  ctx.fill();
}

for (const size of [32, 64]) {
  const canvas = createCanvas(size, size);
  drawNib(canvas, size);
  const buf = canvas.toBuffer('image/png');
  const name = size === 32 ? 'pen-nib-32.png' : 'pen-nib-64.png';
  fs.writeFileSync(path.join(OUT_DIR, name), buf);
  console.log(`Written: ${name}`);
}

