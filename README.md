<div align="center">
  <img src="https://img.icons8.com/external-flat-juicy-fish/64/000000/external-shield-cyber-security-flat-flat-juicy-fish.png" alt="EQUA Logo" width="80" />
  <h1>EQUA: AI Bias Firewall</h1>
  <p><strong>A zero-latency, real-time proxy firewall intercepting demographic bias in AI models before decisions reach the user.</strong></p>
  <p><i>Built for the Google Solution Challenge 2026</i></p>

  [![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)](https://tailwindcss.com/)
  [![Gemini API](https://img.shields.io/badge/Google-Gemini_2.0_Flash-orange.svg)](https://ai.google.dev/)
</div>

---

## 🌍 The Problem: Black-Box Bias
As artificial intelligence rapidly scales to handle critical human infrastructure—loan approvals, hiring, healthcare triage, and criminal justice—we are facing a crisis of **algorithmic bias**. Machine learning models often inherit historical prejudices, penalizing users based on protected demographic attributes (Race, Gender, Age) through hidden proxy variables.

Because these models act as "black boxes," it is nearly impossible for organizations to intercept a biased decision *before* it negatively impacts a human life.

## 🛡️ The Solution: EQUA
**EQUA is an Ethical Infrastructure proxy firewall.** 
It sits as a lightning-fast middleware layer between the client application and the target AI Model (e.g., Vertex AI endpoints). Before any AI decision is returned to the user, EQUA audits it in real-time.

Using **Counterfactual Identity Simulation**, EQUA instantly clones the user's profile, swaps their protected attributes (e.g., changing male to female), and re-queries the model. If the AI changes its decision solely based on that demographic swap, EQUA **blocks** the transaction, logs a cryptographic Fairness Certificate, and generates a real-time compliance audit using **Google Gemini 2.0 Flash**.

---

## ✨ Key Features

- **⚡ Real-Time Counterfactual Simulator**
  Instantly swap protected demographic attributes (Gender, Race, Age) and watch the simulated model's decision shift. 
- **🧠 Gemini AI Fairness Auditor**
  Powered by `@google/generative-ai`, EQUA dynamically constructs prompts containing mathematical disparity deltas and streams back human-readable compliance narratives and actionable ML remediation steps using the `gemini-2.0-flash-lite` model.
- **📜 Fairness Certificates (EU AI Act Ready)**
  Blocked decisions are permanently logged into a cryptographic registry, simulating Google Cloud KMS signatures for non-repudiation.
- **📊 Custom Bias Heatmap & Dashboard**
  Built with zero external charting libraries. All visualizations are high-performance raw SVGs with CSS keyframe micro-animations to ensure zero-latency rendering.
- **🔄 Automated Retraining Loop**
  Visualizes the pipeline for capturing data drift and automatically triggering a Vertex AI retraining job to fix the underlying model bias.
- **⚙️ Policy Engine**
  Interactive sliders allow compliance officers to define strict "Action Thresholds" (e.g., blocking any decision with a >10% disparity delta).

---

## 📚 Technical Documentation

We have prepared extensive documentation detailing the engineering behind EQUA for the Google Solution Challenge judges:

1. [**Google Services Integration (`GOOGLE_SERVICES.md`)**](./GOOGLE_SERVICES.md)
   *Deep dive into our usage of the Gemini API, Firebase Hosting deployment, and the simulated Vertex AI ecosystem.*
2. [**System Architecture (`ARCHITECTURE.md`)**](./ARCHITECTURE.md)
   *Explanation of the proxy logic, counterfactual engine, and our frontend tech stack.*
3. [**Challenges Faced (`CHALLENGES.md`)**](./CHALLENGES.md)
   *How we overcame UI latency bottlenecks and Gemini API Quota limits using resilient fallback architectures.*

---

## 🛠️ Installation & Setup

Want to run EQUA locally? It takes less than a minute.

### Prerequisites
- Node.js (v18+)
- A Google AI Studio API Key (for Gemini)

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NEHANGRM/FairSight_AI.git
   cd FairSight_AI/equa
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure your API Key:**
   Open `src/screens/CounterfactualSimulator.jsx` and ensure your Gemini API key is active. *(Note: We have implemented an automatic fallback to simulated text if you exceed your free-tier Google Cloud quota!)*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🎯 UN Sustainable Development Goals (SDGs)
EQUA directly targets:
- **Goal 10: Reduced Inequalities** - By actively preventing algorithmic discrimination in financial, medical, and hiring infrastructure.
- **Goal 16: Peace, Justice, and Strong Institutions** - By bringing transparency, accountability, and explainability to corporate AI systems.

---

<div align="center">
  <p><i>Building a fairer future, one inference at a time.</i></p>
</div>
