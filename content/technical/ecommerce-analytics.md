---
title: "E-Commerce Customer Analytics & Revenue Optimization Pipeline"
date: "2025-07-10"
summary: "RFM customer segmentation, lifetime value forecasting, and conversion funnel analysis on transactional order data."
tags: ["ecommerce", "analytics", "python", "sql"]
link: "https://github.com/rishi-msrit/ecommerce-analytics"
linkLabel: "View on GitHub"
pinned: false
draft: false
---

# E-Commerce Sales Analytics & RFM Customer Segmentation Pipeline

An end-to-end data analytics and customer segmentation pipeline built on the public Olist Brazilian E-Commerce dataset (100,000+ orders, 9 relational tables). Features a PostgreSQL data warehouse star schema, window-function RFM scoring in SQL, DAX measures, and a 6-page interactive Power BI dashboard.

---

## 📌 Deliverables & Project Access

> **Note on Online Publishing:** Cloud "Publish to Web" hosting requires an unrestricted organizational Microsoft Power BI tenant. To make this portfolio fully accessible without external login barriers, the entire report artifact is published directly within this repository:

- 📊 **Power BI Report File (.pbix):** [`RFM Sales Analytics Pipeline.pbix`](./RFM%20Sales%20Analytics%20Pipeline.pbix) *(Open in Power BI Desktop for full interactive filtering, tooltips, and slicers)*
- 📄 **Exported Report PDF:** [`RFM Sales Analytics Pipeline.pdf`](./RFM%20Sales%20Analytics%20Pipeline.pdf) *(Instant offline viewing across all 6 dashboard pages)*
- 🗄️ **SQL Pipeline Codebase:** Cleanly staged scripts in [`/sql`](./sql)

---

## 📸 Dashboard Walkthrough

Below is a page-by-page breakdown of the 6 interactive report pages rendered from the production Power BI data model.

### Page 1: Executive Overview
High-level operational health check summarizing overall revenue, volume, customer count, average order value, and top category drivers.

![Executive Overview](screenshots/01_executive_overview.png)

- **Key Metrics:** R$ 20.16M Total Revenue, 98K Orders, R$ 205.26 Average Order Value (AOV), 95K Active Customers.
- **Revenue Trend:** Steady upward growth from 2016 through mid-2018.
- **Top Product Categories:** Led by `bed_bath_table` (R$ 1.7M+), `health_beauty`, and `computers_accessories`.

---

### Page 2: Customer Segmentation (RFM Matrix)
Uses SQL window functions (`NTILE(5)`) to bucket customers into 7 distinct behavioral segments based on Recency, Frequency, and Monetary value.

![Customer Segmentation](screenshots/02_customer_segmentation.png)

- **Champions:** 16.1% of customer base driving **32.3% of total revenue** (R$ 6.50M).
- **At Risk:** 23.6% of customer base holding **35.8% of revenue** (R$ 7.21M). Represents the single largest churn risk and highest-priority target for win-back campaigns.
- **Loyal Customers:** 20.4% of customer base accounting for 21.0% of revenue (R$ 4.23M).

---

### Page 3: Delivery Performance & Customer Satisfaction
Spatial and trend analysis of order delivery times across Brazil's 27 states, evaluating logistics efficiency and its direct impact on customer review scores.

![Delivery Performance](screenshots/03_delivery_performance.png)

- **On-Time Delivery Rate:** **92.23%** overall across all state routes.
- **Review Score Penalty:** On-time deliveries average **4.17 / 5 stars**, whereas late deliveries drop sharply to **2.55 / 5 stars** (a −1.62 star rating penalty).
- **Geographic Disparities:** Northern and Northeastern states experience higher average delay days compared to Southeastern hubs (SP, RJ, MG).

---

### Page 4: Product & Category Performance
Monitors monthly revenue trajectories across top categories to detect growth trends, seasonality, and review variations.

![Product & Category](screenshots/04_product_category.png)

- **Revenue Distribution:** `bed_bath_table`, `health_beauty`, and `sports_leisure` maintain consistent top-tier revenue contribution month-over-month.
- **Category Rating Variance:** High-volume electronics and computer accessories experience lower average review scores compared to home decor and beauty categories.

---

### Page 5: Regional Sales & Logistics (Geography)
Spatial map visualization and state-by-state matrix evaluating revenue density and delivery performance across Brazil.

![Geography](screenshots/05_geography.png)

- **State Concentration:** São Paulo (SP) represents the dominant demand center, generating over 40% of total national order volume.
- **Logistics Bottlenecks:** States further from the main distribution hubs (e.g., RR, AP, AM) exhibit higher average shipping days and freight cost ratios.

---

### Page 6: Payment Method & Installment Analytics
Explores payment type preferences, installment usage patterns, and correlation with customer satisfaction.

![Payments](screenshots/06_payments.png)

- **Payment Mix:** **Credit card** is the preferred payment method, accounting for **73,403 orders (~75%)**, followed by boleto (bank slip) and voucher.
- **Installment Behavior:** Higher-value orders exhibit strong correlation with 6–10 installment plans, providing flexible financing for Brazilian consumers.

---

