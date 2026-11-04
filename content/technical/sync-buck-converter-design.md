---
title: "Synchronous Buck Converter Design & Power Electronics Simulation"
date: "2025-06-05"
summary: "High-efficiency synchronous DC-DC step-down buck converter circuit design with transient analysis and inductor sizing."
tags: ["hardware", "power-electronics", "circuit-design"]
link: "https://github.com/rishi-msrit/sync-buck-converter-design"
linkLabel: "View on GitHub"
pinned: false
draft: false
---

# Synchronous Buck Converter (TPS5430)

DC-DC step-down converter based on the TI TPS5430 IC. Designed in KiCad 6 with a 2-layer PCB layout. Gerber files are included and were fabricated through JLCPCB.

---

## Specs

| Parameter | Value |
|---|---|
| Input voltage | 5.5V to 36V |
| Output voltage | 5V (1.8V / 3.3V / 5V / 12V selectable via solder jumper) |
| Output current | 3A continuous |
| Switching frequency | ~500 kHz (internal oscillator) |
| Efficiency at 12V in, 5V/3A out | 91.4% |
| Output ripple at 3A | ~34 mV pk-pk |
| Load transient (0 to 3A step) | 120 mV droop, recovers in < 15 us |
| Inductor | 47 uH (Sunlord MWSA1004S) |
| Output capacitors | 2x 100 uF tantalum + 10 uF ceramic |
| Input capacitors | 4x 10 uF ceramic |

---

## Protection

- Reverse polarity: AO3401A P-ch MOSFET on input rail
- Overcurrent: 3A hold / 6A trip polyfuse (self-resetting)
- UVLO: built into TPS5430, inhibits switching below ~5.5V input

---

## Inductor Selection

Datasheet recommends 15 uH for fixed 5V output. Used 47 uH to keep current ripple low across all four output voltage settings:

```
dI_L = (Vin - Vout) / (L x fsw) = (12 - 5) / (47uH x 500kHz) = 0.298 A
```

Output ripple is dominated by tantalum ESR (~40 mohm in parallel):
```
dV_out ~ dI_L x ESR = 0.298 x 0.040 = ~12 mV (measured: 34 mV pk-pk)
```

Trace widths on high current paths: 3.0 mm (IPC-2221, 3A, 1oz copper, 10C rise).

---

## PCB

![Schematic](images/schematic.png)

![3D Render](images/pcb_3d_render_iso.png)

![Top Layer](images/pcb_layout_top.png)

![Copper Fill](images/pcb_layout_copper.png)

---

## LTspice

Two sub-circuit sims in `ltspice/`:
- `led_drive.asc` - status LED resistor validation
- `reverse_polarity_protection.asc` - P-MOSFET gate/drain response under reversed supply

Open in LTspice XVII (free from Analog Devices), press F5 to run.

---

## Files

```
sync-buck-converter-design/
├── kicad/               KiCad project files (schematic, PCB, lib)
├── ltspice/             LTspice sub-circuit simulations
├── fabrication/gerber/  Gerber + drill files for JLCPCB
├── images/              PCB renders and schematic screenshots
└── docs/design_notes.md Component sizing calculations
```

To view without KiCad: paste the repo URL into [KiCanvas](https://kicanvas.org).

---

## Tools

KiCad 6, LTspice XVII, JLCPCB

## Reference

[TPS5430 Datasheet](https://www.ti.com/lit/ds/symlink/tps5430.pdf)