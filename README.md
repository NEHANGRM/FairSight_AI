<div align="center">
  <h1>🛡️ EQUA: AI Bias Firewall</h1>
  <p><strong>A zero-latency, real-time proxy firewall intercepting demographic bias in AI models before decisions reach the user.</strong></p>
  <p><i>Built for the Google Solution Challenge 2026</i></p>

  [![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
  [![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
  [![Gemini API](https://img.shields.io/badge/Google-Gemini_2.5_Flash_Lite-orange.svg)](https://ai.google.dev/)
  [![Cloud Run](https://img.shields.io/badge/Google_Cloud-Run-blue.svg)](https://cloud.google.com/run)
  [![Firebase](https://img.shields.io/badge/Firebase-RTDB_&_Admin-yellow.svg)](https://firebase.google.com/)
  [![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)
</div>

---

## 🌍 The Problem: Black-Box Bias
As artificial intelligence rapidly scales to handle critical human infrastructure—loan approvals, hiring, healthcare triage, and criminal justice—we are facing a crisis of **algorithmic bias**. Machine learning models often inherit historical prejudices, penalizing users based on protected demographic attributes (Race, Gender, Age) through hidden proxy variables (e.g., zip codes, employment history).

Because these models act as "black boxes," it is nearly impossible for organizations to intercept a biased decision *before* it negatively impacts a human life. Existing MLOps tools analyze bias *after* the fact (data drift monitoring), which is too late to prevent discriminatory harm.

## 🛡️ The Solution: EQUA
**EQUA is an Ethical Infrastructure proxy firewall.** 
It sits as a lightning-fast middleware layer between the client application and the target AI Model (e.g., Vertex AI endpoints). Before any AI decision is returned to the user, EQUA mathematically audits it in real-time.

Using **Counterfactual Identity Simulation**, EQUA instantly clones the user's profile, swaps their protected attributes (e.g., changing male to female), and re-queries the model. If the AI changes its decision solely based on that demographic swap, EQUA **blocks** the transaction, logs a real-time Fairness Certificate to **Firebase RTDB**, and generates a compliance audit using **Google Gemini 2.5 Flash Lite**.

---

## ⚠️ Key Assumption: Vertex AI Simulation

> **Important for judges:** The current prototype **simulates** the Vertex AI prediction endpoint using deterministic client-side scoring data. This design choice allows us to demonstrate the complete end-to-end interception lifecycle — counterfactual simulation, disparity detection, Gemini-powered audit narrative generation, and Firebase RTDB logging — without incurring Vertex AI inference costs during the hackathon.
>
> **What is LIVE:** Gemini 2.5 Flash Lite API calls (audit narratives) ✅ | Firebase RTDB writes (Fairness Registry) ✅ | Cloud Run deployment ✅ | Cloud Build CI/CD ✅
>
> **What is SIMULATED:** Vertex AI AutoML prediction scoring ⚠️ — The `@google-cloud/aiplatform` SDK is already included in the backend dependencies, and the Express proxy is architecturally ready for seamless Vertex AI endpoint integration. The simulation ensures a fully functional demo with zero ML inference cost.

---

## 🧠 Powered by the Google Ecosystem

EQUA heavily leverages Google Cloud and AI to deliver a production-grade firewall:

- **Google Gemini API (`gemini-2.5-flash-lite`):** Acts as the real-time AI Fairness Auditor. Our Express backend securely orchestrates inference, constructing prompts with mathematical disparity deltas to generate human-readable compliance narratives. ✅ **LIVE**
- **Google Cloud Run:** Hosts our containerized Express.js backend, providing auto-scaling, high availability, and a secure environment for our API keys. ✅ **LIVE**
- **Firebase Realtime Database & Admin SDK:** Provides the persistence layer for the Fairness Registry. All blocked decisions are securely logged server-side via the Admin SDK for non-repudiable auditing. ✅ **LIVE**
- **Google Cloud Build:** Automates our CI/CD pipeline, ensuring that every push to the repository is tested, containerized, and deployed to Cloud Run. ✅ **LIVE**
- **Firebase Hosting:** Serves the optimized React frontend with global low-latency. ✅ **LIVE**
- **Vertex AI AutoML (Simulated):** In the production architecture, Vertex AI hosts the target ML model being audited. The prototype simulates this endpoint to demonstrate the counterfactual interception flow at zero cost. ⚠️ **SIMULATED**

*(See our [GOOGLE_SERVICES.md](./GOOGLE_SERVICES.md) for full technical details).*

---

## 🏗️ System Architecture

EQUA's architecture relies on a strict zero-trust approach to algorithmic inference, now fortified with a secure backend proxy.

```mermaid
graph TB
    subgraph Client["Frontend Layer — Firebase Hosting"]
        A["React 19 SPA<br/>(Vite + Tailwind v4)"]
        A1["Counterfactual Simulator"]
        A2["Bias Heatmap (SVG)"]
        A3["Policy Engine"]
        A4["Fairness Certificates"]
    end

    subgraph Backend["Backend Layer — Google Cloud Run"]
        B["Express.js Proxy<br/>(Docker Container)"]
        B1["Counterfactual<br/>Orchestrator"]
        B2["Gemini Prompt<br/>Constructor"]
        B3["Firebase Admin<br/>Writer"]
        B --> B1 & B2 & B3
    end

    subgraph GoogleAI["Google AI Services"]
        C["Gemini 2.5 Flash Lite<br/>AI Fairness Auditor ✅"]
        D["Vertex AI AutoML<br/>(Simulated in Prototype ⚠️)"]
    end

    subgraph Persistence["Persistence — Firebase RTDB ✅"]
        E["Fairness Registry<br/>(Decision Logs)"]
    end

    A1 -- "REST /api/intercept" --> B
    B1 -- "Prediction Request<br/>(Original + Counterfactual)" --> D
    B2 -- "Audit Prompt" --> C
    B3 -- "Admin SDK Write" --> E
    B -- "Audit Response" --> A1

    style Client fill:#1a1a2e,stroke:#3b82f6,color:#e2e8f0
    style Backend fill:#1a1a2e,stroke:#10b981,color:#e2e8f0
    style GoogleAI fill:#1a1a2e,stroke:#f59e0b,color:#e2e8f0
    style Persistence fill:#1a1a2e,stroke:#ef4444,color:#e2e8f0
    style D fill:#2d2d3f,stroke:#f59e0b,color:#f59e0b,stroke-dasharray: 5 5
```

> **Diagram Legend:** Solid borders = LIVE services. Dashed border (Vertex AI AutoML) = Simulated in prototype.

---

## 🔄 Data Flow (Sequence Diagram)

```mermaid
sequenceDiagram
    participant Client as React Frontend
    participant Proxy as EQUA Express Proxy (Cloud Run)
    participant AI as Vertex AI Endpoint (Simulated)
    participant Gemini as Gemini 2.5 API ✅
    participant RTDB as Firebase Realtime DB ✅

    Client->>Proxy: 1. Request AI Inference (User Data)
    Proxy->>AI: 2. Forward Initial Request
    AI-->>Proxy: 3. Return Initial Decision (e.g. Score: 91.4)
    
    rect rgb(30, 30, 40)
    Note over Proxy: 4. Counterfactual Simulation Phase
    Proxy->>Proxy: Identify Protected Attributes (Race, Gender, Age)
    Proxy->>Proxy: Swap Attributes (e.g. Male -> Female)
    end

    Proxy->>AI: 5. Forward Counterfactual Request
    AI-->>Proxy: 6. Return Counterfactual Decision (e.g. Score: 61.8)
    
    Proxy->>Proxy: 7. Calculate Disparity Delta (Δ = -29.6)
    
    alt Disparity Δ > Policy Threshold (e.g. ±10%)
        Proxy->>Gemini: 8. Send Delta & Features for Audit
        Gemini-->>Proxy: 9. Return Compliance Narrative & ML Fix
        Proxy->>RTDB: 10. Log Decision (Admin SDK)
        Proxy-->>Client: 11. BLOCK Transaction (Return Audit Report)
    else Disparity Δ ≤ Policy Threshold
        Proxy-->>Client: 8. ALLOW Transaction (Return Initial Decision)
    end
```

*(See our [ARCHITECTURE.md](./ARCHITECTURE.md) for a deep dive into the proxy logic and component diagrams).*

---

## ✨ Core Capabilities

- **⚡ Real-Time Counterfactual Simulator**
  Instantly swap protected demographic attributes (Gender, Race, Age) and watch the simulated model's decision shift. Vertex AI prediction scoring is simulated with deterministic data; Gemini audit narratives are generated live.
- **📜 Fairness Certificates (Firebase Integrated)**
  Blocked decisions are permanently logged into a real-time registry on Firebase, providing a production-grade audit trail.
- **📊 Custom Bias Heatmap & Dashboard**
  Built with zero external charting libraries. All visualizations are high-performance raw SVGs with CSS keyframe micro-animations to ensure zero-latency rendering.
- **🔄 Automated Retraining Loop**
  Visualizes the pipeline for capturing data drift and automatically triggering a Vertex AI retraining job to fix the underlying model bias. *(Pipeline is visualized; Vertex AI retraining is a planned future integration.)*
- **⚙️ Policy Engine**
  Interactive sliders allow compliance officers to define strict "Action Thresholds" (e.g., blocking any decision with a >10% disparity delta).

---

## 🎯 UN Sustainable Development Goals (SDGs)
EQUA was built specifically to address:
- **Goal 10: Reduced Inequalities** - By actively preventing algorithmic discrimination in financial, medical, and hiring infrastructure, ensuring equal opportunity regardless of demographic background.
- **Goal 16: Peace, Justice, and Strong Institutions** - By bringing transparency, accountability, and explainability to corporate AI systems, bridging the gap between abstract ML mathematics and practical enterprise compliance.

---

## 💰 Cost Estimation

EQUA runs entirely on the **Google Cloud Free Tier** at prototype scale — **$0.00/month**. At production scale (10,000 decisions/day), the total cost is approximately **$9.00/month**, making AI fairness compliance accessible to any organization.

*(See our detailed [ESTIMATED_COST.md](./ESTIMATED_COST.md) for a full cost breakdown by service.)*

---

## 🚀 Future Development

EQUA's roadmap includes live Vertex AI AutoML endpoint integration, automated retraining pipelines via Vertex AI Pipelines + BigQuery, EU AI Act compliance report generation, multi-cloud AI model support, and official SDKs for Node.js, Python, and React.

*(See our [FUTURE_DEVELOPMENT.md](./FUTURE_DEVELOPMENT.md) for the complete roadmap.)*

---

## 🛠️ Installation & Setup

EQUA now uses a full-stack architecture for enhanced security.

### Prerequisites
- Node.js (v20+)
- Docker (optional, for local container testing)
- Firebase Project & Gemini API Key

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NEHANGRM/FairSight_AI.git
   cd FairSight_AI/equa
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder and add your credentials:
   ```env
   GEMINI_API_KEY=your_key
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", ...}'
   FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
   ```
   Start the backend:
   ```bash
   npm start
   ```

3. **Frontend Setup:**
   Open a new terminal in the root `equa` directory:
   ```bash
   npm install
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 🏆 Hackathon Challenges

Building a production-grade AI Bias Firewall required overcoming massive UI latency bottlenecks and managing strict Gemini API Quota limits. Our biggest milestone was re-architecting the system to a secure backend proxy to protect AI credentials while maintaining sub-second audit latency.

*(Read our full technical post-mortem in [CHALLENGES.md](./CHALLENGES.md)).*

---

## 📚 Documentation Index

| Document | Description |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture diagrams, component breakdown, security posture |
| [GOOGLE_SERVICES.md](./GOOGLE_SERVICES.md) | Detailed Google Cloud & Firebase integration documentation |
| [ESTIMATED_COST.md](./ESTIMATED_COST.md) | Cost estimation at prototype, production, and enterprise scale |
| [FUTURE_DEVELOPMENT.md](./FUTURE_DEVELOPMENT.md) | Phase 1-3 development roadmap with technical details |
| [CHALLENGES.md](./CHALLENGES.md) | Technical challenges and solutions during development |

---
<div align="center">
  <p><i>Building a fairer future, one inference at a time.</i></p>
</div>
