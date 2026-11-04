---
title: "Digital Signal Processing: Audio Noise Filtering & Spectral Subtraction"
date: "2025-01-18"
summary: "Frequency-domain FIR/IIR filter implementation and spectral subtraction for acoustic background noise reduction."
tags: ["dsp", "audio-processing", "signal-processing"]
link: "https://github.com/rishi-msrit/dsp-audio-noise-removal"
linkLabel: "View on GitHub"
pinned: false
draft: false
---

# DSP Audio Noise Removal

## Overview
This project demonstrates **audio noise removal using basic Digital Signal Processing (DSP) techniques**.  
A noisy audio signal is processed to reduce unwanted noise while preserving the useful signal content.

The project focuses on **practical DSP concepts** rather than heavy theoretical derivations, making the results easy to understand through both **visual plots and audible comparison**.

---

## Approach
The noise removal process follows these steps:

1. Load the noisy audio signal
2. Analyze the signal in the **time domain**
3. Analyze the signal in the **frequency domain**
4. Apply digital filtering techniques to suppress noise
5. Reconstruct the cleaned audio signal
6. Compare the original and denoised signals

---

## DSP Techniques Used
- Time-domain signal analysis
- Frequency-domain analysis using FFT
- Digital filtering for noise suppression
- Signal reconstruction after filtering

---

## Audio Files
The repository includes audio samples for direct comparison:

- **Noisy Audio:** `noisy_audio.mp3`  
- **Denoised Audio:** `denoised_audio.wav`

You can listen to both files to clearly observe the effect of noise removal.

---

## Output

The project produces:
- Time-domain waveform plots
- Frequency-domain spectrum plots
- Cleaned audio output with reduced noise
<img width="1156" height="374" alt="image" src="https://github.com/user-attachments/assets/568a254b-7544-4fee-8c01-672ed17f2e1b" />

---

## Applications
- Audio signal enhancement
- Noise reduction in communication systems
- Speech and audio preprocessing
- DSP learning and experimentation

---

## Academic Context
This project was completed as part of a **Digital Signal Processing (DSP)** laboratory / coursework.

---

## Status
Completed – Academic Project