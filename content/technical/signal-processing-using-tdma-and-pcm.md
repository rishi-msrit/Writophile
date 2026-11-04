---
title: "Multi-Channel Signal Processing using TDMA & Pulse Code Modulation"
date: "2024-12-10"
summary: "Time-division multiplexing transmission simulation with nyquist sampling, quantization, and PCM encoding."
tags: ["dsp", "telecommunications", "signal-processing"]
link: "https://github.com/rishi-msrit/signal-processing-using-TDMA-and-PCM"
linkLabel: "View on GitHub"
pinned: false
draft: false
---

# TDMA and TDM–PCM Communication System Simulation (Python)

## Overview
This project contains Python-based simulations of two different but related communication concepts:

1. **TDMA (Time Division Multiple Access)** – simulated at the network / packet level.
2. **TDM with PCM (Time Division Multiplexing with Pulse Code Modulation)** – simulated at the signal level.

The objective of this project is to clearly demonstrate the difference between **how multiple users share a channel (TDMA)** and **how multiple signals are digitally encoded and multiplexed (TDM + PCM)**.

---

## TDMA Simulation

### Description
This part of the project simulates **Time Division Multiple Access (TDMA)** for a multi-node network.  
Each node is assigned a fixed time slot within a TDMA frame. The simulation includes realistic effects such as **guard time** and **synchronization jitter**, which can lead to packet collisions if timing constraints are violated.

This is a **packet-based simulation**, not a waveform-level modulation model.

### Key Concepts Implemented
- TDMA frame structure
- Slot allocation per node
- Guard time between slots
- Synchronization jitter
- Collision detection
- Packet transmission success/failure

### Performance Metrics
- Packet Delivery Ratio (PDR) per node
- Network Throughput (packets per frame)
- Average Latency

### TDMA Outputs
<img width="536" height="393" alt="image" src="https://github.com/user-attachments/assets/c4fd2f9d-b56b-4219-a96a-960f719fe5dd" />

---

## TDM with PCM –Simulation

### Description
This part of the project implements **Pulse Code Modulation (PCM)** combined with **Time Division Multiplexing (TDM)** to digitally transmit multiple analog signals over a single channel.

Three analog signals (sine, cosine, and sawtooth) are processed through the complete digital communication chain.

### Processing Stages
1. Analog signal generation
2. Sampling at 8 kHz
3. Uniform quantization (8-bit)
4. PCM encoding
5. TDM frame formation (24 bits per frame)
6. NRZ line coding
7. Demultiplexing
8. PCM decoding
9. Signal reconstruction
10. Mean Square Error (MSE) analysis

### System Parameters
- Sampling frequency: 8 kHz  
- Quantization: 8-bit uniform quantizer  
- Number of channels: 3  
- Bits per TDM frame: 24  
- Line coding: NRZ  

### TDM–PCM Outputs
<img width="1012" height="316" alt="image" src="https://github.com/user-attachments/assets/88837616-ceb0-4359-9c75-8c4e407c1c4a" />

*(Detailed observations are available in the project report.)*

---

## Technologies Used
- Python
- NumPy
- Matplotlib
- Google Colab

---

## Academic Context
- **TDMA Simulation:** Computer Communication Networks (CCN)
- **TDM–PCM Simulation:** Analog / Digital Communication Systems

This project was completed as an academic group project.  
My contribution focused on **Python implementation, simulation logic, result analysis, and visualization**.

---

## Key Learning Outcomes
- Clear distinction between TDMA and TDM
- Practical understanding of PCM encoding and reconstruction
- Impact of synchronization jitter in TDMA systems
- Visualization of multiplexing and demultiplexing processes
- Performance analysis using latency and packet delivery metrics

---

## Status
Completed – Academic Project