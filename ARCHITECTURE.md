# System Architecture

EQUA is built as a highly interactive, client-side application designed to simulate the experience of a real-time AI Bias Firewall.

## Tech Stack
- **Frontend Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **AI Integration:** Google Generative AI SDK (`@google/generative-ai`)
- **Deployment:** Firebase Hosting

## Core Architecture Flow

1. **Model Interception (Simulated):**
   EQUA sits as a middleware proxy between a client application (e.g., a Loan Approval system) and the actual AI inference endpoint. When a request is made, EQUA scores it.

2. **Counterfactual Engine:**
   For high-risk decisions, EQUA runs a counterfactual simulation. It swaps a protected attribute (e.g., Race, Gender, Age) and queries the model again. If the `Decision Probability Δ` exceeds the defined policy threshold (e.g., ±10%), the firewall **Blocks** the decision.

3. **Gemini Auditing (Live API):**
   Blocked decisions are passed to the Gemini API. A dynamic prompt is constructed containing the original score, counterfactual score, and the swapped attribute. Gemini returns a real-time compliance narrative explaining the bias and suggesting technical ML fixes.

4. **Compliance & Certification:**
   The blocked decision is logged in the `Fairness Certificates` registry. A cryptographic hash is generated (simulating Google Cloud KMS) to create a permanent, tamper-proof record of the audit, ensuring compliance with regulations like the EU AI Act.

## Design Philosophy: "Ethical Infrastructure"
The UI is built entirely without external charting libraries. All heatmaps, nodes, and metric charts are custom-built using raw SVG paths and precise CSS keyframe animations. This ensures maximum performance, complete stylistic control, and a unique "cyber-compliance" aesthetic.
