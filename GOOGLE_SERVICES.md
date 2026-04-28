# Google Services Integration

EQUA heavily leverages the Google Cloud and AI ecosystem to deliver a production-grade AI bias firewall. We have transitioned from a purely client-side simulation to a secure, full-stack architecture.

## 1. Google Gemini API (Core Feature)
The heart of EQUA's explainability engine is powered by the **Google Gemini API** (specifically the `gemini-2.5-flash-lite` model). 

### How it is used:
Inference is now handled securely on our **Cloud Run** backend. When a biased decision is intercepted, the backend constructs a highly structured prompt and sends it to Gemini. Gemini acts as an **AI Fairness Auditor**, generating a real-time compliance narrative that explains *why* the underlying model rejected an applicant based on protected attribute correlation.

## 2. Google Cloud Run (Backend Hosting)
To protect our API credentials and provide a scalable execution environment, we containerized our Express.js backend using **Docker**.

### How it is used:
The backend is deployed to **Google Cloud Run**, providing a secure, auto-scaling endpoint for the frontend dashboard. This ensures that the Gemini API key and Firebase Service Account remain server-side and are never exposed to the client's browser.

## 3. Firebase Realtime Database & Admin SDK (Persistence)
We have implemented a real-time **Fairness Registry** using the Firebase ecosystem.

### How it is used:
When a transaction is blocked, the backend uses the **Firebase Admin SDK** to securely log the audit metadata to the **Realtime Database**. This provides an immutable, real-time ledger of all blocked decisions for regulatory compliance and historical analysis.

## 4. Google Cloud Build (CI/CD)
To maintain production maturity, we utilize **Google Cloud Build** for our deployment pipeline.

### How it is used:
Every push to the repository triggers a Cloud Build job defined in `cloudbuild.yaml`. The pipeline automatically installs dependencies, builds the Docker image, pushes it to the Google Container Registry, and deploys it to Cloud Run.

## 5. Firebase Hosting (Frontend Deployment)
The EQUA React SPA (Single Page Application) is served via **Firebase Hosting**. 

### How it is used:
Firebase Hosting serves our optimized Vite production bundle over a global CDN. This ensures the dashboard loads instantly worldwide and provides automatic SSL provisioning for secure communication with the backend.

## 6. Vertex AI AutoML (Simulated)
In a production environment, EQUA intercepts decisions from live AI models hosted on Vertex AI.

### How it is used:
For the current prototype, we **simulate** the Vertex AI prediction endpoint using deterministic scoring logic. This allows us to demonstrate the full counterfactual interception workflow—including disparity detection and Gemini auditing—at zero cost while remaining architecturally compatible with a live Vertex AI integration.

---

| Google Service | SDK/Package | Purpose |
|---|---|---|
| **Gemini 2.5 Flash Lite** | `@google/generative-ai` | AI Fairness auditing and remediation |
| **Cloud Run** | `Dockerfile` | Secure, scalable backend proxy |
| **Firebase RTDB** | `firebase-admin` | Real-time audit log persistence |
| **Firebase Admin SDK** | `firebase-admin` | Server-side authentication and database writes |
| **Cloud Build** | `cloudbuild.yaml` | Automated CI/CD pipeline |
| **Firebase Hosting** | `firebase-tools` | Global CDN for React frontend |
| **Vertex AI AutoML** | `@google-cloud/aiplatform` | Target AI Model (Simulated in Prototype) |

