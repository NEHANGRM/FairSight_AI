# Estimated Implementation Cost — EQUA AI Bias Firewall

> This document provides a realistic cost estimation for deploying and operating EQUA in a production environment using Google Cloud services. All prices are based on publicly available Google Cloud pricing as of April 2026. The estimates assume a mid-scale enterprise deployment processing approximately 10,000 AI decisions per day.

---

## Key Assumptions

- Vertex AI Endpoint: Simulated in the current prototype. The counterfactual simulation logic (score generation, SHAP attribution) is performed client-side using deterministic demo data. In a production deployment, this would connect to a real Vertex AI AutoML endpoint. Cost estimates below reflect what the real Vertex AI integration would cost.
- Gemini API: Live integration using gemini-2.5-flash-lite for real-time audit narrative generation.
- Firebase RTDB: Live integration for persisting blocked decision logs via Admin SDK.
- Cloud Run: Live deployment of the containerized Express.js backend.
- Traffic: 10,000 AI decisions/day (~300,000/month). Approximately 15% of decisions are blocked and require Gemini audit + RTDB logging.

---

## Cost Breakdown by Service

### 1. Google Gemini API (gemini-2.5-flash-lite)

- Purpose: Real-time AI Fairness Auditor. Generates compliance narratives for blocked decisions.
- Usage: ~45,000 blocked decisions/month requiring Gemini inference.
- Average prompt size: ~250 tokens input, ~120 tokens output per audit call.
- Input tokens/month: 45,000 x 250 = 11.25M tokens
- Output tokens/month: 45,000 x 120 = 5.4M tokens
- Pricing: Input $0.075/1M tokens, Output $0.30/1M tokens (flash-lite tier)
- Monthly Cost: (11.25 x $0.075) + (5.4 x $0.30) = $0.84 + $1.62 = $2.46/month
- Note: Free tier includes 1,500 requests/day which covers the prototype and early-stage deployment at zero cost.

Estimated Monthly Cost: ~$2.50 (production scale) / $0.00 (prototype/free tier)

### 2. Google Cloud Run (Backend Hosting)

- Purpose: Hosts the containerized Express.js proxy that orchestrates Gemini calls, Firebase writes, and counterfactual simulation.
- Configuration: 1 vCPU, 512 MB RAM, min instances = 0 (scale to zero), max instances = 10.
- Usage: ~300,000 requests/month, average response time ~400ms.
- Compute: 300,000 x 0.4s = 120,000 vCPU-seconds = 33.3 vCPU-hours
- Pricing: $0.00002400/vCPU-second, $0.00000250/GiB-second
- Compute cost: 120,000 x $0.0000240 = $2.88
- Memory cost: 120,000 x 0.5 x $0.0000025 = $0.15
- Free tier: 2 million requests/month, 360,000 vCPU-seconds, 180,000 GiB-seconds.
- Note: At prototype scale, Cloud Run is fully within the free tier.

Estimated Monthly Cost: ~$3.03 (production scale) / $0.00 (prototype/free tier)

### 3. Firebase Realtime Database (Fairness Registry)

- Purpose: Persists all blocked decision logs with audit narratives, timestamps, and applicant metadata for regulatory compliance.
- Usage: ~45,000 writes/month (blocked decisions), ~200,000 reads/month (dashboard queries).
- Storage: ~50 MB/month growing (each log entry ~1 KB).
- Pricing (Spark/Blaze): 
  - Simultaneous connections: 200,000 (Blaze)
  - Storage: $5/GB/month
  - Downloads: $1/GB
- Monthly data transfer: ~200 MB = $0.20
- Monthly storage: 50 MB = $0.25

Estimated Monthly Cost: ~$0.45 (production scale) / $0.00 (Spark free tier covers prototype)

### 4. Firebase Hosting (Frontend CDN)

- Purpose: Serves the optimized React SPA (Vite production build) via Google's global CDN with automatic SSL.
- Usage: ~5,000 page loads/month, bundle size ~1.2 MB.
- Storage: ~10 MB (static assets).
- Bandwidth: 5,000 x 1.2 MB = 6 GB/month.
- Free tier: 10 GB storage, 360 MB/day bandwidth (~10.8 GB/month).
- Note: Prototype traffic is comfortably within the free tier.

Estimated Monthly Cost: ~$0.00 (free tier covers most deployments)

### 5. Google Cloud Build (CI/CD Pipeline)

- Purpose: Automated build, test, and deployment pipeline triggered on every git push. Builds Docker image, pushes to Container Registry, and deploys to Cloud Run.
- Usage: ~30 builds/month (active development), ~5 builds/month (maintenance).
- Build time: ~3 minutes per build.
- Free tier: 120 build-minutes/day.
- Note: Fully within free tier for any reasonable development cadence.

Estimated Monthly Cost: ~$0.00 (free tier)

### 6. Vertex AI AutoML (Future — Currently Simulated)