## 🛠️ Tech Stack

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Power BI](https://img.shields.io/badge/Power%20BI-Desktop-F2C811?style=flat-square&logo=powerbi&logoColor=black)
![DAX](https://img.shields.io/badge/DAX-Measures-F2C811?style=flat-square)
![SQL](https://img.shields.io/badge/SQL-Window%20Functions-336791?style=flat-square&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-Ingestion%20Only-3776AB?style=flat-square&logo=python&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-Serverless%20Postgres-00E5BF?style=flat-square)

---

## 📐 Architecture & Pipeline Flow

```
Raw Olist CSVs (9 Tables, 100K+ Orders, ~120MB)
                      │
                      ▼
        [Python — ingestion/ingest.py]
                      │  pandas + SQLAlchemy
                      ▼
         staging.* (Neon PostgreSQL)
                      │
                      ▼
        [SQL — 02_cleaning.sql]
                      │  CTEs, deduplication, timestamp parsing, outlier flags
                      ▼
          clean.* (Data Cleaning)
                      │
                      ▼
        [SQL — 03_star_schema.sql]
                      │  fact_order_items + 5 dimension tables (incl. dim_date)
                      ▼
       analytics.* (Star Schema Warehouse)
                      │
                      ▼
        [SQL — 04_rfm.sql]
                      │  NTILE(5) window functions -> analytics.rfm_scores
                      ▼
        analytics.rfm_scores + views (05_views.sql)
                      │
                      ▼
        [Power BI Desktop — Native Postgres Connector]
                      │  DAX measures, star schema model, 6-page dashboard
                      ▼
   Exported Artifacts (.pbix & .pdf) + GitHub Repository
```

---

## 📊 Key Findings (Empirical Data)

All metrics below are computed directly from the PostgreSQL warehouse queries:

| Metric | Value | Business Insight |
|--------|-------|------------------|
| **Total Revenue** | R$ 20,156,175.58 | Gross merchandise value across all delivered items |
| **Total Orders** | 98,199 | Distinct non-canceled orders in dataset |
| **Active Customers** | 94,983 | Unique customer IDs |
| **Average Order Value (AOV)** | R$ 205.26 | Average revenue per order |
| **On-Time Delivery Rate** | 92.23% | Share of deliveries arriving on or before estimated date |
| **Champions Segment** | 16.1% cust → 32.3% rev | Top recency & monetary spenders |
| **At Risk Segment** | 23.6% cust → 35.8% rev | Largest revenue volume at risk of churn |
| **Dominant Payment Method** | Credit Card (73,403 orders) | ~75% share of total order transactions |
| **Avg Review (On-Time)** | 4.17 / 5.0 | Strong satisfaction baseline when logistics succeed |
| **Avg Review (Late)** | 2.55 / 5.0 | Severe −1.62 star penalty directly caused by shipping delays |

---

## 📁 Dataset & Handling at Scale

This project utilizes the **[Olist Brazilian E-Commerce Public Dataset](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)** (released under CC BY-NC-SA 4.0).

- **Scale:** 100,000+ orders spanning 2016–2018 across 9 relational tables (~120 MB raw data).
- **Data Engineering Practice:** In accordance with repository size limits and standard software engineering practices, raw CSV files are excluded from Git (`.gitignore`).
- **Data Acquisition:** To run the pipeline locally, download the 9 CSVs from Kaggle and place them in `data/raw/` before executing `ingestion/ingest.py`.

---

## 📝 Assumptions Log

See [`assumptions.md`](./assumptions.md) for the complete business logic documentation. Summary:

| Domain | Applied Inferred Rule |
|--------|----------------------|
| **Currency** | Brazilian Real (BRL) retained as-is; no synthetic FX conversion. |
| **RFM Snapshot Date** | Calculated relative to `MAX(order_date)` in dataset (`2018-09-03`). |
| **Late Delivery** | Flagged `is_late_delivery = TRUE` when `delivered_customer_date > estimated_delivery_date`. |
| **Outlier Capping** | Deliveries exceeding 60 days flagged `is_delivery_outlier = TRUE` and excluded from averages. |
| **Canceled Orders** | Excluded from `fact_order_items` analytical queries. |
| **LTV Formula** | `LTV = (Total Revenue / Active Customers) × Purchase Frequency`. |

---

## 💻 Local Setup & Execution

### Prerequisites
- Python 3.10+
- PostgreSQL (Local or Neon Serverless instance)
- Power BI Desktop (Windows)

### 1. Clone Repository & Setup Virtual Environment
```bash
git clone https://github.com/rishi-msrit/ecommerce-analytics.git
cd ecommerce-analytics
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r ingestion/requirements.txt
```

### 2. Configure Database Connection
Create a `.env` file in the root folder with your PostgreSQL connection string:
```env
DATABASE_URL=postgresql://user:password@your-neon-host/neondb?sslmode=require
```

### 3. Add Dataset & Run Ingestion
Download the [Olist Dataset on Kaggle](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce) and place the 9 CSV files in `data/raw/`. Then run:
```bash
python ingestion/ingest.py
```

### 4. Execute SQL Warehouse & RFM Pipeline
```bash
python ingestion/run_sql.py
```

### 5. Inspect Power BI Report
Open [`RFM Sales Analytics Pipeline.pbix`](./RFM%20Sales%20Analytics%20Pipeline.pbix) in Power BI Desktop to interact with the model, explore measures, and examine page layouts.

---

## 🚀 "What I'd Add With More Time"

- **Cohort Retention Matrix:** Build a monthly cohort retention table tracking customer repeat purchase rate over 3, 6, and 12-month windows.
- **Seller Quality Index:** Score individual sellers by on-time fulfillment rate, average review score, and dispute frequency.
- **Automated Orchestration:** Wrap the Python ingestion and SQL transformation scripts in a Docker container scheduled via GitHub Actions or Airflow.