# Future Development Roadmap — EQUA AI Bias Firewall

> This document outlines the planned future development for EQUA beyond the Google Solution Challenge 2026 prototype. Each phase builds upon the existing architecture to transform EQUA from a hackathon prototype into an enterprise-grade AI compliance platform.

---

## Current State (v1.0 — Prototype)

EQUA v1.0 demonstrates the core interception concept with:
- Live Gemini 2.5 Flash Lite integration for real-time audit narrative generation
- Live Firebase RTDB integration for persistent Fairness Registry logging
- Containerized Express.js backend deployed on Cloud Run
- Automated CI/CD via Cloud Build
- Counterfactual Identity Simulator with deterministic demo scoring (Vertex AI endpoint simulated)
- Custom SVG-based bias heatmaps and zero-latency dashboard rendering

> **Assumption (Vertex AI Simulation):** The current prototype simulates the Vertex AI prediction endpoint using deterministic client-side scoring logic. This allows demonstrating the complete interception lifecycle — counterfactual simulation, disparity detection, Gemini audit, and RTDB logging — without incurring Vertex AI inference costs during the hackathon. The architecture is designed for seamless Vertex AI endpoint integration in production.

---

## Phase 1: Production ML Integration (Q3 2026)

### 1.1 Live Vertex AI AutoML Endpoint Integration
- **Current:** Counterfactual simulation uses hardcoded disparity scores in the frontend.
- **Future:** Replace the simulated scoring with real Vertex AI AutoML Tables endpoints. The Express backend will make two authenticated `aiplatform.googleapis.com` prediction calls per decision (original profile + counterfactual profile) and compute the real disparity delta server-side.
- **Technical:** Integrate the `@google-cloud/aiplatform` SDK (already listed in `package.json` dependencies) for authenticated Vertex AI Prediction API calls.
- **Impact:** Enables EQUA to audit real ML models with real feature attributions, not just demo data.

### 1.2 Vertex AI Explainable AI (XAI) Integration
- **Current:** SHAP (SHapley Additive exPlanations) feature attribution bars are rendered from static demo data.
- **Future:** Integrate Vertex AI Explainable AI to retrieve real feature attributions for each prediction. This will power the SHAP bar visualizations with actual model explanations.
- **Technical:** Enable explanation metadata on the Vertex AI endpoint and parse the `attributions` field from prediction responses.

### 1.3 Vertex AI Model Monitoring
- **Current:** No real-time model monitoring.
- **Future:** Integrate Vertex AI Model Monitoring to detect data drift, prediction drift, and feature skew in the audited models. Surface drift alerts directly in the EQUA dashboard.
- **Impact:** Provides early warning before bias emerges, shifting from reactive interception to proactive fairness enforcement.

---

## Phase 2: Enterprise Features (Q4 2026 — Q1 2027)

### 2.1 Multi-Model Support
- **Current:** The prototype demonstrates a single simulated model (LendAI v2.3.1).
- **Future:** Support simultaneous auditing of multiple AI models across an organization (loan models, hiring models, medical triage models). Each model gets its own fairness baseline, policy thresholds, and audit log namespace in Firebase.
- **Technical:** Introduce a model registry in Firestore (migrating from RTDB for complex querying), with per-model configuration and routing in the Express proxy.

### 2.2 Automated Retraining Loop (Live)
- **Current:** The Retraining Loop screen visualizes the concept but uses static history data.
- **Future:** Implement the actual automated pipeline:
  1. Blocked decisions are exported to BigQuery via a scheduled Cloud Function.
  2. A weekly Vertex AI Pipeline job triggers AutoML retraining using the flagged decisions as negative training examples.
  3. The retrained model is automatically deployed to a shadow Vertex AI endpoint.
  4. A/B testing compares the retrained model's fairness metrics against the baseline.
  5. Upon passing fairness thresholds, the retrained model is promoted to production.
- **Technical:** Use Vertex AI Pipelines (Kubeflow) + Cloud Scheduler + BigQuery for the orchestration.

### 2.3 Role-Based Access Control (RBAC)
- **Current:** Single-user dashboard.
- **Future:** Implement Firebase Authentication with role-based access:
  - **Compliance Officer:** Full dashboard access, can override blocked decisions with audit notes.
  - **Data Scientist:** Can view audit logs, retrain models, configure feature exclusions.
  - **Executive:** Read-only dashboard with aggregate fairness KPIs and trends.
  - **Auditor (External):** Scoped read access to Fairness Certificates for regulatory review.

