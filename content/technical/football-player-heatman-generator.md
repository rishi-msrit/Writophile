---
title: "Football Player Heatmap Generator & Positional Tracking System"
date: "2025-02-25"
summary: "Coordinate extraction and kernel density estimation generating spatial heatmaps from match broadcast video."
tags: ["computer-vision", "sports-analytics", "python"]
link: "https://github.com/rishi-msrit/football-player-heatman-generator"
linkLabel: "View on GitHub"
pinned: false
draft: false
---

# Football Player Heatmap Generator

Interactive **Streamlit web app** that visualizes where a football player was active on the pitch during a match, using free **StatsBomb Open Data**. Pick a competition, a team, and a player; the app pulls real event data and renders a **kernel density heatmap** over a pitch diagram.

> Note: This uses StatsBomb's free open dataset, so competition/player coverage is limited to what StatsBomb has made public (mostly select leagues, seasons, and international tournaments). Also, the app has no caching, so every load re-pulls and re-processes a fairly large chunk of event data. Give it a few seconds to breathe.

---

## Live Demo

https://fbl-player-heatmap.streamlit.app/
### (If the website says "This app is offline", Do wake up the app)


#### Please go easy on the website,let it load,as the data model used here is of huge chunk and generate a large cache which the streamlit finds tought to handle.

## How It Works

1. **Pick a competition + season** — pulled live from StatsBomb's open API (`sb.competitions()`).
2. **Pick a team** — the app fetches all matches for that competition/season and lists both home and away teams.
3. **Pick a player** — every match that team played in is loaded, all events are pulled and concatenated, and the app lists every player who appears in that team's event data.
4. **Heatmap generation** — the selected player's events are filtered, their `(x, y)` pitch coordinates are extracted from StatsBomb's location field, and a KDE (kernel density estimate) heatmap is drawn over a pitch diagram using `mplsoccer` + `matplotlib`.

---

## Features

- Dynamic **competition → season → team → player** drill-down, built entirely from live StatsBomb data (no hardcoded lists).
- Aggregates event data across **all matches** a team played in a season, not just one match.
- **KDE-based heatmaps** (not simple scatter plots) for a smoother, more readable activity zone.
- Runs entirely in-browser via **Streamlit Cloud** — no setup needed to try it.
- No caching layer — always fetches fresh data from StatsBomb on every run.

---

## Tech Stack

- **Streamlit** — web app framework and UI
- **StatsBombPy** — official StatsBomb open-data API wrapper
- **mplsoccer** — pitch drawing and KDE heatmap plotting
- **matplotlib** — underlying plotting engine
- **pandas** — data wrangling (matches, events, player filtering)
- **requests_cache** — explicitly disabled to guarantee fresh data per load

---

## Installation (Local)

```bash
git clone https://github.com/rishi-msrit/fbl_player_heatmap.git
cd fbl_player_heatmap
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the app:
```bash
streamlit run app.py
```

---

## Project Structure
```
player_heatmap_app/
│
├─ app.py                  # Main Streamlit app
├─ requirements.txt        # Python dependencies
└─ README.md               # Project description
```
---

## Dependencies

- Python 3.x (developed on 3.11)
- Streamlit
- StatsBombPy
- mplsoccer
- matplotlib
- pandas
- numpy
- requests_cache

---