- Purpose: In a production deployment, Vertex AI would host the actual ML model endpoint that EQUA intercepts. The counterfactual simulation would query the real Vertex AI prediction endpoint twice per decision (original + counterfactual).
- Current Status: SIMULATED. The prototype uses deterministic client-side scoring to demonstrate the interception flow. No Vertex AI charges are incurred in the current prototype.
- Projected Usage (production): 600,000 prediction requests/month (2 per decision x 300,000 decisions).
- Projected Pricing: AutoML Tables prediction — $0.06 per node-hour.
- Projected compute: ~50 node-hours/month for inference.

Projected Monthly Cost: ~$3.00 (when integrated) / $0.00 (currently simulated)

### 7. Google Container Registry

- Purpose: Stores the Docker image for the Cloud Run backend.
- Usage: ~5 image versions stored, each ~150 MB.
- Storage: 750 MB = 0.75 GB.
- Pricing: Standard Cloud Storage rates ($0.020/GB/month).

Estimated Monthly Cost: ~$0.02

---

## Total Cost Summary

### Prototype / Hackathon (Current — Free Tier)

| Service | Monthly Cost |
|---|---|
| Gemini API (gemini-2.5-flash-lite) | $0.00 |
| Cloud Run (Express backend) | $0.00 |
| Firebase RTDB (Fairness Registry) | $0.00 |
| Firebase Hosting (React CDN) | $0.00 |
| Cloud Build (CI/CD) | $0.00 |
| Vertex AI AutoML (Simulated) | $0.00 |
| Container Registry | $0.00 |
| TOTAL | $0.00/month |

All services are within the Google Cloud free tier at prototype scale. The hackathon version of EQUA operates at zero cost.

### Production Scale (10,000 decisions/day)

| Service | Monthly Cost |
|---|---|
| Gemini API (gemini-2.5-flash-lite) | $2.50 |
| Cloud Run (Express backend) | $3.03 |
| Firebase RTDB (Fairness Registry) | $0.45 |
| Firebase Hosting (React CDN) | $0.00 |
| Cloud Build (CI/CD) | $0.00 |
| Vertex AI AutoML (Projected) | $3.00 |
| Container Registry | $0.02 |
| TOTAL | ~$9.00/month |

### Enterprise Scale (100,000 decisions/day)

| Service | Monthly Cost |
|---|---|
| Gemini API (gemini-2.5-flash-lite) | $25.00 |
| Cloud Run (Express backend) | $30.00 |
| Firebase RTDB (Fairness Registry) | $5.00 |
| Firebase Hosting (React CDN) | $2.00 |
| Cloud Build (CI/CD) | $0.00 |
| Vertex AI AutoML (Projected) | $30.00 |
| Container Registry | $0.05 |
| TOTAL | ~$92.05/month |

---

## Plain Text for PPT Slides

### Slide: Cost Estimation — Prototype (Hackathon)

EQUA runs entirely on the Google Cloud Free Tier during the prototype phase.

Total Monthly Cost: $0.00

Services used at zero cost:
- Gemini 2.5 Flash Lite API — 1,500 free requests/day covers all demo traffic
- Cloud Run — 2 million free requests/month, scale-to-zero billing
- Firebase Realtime Database — Spark plan provides free reads/writes for prototype
- Firebase Hosting — 10 GB storage, 360 MB/day bandwidth included free
- Cloud Build — 120 free build-minutes/day covers CI/CD pipeline
- Vertex AI — Currently simulated client-side (zero inference cost)

### Slide: Cost Estimation — Production (10K decisions/day)

At production scale processing 10,000 AI decisions daily, EQUA costs approximately $9/month.

Breakdown:
- Gemini API (audit narratives for 45K blocked decisions): $2.50/month
- Cloud Run (300K requests, auto-scaling backend): $3.03/month
- Firebase RTDB (45K writes, 200K reads for dashboard): $0.45/month
- Vertex AI AutoML (projected, 600K predictions): $3.00/month
- Firebase Hosting + Cloud Build + Container Registry: $0.02/month

Total: ~$9.00/month

Key insight: EQUA's cost-per-audited-decision is less than $0.0001 — making AI fairness compliance accessible to organizations of all sizes.

### Slide: Cost Estimation — Enterprise (100K decisions/day)

At enterprise scale processing 100,000 AI decisions daily, EQUA costs approximately $92/month.

Total: ~$92.05/month

This demonstrates near-linear cost scaling — 10x traffic increase results in only 10x cost increase — thanks to Cloud Run's auto-scaling and Gemini's token-based pricing. No upfront infrastructure investment required.

---

## Cost Advantage

1. Zero upfront infrastructure cost — all serverless, pay-per-use.
2. Scale-to-zero billing — Cloud Run charges nothing when idle.
3. Token-based AI pricing — Gemini charges only for actual audit tokens generated.
4. Free tier covers prototype — judges can verify a live, functional product at $0 cost.
5. Sub-$10/month for production — AI fairness compliance is cheaper than a Netflix subscription.
