---
title: "Closed-Loop Thermal PID Controller: Discrete Simulation to Silicon"
date: "2026-02-14"
summary: "Mathematical plant modeling, Python discrete-time PID simulation, and hardware implementation on an Arduino Uno."
tags: ["embedded", "control-theory", "python", "hardware"]
link: "https://github.com/rishi-msrit/thermal-pid-controller"
linkLabel: "View on GitHub"
pinned: false
draft: false
---

# Thermal PID Controller (Arduino + Python Simulation)

Temperature control system using an LM35 sensor, Arduino Uno, and a PWM-driven MOSFET to regulate a resistive heater. PID gains were first validated through a discrete-time Python simulation against an identified plant model, then deployed on hardware.

Group project. This repo has the firmware and simulation work.

---

## Results

### Hardware (Arduino + LM35)

| Metric | Value |
|---|---|
| Setpoint | 75 C |
| Settling time (2% band) | ~42 s |
| Overshoot | ~3.8 C (5.1%) |
| Steady-state error | < 0.4 C |
| Rise time (25C to 70C) | ~28 s |

### Simulation (Python, ODE model)

| Metric | Value |
|---|---|
| Settling time | ~17 s |
| Steady-state error | < 0.2 C |

---

## Hardware

| Part | Detail |
|---|---|
| MCU | Arduino Uno (ATmega328P) |
| Sensor | LM35, 10 mV/C, on pin A0 |
| Actuator | IRLZ44N N-ch MOSFET, gate on pin 3 |
| Heater | 10 ohm / 10W resistor |
| Supply | 5V logic, 12V heater rail |

### Circuit

![Circuit](images/circuit_schematic.png)

---

## Firmware (firmware/thermal_pid_controller.ino)

LM35 to Celsius conversion:
```cpp
double readTemperature() {
    return analogRead(SENSOR_PIN) * (500.0 / 1023.0);
}
```

PID with integral anti-windup:
```cpp
double computePID(double error, double dt) {
    double P  = Kp * error;
    integral += Ki * error * dt;
    integral  = constrain(integral, -100, 100);
    double D  = Kd * (error - prev_error) / dt;
    prev_error = error;
    return P + integral + D;
}
```

PID gains:

| Gain | Value |
|---|---|
| Kp | 0.8 |
| Ki | 0.20 |
| Kd | 0.001 |

Serial output at 9600 baud: `setpoint,actual` CSV, works with Arduino Serial Plotter.

---

## Simulation (simulation/pid_simulation.py)

Plant identified from open-loop step response:
```
G(s) = 0.7725 / (0.008669*s^2 + 0.1862*s + 1)
```
Discretised with Tustin/bilinear method at Ts = 10 ms.

The script has 6 scenarios. Most useful ones:

**Heated-tank ODE - PID vs uncontrolled:**

![PID vs Uncontrolled](images/pid_heated_tank_controlled_vs_uncontrolled.png)

**PID with identified 2nd-order plant:**

![2nd Order Response](images/pid_second_order_plant.png)

**Discrete step response:**

![Step Response](images/pid_step_response_discrete.png)

**Kp sensitivity:**

![Kp Sensitivity](images/pid_kp_sensitivity.png)

To regenerate plots:
```bash
pip install numpy scipy matplotlib
python simulation/save_plots.py
```

---

## Files

```
thermal-pid-controller/
├── firmware/
│   └── thermal_pid_controller.ino
├── simulation/
│   ├── pid_simulation.py      6-scenario PID simulation
│   └── save_plots.py          saves all plots to images/
├── images/
│   ├── circuit_schematic.png
│   ├── pid_heated_tank_controlled_vs_uncontrolled.png
│   ├── pid_second_order_plant.png
│   ├── pid_step_response_discrete.png
│   └── pid_kp_sensitivity.png
└── docs/
    ├── reference_high_accuracy_temp_control.pdf
    └── reference_laser_diode_instrumentation.pdf
```

---

## References

1. High-accuracy digital temperature control for laser diodes
2. Instrumentation for stable operation of laser diodes
3. Astrom & Hagglund, PID Controllers: Theory, Design and Tuning