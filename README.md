# EQUA: AI Bias Firewall

EQUA is a real-time, zero-latency proxy firewall designed to intercept and audit AI decisions for hidden demographic biases using counterfactual simulations and Google Gemini 2.0 Flash. 

Built for the **Google Solution Challenge 2026**.

## Documentation
Please refer to the following documents for comprehensive details on the project architecture and our experience during the hackathon:

- [Google Services Integration](./GOOGLE_SERVICES.md) - Details on our use of Gemini API, Firebase Hosting, and the Vertex AI ecosystem.
- [System Architecture](./ARCHITECTURE.md) - Deep dive into the counterfactual proxy logic and UI tech stack.
- [Challenges Faced](./CHALLENGES.md) - How we overcame UI latency and Gemini API quota limits.

## Quick Start
```bash
npm install
npm run dev
```

## Features
- **Counterfactual Simulator:** Real-time attribute swapping (Gender, Race, Age).
- **Gemini Fairness Auditor:** Live AI-generated compliance narratives.
- **Fairness Certificates:** Cryptographically simulated audit logs.
- **Retraining Loop:** Automated drift detection visualization.
- **Policy Engine:** Interactive threshold configuration.