### 2.4 Real FCM Push Notifications
- **Current:** FCM push alerts are simulated (logged server-side but not delivered to devices).
- **Future:** Implement real Firebase Cloud Messaging integration to deliver push notifications to compliance officers' mobile devices when a high-severity decision is blocked.
- **Technical:** Store FCM device tokens in Firestore, implement topic-based subscriptions per model, and trigger `admin.messaging().send()` from the Express backend on BLOCK events.

---

## Phase 3: Platform & Compliance (Q2 2027+)

### 3.1 EU AI Act Compliance Module
- **Current:** The Fairness Registry provides a basic audit trail.
- **Future:** Generate formal EU AI Act compliance reports including:
  - Mandatory risk classification documentation
  - Bias Impact Assessments with Gemini-generated narratives
  - Automated "Right to Explanation" response templates
  - Data lineage tracking from model input to decision output
- **Technical:** Use Gemini's long-context capability to generate structured compliance documents from the full audit history in Firebase.

### 3.2 Multi-Cloud AI Model Support
- **Current:** Designed for Google Cloud (Vertex AI) endpoints.
- **Future:** Extend the proxy to intercept decisions from:
  - AWS SageMaker endpoints
  - Azure ML endpoints
  - OpenAI API responses
  - Custom on-premises model servers
- **Technical:** Abstract the prediction client behind a model adapter interface, with provider-specific implementations for authentication and request/response formatting.

### 3.3 Fairness Benchmark Marketplace
- **Current:** Single fairness metric (Counterfactual Fairness via disparity delta).
- **Future:** Support a library of fairness metrics that organizations can enable per model:
  - Demographic Parity
  - Equal Opportunity
  - Equalized Odds
  - Predictive Parity
  - Individual Fairness
  - Calibration Within Groups
- **Technical:** Implement each metric as a pluggable module in the Express backend, configurable via the Policy Engine screen.

### 3.4 SDK & API Gateway
- **Current:** Integration requires HTTP fetch calls to the EQUA backend.
- **Future:** Publish official SDKs:
  - `@equa/node` — Node.js SDK for backend integration
  - `@equa/python` — Python SDK for ML pipeline integration
  - `@equa/react` — React hooks for frontend decision monitoring
- **Technical:** Build an API Gateway (Cloud Endpoints or Apigee) with API key management, rate limiting, and usage analytics.

### 3.5 Offline Batch Auditing
- **Current:** Real-time interception only.
- **Future:** Support batch auditing of historical decisions. Organizations can upload CSV/JSON files of past decisions, and EQUA runs the counterfactual simulation retroactively to identify previously undetected bias.
- **Technical:** Use Cloud Functions + Cloud Storage triggers to process uploaded files, with results written to BigQuery for analysis and visualization.

---

## Plain Text for PPT Slides

### Slide: Future Development

Phase 1 — Production ML Integration (Q3 2026):
- Replace simulated scoring with live Vertex AI AutoML prediction endpoints
- Integrate Vertex AI Explainable AI for real SHAP feature attributions
- Add Vertex AI Model Monitoring for proactive drift detection

Phase 2 — Enterprise Features (Q4 2026 — Q1 2027):
- Multi-model auditing across loan, hiring, and healthcare AI systems
- Automated retraining pipeline via Vertex AI Pipelines + BigQuery
- Role-based access control with Firebase Authentication
- Live FCM push notifications to compliance officers

Phase 3 — Platform & Compliance (Q2 2027+):
- EU AI Act compliance report generation using Gemini
- Multi-cloud support for AWS SageMaker, Azure ML, and OpenAI
- Fairness metric marketplace (6+ configurable metrics)
- Official SDKs for Node.js, Python, and React
- Offline batch auditing of historical decisions

---

## Technical Scalability Path

| Metric | Prototype (Current) | Production (Phase 1) | Enterprise (Phase 3) |
|---|---|---|---|
| Decisions/day | ~100 (demo) | 10,000 | 1,000,000+ |
| Models audited | 1 (simulated) | 3-5 (live) | Unlimited |
| Fairness metrics | 1 (Counterfactual) | 3 | 6+ |
| Latency (p99) | <500ms | <300ms | <200ms |
| Vertex AI | Simulated | Live AutoML | Live + Monitoring |
| Cost/decision | $0.00 | ~$0.0003 | ~$0.0001 |
