---
title: "World Development Indicators (WDI) Interactive Analytics Dashboard"
date: "2025-10-28"
summary: "A multi-decade global socioeconomic dashboard analyzing GDP growth, life expectancy, and carbon emissions."
tags: ["data-visualization", "python", "analytics"]
link: "https://github.com/rishi-msrit/wdi-dashboard"
linkLabel: "View on GitHub"
pinned: false
draft: false
---

# Global Development & Economic Indicators Dashboard

[![Tableau Public](https://img.shields.io/badge/Tableau_Public-Live_Dashboard-E97627?style=for-the-badge&logo=tableau&logoColor=white)](YOUR_TABLEAU_PUBLIC_LIVE_URL)
[![SQL](https://img.shields.io/badge/SQL-SQLite_Data_Prep-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](file:///sql/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](file:///scripts/run_pipeline.py)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rishi-msrit/wdi-dashboard)

> 📊 **Live Interactive Dashboard:** [👉 Click Here to Launch on Tableau Public](YOUR_TABLEAU_PUBLIC_LIVE_URL)

An end-to-end, 5-page interactive analytics application built on the **World Bank World Development Indicators (WDI)** dataset. This dashboard enables cross-country comparison, multi-decadal time-trend exploration, regional structural analysis, and cross-metric correlation across **229 countries** over a 24-year window (**2000–2023**) across **33,877 cleaned observations**.

---

## 📌 Executive Summary & Key Analytical Findings

| Analytical Focus | Key Metric / empirical finding | Strategic Insight |
|------------------|-------------------------------|-------------------|
| **Global Income Gap** | Top: Monaco (**$256,800**) vs. Bottom: Burundi (**$249.80**) in 2023 | 1,028× per-capita GDP wealth gap between the highest income microstate and the lowest income developing nation. |
| **Life Expectancy & Resilience** | Global average: **67.4 yrs (2000)** → **72.9 yrs (2019)** → **71.6 yrs (2021)** → **73.6 yrs (2023)** | Global life expectancy gained +6.23 years overall, suffered a sharp -1.23 year decline during COVID-19 (2019-2021), and fully rebounded by 2023. |
| **Health Spending vs. Longevity** | Moderate positive correlation ($r = +0.325$) across 229 nations | Strong logarithmic diminishing returns curve: health spending above ~8% of GDP shows flattening longevity gains without structural reform. |
| **Global Trade Openness** | Trade % of GDP: **80.6% (2000)** → **97.2% (2008)** → **82.1% (2020)** → **94.2% (2023)** | Trade integration expanded rapidly pre-2008, contracted significantly during the 2008 crisis and 2020 pandemic, and bounced back to 94.2% by 2023. |
| **Labor Market Vulnerabilities** | Highest unemployment rates in 2023: Eswatini (**34.61%**) & South Africa (**32.10%**) | Structural Southern African labor market crisis contrasting with global mean unemployment of 6.71%. |

---

## 🖥️ 5-Page Tableau Dashboard Architecture

The dashboard is structured into 5 distinct, client-ready interactive pages:

```
wdi-dashboard/
├── Page 1: Global Overview       (Choropleth World Map + Global Metric KPI Strip)
├── Page 2: Country Trend Explorer (Multi-Country Time Series + Latest Value Cards + YoY Table)
├── Page 3: Regional Comparison    (Regional Bar & Box Plots + 7-Indicator Heatmap + Top 10 Ranking)
├── Page 4: Correlation View       (Dual-Parameter Scatter Plot + X Rank Bar + Y Distribution Histogram)
└── Page 5: Country Scorecard      (Single-Country Executive Deliverable — 3x3 Mini-Chart Grid)
```

---

## 📸 Dashboard Preview & Page Breakdown

> *Note: Place your exported dashboard PNGs in a `screenshots/` directory to display static previews below.*

### Page 1 — Global Overview
![Global Overview](screenshots/01_global_overview.png)
- **Primary Visual:** Choropleth World Map color-encoded by a dynamic indicator dropdown (`Select Indicator` parameter).
- **Supporting Visual:** KPI summary strip highlighting global averages for 2023 (Mean GDP per capita: $21,670; Mean Life Expectancy: 73.64 years; Mean Health Spend: 6.75% of GDP).

### Page 2 — Country Trend Explorer
![Country Trend Explorer](screenshots/02_country_trend_explorer.png)
- **Primary Visual:** Multi-line time series chart comparing selected country trajectories over 2000–2023.
- **Supporting Visuals:** Headline number cards displaying the most recent 2023 values + 5-year Year-over-Year (YoY) directional change table color-coded by growth (green) vs. contraction (red).

### Page 3 — Regional Comparison
![Regional Comparison](screenshots/03_regional_comparison.png)
- **Primary Visual:** Regional mean & median grouped bar plot sorted by performance.
- **Supporting Visuals:** 7-Indicator × 7-Region Heatmap with separate row-level color scaling + Top 10 country ranking bar chart colored by parent region.

### Page 4 — Correlation View
![Correlation View](screenshots/04_correlation_view.png)
- **Primary Visual:** Interactive scatter plot with linear trendline comparing any two metrics chosen via dual parameters (`Select X Indicator` and `Select Y Indicator`).
- **Supporting Visuals:** Ranked horizontal bar chart for the top 15 X-axis leaders + Y-axis distribution histogram with mean reference line.

### Page 5 — Country Scorecard (Executive Summary)
![Country Scorecard](screenshots/05_country_scorecard.png)
- **Primary Visual:** Single-country profile deliverable displaying a 3×3 grid of mini area/line trend charts filtered by a single `Select Country` dropdown control.

---

## 🛠️ Data Pipeline & Technical Architecture

```
[World Bank DataBank API / Export]
                 │
                 ▼ (Raw WDI CSV: wide format, 1,860+ rows, 26 year columns)
[scripts/run_pipeline.py]
                 │
                 ├── 1. SQLite In-Memory Database Staging (sql/01_create_raw_table.sql)
                 ├── 2. Data Cleaning & Filtering (sql/02_clean_filter.sql)
                 │      └─ Filter out World Bank pre-aggregated rows (WLD, HIC, UMC, SSA, etc.)
                 │      └─ Strip missing data markers ('..') -> NULLs
                 │      └─ Scope years to 2000-2023 (drop empty 2024/2025 columns)
                 ├── 3. Reshape Wide -> Long Format (sql/03_reshape_long.sql)
                 │      └─ UNION ALL unpivot across 24 year columns
                 │      └─ Map short, clean human-readable indicator names
                 ▼
[data/wdi_clean.csv]  (33,877 rows × 6 columns)
                 │
                 ▼
[Tableau Public Desktop Application]
                 │
                 └─ Build 5-page interactive dashboard + synced parameter controls
                 ▼
[Published Tableau Public Link] (Embedded data workbook)
```

---

## 📊 Dataset & Metrics Reference

Data sourced directly from the **World Bank World Development Indicators (WDI)** portal.

| Indicator Display Name | WDI Series Code | Measure Unit | 2023 Global Mean | 2023 Global Max |
|-----------------------|----------------|--------------|------------------|-----------------|
| **GDP per Capita (USD)** | `NY.GDP.PCAP.CD` | Current US$ | $21,670.45 | $256,799.91 (Monaco) |
| **GDP Growth (%)** | `NY.GDP.MKTP.KD.ZG` | Annual % | 3.40% | 75.31% (Guyana) |
| **Unemployment Rate (%)** | `SL.UEM.TOTL.ZS` | % of Total Labor Force (ILO) | 6.71% | 34.61% (Eswatini) |
| **Health Expenditure (% of GDP)** | `SH.XPD.CHEX.GD.ZS` | % of GDP | 6.75% | 27.09% (Tuvalu) |
| **Education Expenditure (% of GDP)**| `SE.XPD.TOTL.GD.ZS` | % of GDP | 3.95% | 16.39% (Marshall Is.) |
| **Trade (% of GDP)** | `NE.TRD.GNFS.ZS` | % of GDP | 94.16% | 402.57% (Luxembourg) |
| **Life Expectancy (years)** | `SP.DYN.LE00.IN` | Years at birth | 73.64 yrs | 86.37 yrs (Japan) |

---

## 📋 Data Cleaning & Decision Log

| Rule / Decision | Implementation | Analytical Justification |
|-----------------|----------------|--------------------------|
| **Aggregate Row Exclusion** | Filtered `country_code NOT IN ('WLD','EAS','ECS','LCN','MEA','NAC','SAS','SSF','HIC','UMC','LMC','LIC','LDC', ...)` | World Bank exports mix actual countries with regional summaries. Including aggregates would double-count populations and distort distributions. |
| **Missing Data Policy** | Converted `'..'` strings to SQL `NULL`s; retained sparse records in `wdi_long` | Imputing macroeconomic data (e.g. linear interpolation) introduces false accuracy. Retaining NULLs allows Tableau to render true gaps in time series. |
| **Format Transformation** | Reshaped from 26 wide year columns to 1 long `year` + `value` column | Tableau requires long format to power dynamic parameters, scatter plots, and time-series animation. |
| **Temporal Boundaries** | Scoped to 2000–2023; excluded 2024–2025 | 2024 and 2025 entries in the WDI vintage were >95% unpopulated at the time of export. |

---

## 💻 Local Setup & Replication Guide

### Prerequisites
- **Python 3.8+** (standard library only — no external `pip` dependencies required)
- **Git**
- **Tableau Public Desktop** (Free download from [public.tableau.com](https://public.tableau.com))

### Pipeline Execution
```bash
# 1. Clone the repository
git clone https://github.com/rishi-msrit/wdi-dashboard.git
cd wdi-dashboard

# 2. Run the automated Python/SQLite ETL pipeline
python scripts/run_pipeline.py

# Expected Output:
# >>> WDI Data Cleaning Pipeline
# [Step 1/4] Creating raw staging table ...
# [Step 2/4] Loading raw CSV into staging table ...
# [Step 3/4] Cleaning and filtering data ...
# [Step 4/4] Reshaping wide -> long and exporting ...
# ✓ Exported 33,877 rows × 6 columns -> data/wdi_clean.csv
```

### Building & Publishing Dashboard
1. Open **Tableau Public Desktop** → Connect to `data/wdi_clean.csv`.
2. Follow the detailed, step-by-step instructions in [`MANUAL_TABLEAU_STEPS.md`](MANUAL_TABLEAU_STEPS.md).
3. Publish to Tableau Public (`File -> Save to Tableau Public As...`).
4. Replace `YOUR_TABLEAU_PUBLIC_LIVE_URL` in `README.md` with your generated public link.

---

## 🔮 Future Enhancements ("What I'd Add With More Time")

- **Population-Weighted Aggregations:** Incorporate `SP.POP.TOTL` (total population) as a scatter plot mark size dimension to weigh China and India proportionally against smaller nations.
- **Automated API Data Refresh:** Replace static CSV exports with a Python script calling the World Bank REST API (`http://api.worldbank.org/v2/country/all/indicator/...`) to auto-update data annually.
- **Live Cloud Database Connection:** Migrate the local SQLite transformation step to a cloud-hosted **PostgreSQL (Neon.tech)** instance connected live to Tableau.
- **Macroeconomic Event Overlay:** Add reference lines on Page 2 trend charts denoting global financial events (2008 Crisis, 2015 Paris Accord, 2020 COVID-19 pandemic).

---

## 📁 Repository Structure

```
wdi-dashboard/
├── data/
│   └── wdi_clean.csv             # Cleaned, reshaped dataset (33,877 rows × 6 columns)
├── sql/
│   ├── 01_create_raw_table.sql    # SQLite raw staging table schema
│   ├── 02_clean_filter.sql        # Aggregate filtering & missing value SQL rules
│   └── 03_reshape_long.sql        # Wide-to-long unpivot & export view
├── scripts/
│   └── run_pipeline.py            # Python ETL pipeline orchestrator (Standard Library)
├── screenshots/                   # Folder for dashboard preview images
├── MANUAL_TABLEAU_STEPS.md        # Comprehensive 5-page click-by-click Tableau build guide
└── README.md                      # Project documentation & analytical findings
```