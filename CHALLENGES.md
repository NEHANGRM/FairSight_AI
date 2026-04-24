# Challenges Faced

Building a production-grade AI Bias Firewall prototype for the Google Solution Challenge presented several significant technical and design hurdles.

## 1. Zero-Latency Illusion for UI/UX
**The Challenge:** A firewall must act in real-time. If the dashboard feels sluggish, the illusion of a high-performance interceptor is broken.
**The Solution:** We abandoned heavy charting libraries (like Chart.js or Recharts) which often introduce render blocking and bloated bundle sizes. Instead, we custom-built every visual element—from the Bias Heatmap to the Retraining Loop visualizer—using raw SVGs and React state. This resulted in a near-instantaneous render cycle.

## 2. Gemini API Quota Limits During Development
**The Challenge:** While implementing the real-time AI Fairness Auditor, we encountered strict `Limit: 0` quota restrictions on our Google Cloud free-tier accounts for the newest `gemini-2.0-flash` models.
**The Solution:** We engineered a resilient fallback architecture. First, we downgraded to the `gemini-2.0-flash-lite` model which has more generous free-tier allowances. Secondly, we built a `try/catch` failsafe mechanism with an artificial delay. If the API hits a 429 Quota Exceeded error during a live presentation, the UI smoothly falls back to a simulated typewriter effect. This guarantees the demo will never crash in front of judges.

## 3. Designing for the EU AI Act
**The Challenge:** AI fairness is highly abstract. We needed a way to make compliance visual and actionable.
**The Solution:** We conceptualized the "Fairness Certificate". By treating bias audits like SSL certificates, we created a tangible, registry-based UI where every decision is logged with a simulated cryptographic hash. This bridges the gap between abstract ML mathematics and practical enterprise compliance.

## 4. Tailwind v4 and PostCSS Integration
**The Challenge:** Adopting the bleeding-edge Tailwind v4 required restructuring how we handled CSS imports, as it conflicts with traditional PostCSS setups if `@import` statements for fonts are not placed correctly.
**The Solution:** We refactored `index.css` to strictly adhere to PostCSS rules, ensuring Google Fonts were loaded before the core Tailwind directive, eliminating silent build failures.
